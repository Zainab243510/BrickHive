import crypto from "crypto";
import mongoose from "mongoose";
import Stripe from "stripe";
import Payment from "../models/payment.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const newOrderId = () =>
  `BNC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

const priceFor = (listing) =>
  listing.offer ? listing.discountPrice : listing.regularPrice;

// POST /api/payments/initiate  { listingId }
// Creates a pending Payment + a Stripe Checkout Session and returns the
// hosted-checkout URL for the client to redirect to.
export const initiatePayment = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const [listing, buyer] = await Promise.all([
      Listing.findById(listingId),
      User.findById(req.user.id).select("email username"),
    ]);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    if (listing.userRef === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot purchase your own listing" });
    }
    if (listing.status !== "available") {
      return res.status(400).json({ message: "Listing is no longer available" });
    }

    const amount = priceFor(listing);
    const currency = (process.env.STRIPE_CURRENCY || "PKR").toLowerCase();
    const orderId = newOrderId();

    const payment = await Payment.create({
      buyer: req.user.id,
      listing: listing._id,
      seller: listing.userRef,
      amount,
      currency: currency.toUpperCase(),
      gatewayOrderId: orderId,
      status: "pending",
    });

    const clientUrl = process.env.CLIENT_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyer.email,
      client_reference_id: orderId,
      // Stripe expects amounts in the currency's smallest unit (paisa for PKR,
      // cents for USD) — multiply by 100 for any 2-decimal currency.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: listing.name.slice(0, 250),
              description: `BRICKnCLICK listing — ${listing.address || ""}`.slice(0, 500),
            },
          },
        },
      ],
      metadata: {
        orderId,
        listingId: String(listing._id),
        buyerId: String(req.user.id),
      },
      success_url: `${clientUrl}/payment/success?orderId=${orderId}`,
      cancel_url: `${clientUrl}/payment/cancel?orderId=${orderId}`,
    });

    payment.gatewayTxnId = session.id;
    await payment.save();

    return res.status(200).json({
      paymentId: payment._id,
      orderId,
      url: session.url,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/webhook  (PUBLIC — called by Stripe)
// Mounted with express.raw() in api/index.js so the signature can be verified
// against the unparsed request body.
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        if (!orderId) break;

        const payment = await Payment.findOne({ gatewayOrderId: orderId });
        if (!payment) break;
        if (payment.status === "success") break;

        const paidAmount = (session.amount_total || 0) / 100;
        if (Math.abs(paidAmount - payment.amount) > 0.01) {
          payment.status = "failed";
          payment.rawEvent = event;
          await payment.save();
          break;
        }

        payment.status = "success";
        payment.gatewayTxnId = session.payment_intent || session.id;
        payment.rawEvent = event;
        await payment.save();

        const listing = await Listing.findById(payment.listing);
        if (listing && listing.status === "available") {
          listing.status = listing.type === "rent" ? "rented" : "sold";
          await listing.save();
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        if (!orderId) break;

        const payment = await Payment.findOne({ gatewayOrderId: orderId });
        if (payment && payment.status === "pending") {
          payment.status = "cancelled";
          payment.rawEvent = event;
          await payment.save();
        }
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return res.status(500).send("webhook handler error");
  }
};

// GET /api/payments/order/:orderId — buyer polls this from the success page.
export const getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      gatewayOrderId: req.params.orderId,
    }).populate("listing");
    if (!payment) return res.status(404).json({ message: "Not found" });
    if (payment.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/my — list buyer's purchases.
export const getMyPurchases = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      buyer: req.user.id,
      status: "success",
    })
      .populate("listing")
      .sort({ createdAt: -1 });
    return res.status(200).json(payments);
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/cancel/:orderId — fired when the user lands on the cancel page.
export const cancelPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      gatewayOrderId: req.params.orderId,
    });
    if (!payment) return res.status(404).json({ message: "Not found" });
    if (payment.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (payment.status === "pending") {
      payment.status = "cancelled";
      await payment.save();
    }
    return res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};

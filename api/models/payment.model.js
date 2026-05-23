import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    seller: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "PKR",
    },
    fee: {
      type: Number,
      default: 0,
    },
    gateway: {
      type: String,
      default: "stripe",
    },
    // Our internal order id, sent to Stripe as `client_reference_id`.
    gatewayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Stripe Checkout Session id (pre-payment) → PaymentIntent id (after success).
    gatewayTxnId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    // Raw webhook event payload kept for audit/debugging.
    rawEvent: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

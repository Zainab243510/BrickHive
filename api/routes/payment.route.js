import express from "express";
import {
  initiatePayment,
  getPaymentStatus,
  getMyPurchases,
  cancelPayment,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/initiate", verifyToken, initiatePayment);
router.get("/order/:orderId", verifyToken, getPaymentStatus);
router.post("/cancel/:orderId", verifyToken, cancelPayment);
router.get("/my", verifyToken, getMyPurchases);

export default router;

import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications); 
router.put("/mark-read/:notifId", markNotificationAsRead);

export default router;

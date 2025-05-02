import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    getNotification,
    markAsRead,
    sendEmailNotification,
    sendNotification
} from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/send", protectRoute, sendNotification);
router.get("/get", protectRoute, getNotification);
router.put("/read/:id", protectRoute, markAsRead);

// Test route for send email notification
router.post("/email", protectRoute, sendEmailNotification);

export default router;

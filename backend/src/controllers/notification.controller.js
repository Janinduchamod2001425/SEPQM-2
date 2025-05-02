import Notification from '../models/notification.model.js';
import {io} from '../index.js';

// Send a notification
export const sendNotification = async (req, res) => {
    try {
        const {userId, message} = req.body; // Extract userId and message from request body

        if (!userId || !message) {
            return res.status(400).json({message: "User ID and message are required"});
        }

        // Save notification to MongoDB
        const newNotification = new Notification({userId, message});
        await newNotification.save();

        io.to(userId.toString()).emit("notification", {message});

        return res.status(200).json({message: "Notification sent successfully"});
    } catch (error) {
        console.error("Error sending notification", error.message);
        return res.status(500).json({message: "Error sending notification"});
    }
}

// get notification
export const getNotification = async (req, res) => {
    try {
        const notification = await Notification.find({userId: req.user.id}).sort({createdAt: -1});

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error getting notifications", error.message);
        return res.status(500).json({message: "Error getting notifications"});
    }
}

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const {id} = req.params;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({message: "Notification not found"});
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({message: "Notification marked as read"});

    } catch (error) {
        console.error("Error marking notification as read", error.message);
        return res.status(500).json({message: "Error marking notification as read"});
    }
}

// Send Email Notification (Just for testing)
export const sendEmailNotification = async (req, res) => {
    try {
        const {_id, email} = req.user;
        const message = "This is an test email notification sent from your Node.js server";

        await NotificationService.sendNotification(_id, message);
        
        return res.status(200).json({message: `✅ Email sent successfully to ${email}`});
    } catch (error) {
        console.error("Error sending email notification", error.message);
        return res.status(500).json({message: "Error sending email notification"});
    }
}

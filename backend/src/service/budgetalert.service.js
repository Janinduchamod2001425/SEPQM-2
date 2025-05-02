import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

const AlertService = {
    async sendBudgetAlert(userId, message) {
        try {
            // Fetch user from the database
            const user = await User.findById(userId);

            // Check if user exists
            if (!user) {
                return console.log(`User not found for ID: ${userId}`);
            }

            // Send email notification (Push notification)
            await sendEmail(user.email, "Budget Reminder", message);

            // Log successful notification
            console.log(`Notification sent to ${user.email}: ${message}`);
        } catch (error) {
            // Log error if notification fails
            console.error("Error sending notification: ", error.message);
        }
    }
}

export default AlertService;
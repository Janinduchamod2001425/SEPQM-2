import mongoose from "mongoose";
import User from "../models/user.model.js";
import Budget from '../models/budget.model.js';
import sendEmail from "../utils/sendEmail.js";

// Define a default subject for spending alerts
const DEFAULT_ALERT_SUBJECT = "💰 FinTrackr - Unusual Spending Alert";

// Define fixed spending thresholds for each category
const CATEGORY_THRESHOLDS = {
    Food: 2000,
    Transportation: 1000,
    Entertainment: 1500,
    Salary: 0,
    Utilities: 5000,
    Rent: 10000,
    Gaming: 3000,
    Other: 5000,
};

// Function to detect unusual spending on transactions
export const watchTransactions = () => {
    const transactionCollection = mongoose.connection.collection("transactions");

    transactionCollection.watch().on("change", async (change) => {
        if (change.operationType === "insert") {
            const {userId, amount, category, type} = change.fullDocument;

            // Alert only for "expense" type transactions
            if (type !== "expense") return;

            // Fetch user email
            const user = await User.findById(userId);
            if (!user) return;

            // Get the current month for budget lookup
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM format

            // Check if the user has set a budget for this category
            const userBudget = await Budget.findOne({userId, category, month});

            // Use the user-defined budget if available; otherwise, use the default threshold
            const categoryThreshold = userBudget ? userBudget.amount : (CATEGORY_THRESHOLDS[category] || 0);

            // Check if the transaction amount exceeds the category threshold
            if (amount > categoryThreshold) {
                const alertMessage = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center; padding: 20px; background-color: #007bff; border-radius: 10px 10px 0 0;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">⚠️ Unusual Spending Alert</h2>
                        </div>
                        
                        <!-- Cloudinary Image -->
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="https://res.cloudinary.com/dw0kg1jfw/image/upload/v1742484205/fintrackr_rdjtxv.png" 
                                 alt="Spending Alert" 
                                 style="max-width: 100%; height: auto; border-radius: 8px;">
                        </div>
                        
                        <div style="padding: 20px;">
                            <p style="font-size: 16px; color: #333333;">Dear ${user.name},</p>
                            <p style="font-size: 16px; color: #333333;">We've detected an <strong>unusual spending pattern</strong> in your <strong>${category}</strong> category.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 10px; font-size: 14px; color: #555555;">
                                        <strong>🪙 Recent Transaction:</strong> $${amount.toFixed(2)}
                                    </li>
                                    <li style="font-size: 14px; color: #555555;">
                                        <strong>🪙 Category Threshold:</strong> $${categoryThreshold.toFixed(2)}
                                    </li>
                                </ul>
                            </div>
                            
                            <p style="font-size: 16px; color: #333333; margin-top: 20px;">
                                This transaction exceeds the spending threshold for the <strong>${category}</strong> category.
                            </p>
                            <p style="font-size: 16px; color: #333333;">
                                If you recognize this transaction, no action is needed. Otherwise, we recommend reviewing your expenses.
                            </p>
                            
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="https://fintrackr.com/login" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                    🔍 View Transactions
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #777777; text-align: center;">
                                Stay on top of your finances with <strong>FinTrackr</strong>.
                            </p>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                            <p style="font-size: 14px; color: #555555; margin: 0;">
                                Best regards,<br>💰 <strong>FinTrackr Team</strong>
                            </p>
                        </div>
                    </div>
                `;
                // Send email alert
                await sendEmail(user.email, DEFAULT_ALERT_SUBJECT, alertMessage);
            } else {
                console.log("No unusual spending detected.");
            }
        }
    });

    console.log("👀 Transaction watcher started...");
}
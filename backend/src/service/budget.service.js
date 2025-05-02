import mongoose from "mongoose";
import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";
import sendEmail from "../utils/sendEmail.js";
import moment from "moment";

// Define a default subject for budget alerts
const DEFAULT_BUDGET_ALERT_SUBJECT = "📊 FinTrackr - Budget Limit Alert";

// Watch for new transactions and check the budget
export const watchBudgetStatus = () => {
    const transactionCollection = mongoose.connection.collection("transactions");

    transactionCollection.watch().on("change", async (change) => {
        if (change.operationType === "insert") {
            const {userId, amount, category, date} = change.fullDocument;

            // Get current month
            const month = moment(date).format("YYYY-MM");

            // Fetch user's budget for this category
            const budget = await Budget.findOne({userId, category, month});

            if (!budget) return; // No budget set for this category

            // Fetch total spent for this category in the current month
            const transactions = await Transaction.find({
                userId,
                category,
                date: {$gte: moment().startOf("month")},
            });

            const totalSpent = transactions.reduce((acc, tnx) => acc + tnx.amount, 0);
            const remaining = budget.amount - totalSpent;

            let status = "safe";
            let message = null;

            if (totalSpent >= budget.amount * 0.9 && totalSpent <= budget.amount) {
                status = "warning";
                message = `⚠️ You're close to exceeding your budget for ${category}. Be cautious!`;
            } else if (totalSpent > budget.amount) {
                status = "exceeded";
                message = `🚨 Budget for ${category} exceeded! Reduce your spending.`;
            }

            // Fetch user email
            const user = await User.findById(userId);
            if (!user || !message) return;

            // Construct alert email
            const alertMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                    <div style="text-align: center; padding: 20px; background-color: #28a745; border-radius: 10px 10px 0 0;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">📊 Budget Limit Alert</h2>
                    </div>

                    <!-- Cloudinary Image -->
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="https://res.cloudinary.com/dw0kg1jfw/image/upload/v1742484205/fintrackr_rdjtxv.png" 
                             alt="Budget Alert" 
                             style="max-width: 100%; height: auto; border-radius: 8px;">
                    </div>

                    <div style="padding: 20px;">
                        <p style="font-size: 16px; color: #333333;">Dear ${user.name},</p>
                        <p style="font-size: 16px; color: #333333;">Your budget for <strong>${category}</strong> is at risk.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 10px; font-size: 14px; color: #555555;">
                                    <strong>🪙 Total Spent:</strong> $${totalSpent.toFixed(2)}
                                </li>
                                <li style="font-size: 14px; color: #555555;">
                                    <strong>🪙 Budget Limit:</strong> $${budget.amount.toFixed(2)}
                                </li>
                                <li style="font-size: 14px; color: #555555;">
                                    <strong>🪙 Remaining Budget:</strong> $${remaining.toFixed(2)}
                                </li>
                            </ul>
                        </div>
                        
                        <p style="font-size: 16px; color: #333333;">
                            ${message}
                        </p>

                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://fintrackr.com/login" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                                📊 View Budget
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #777777; text-align: center;">
                            Manage your budget effectively with <strong>FinTrackr</strong>.
                        </p>
                    </div>

                    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 14px; color: #555555; margin: 0;">
                            Best regards,<br>💰 <strong>FinTrackr Team</strong>
                        </p>
                    </div>
                </div>
            `;

            // Send email notification
            await sendEmail(user.email, DEFAULT_BUDGET_ALERT_SUBJECT, alertMessage);
        }
    });

    console.log("👀 Budget watcher started...");
};

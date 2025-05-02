import mongoose from "mongoose";
import Goal from "../models/goal.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import moment from "moment";

const DEFAULT_GOAL_ALERT_SUBJECT = "🎯 FinTrackr - Goal Progress Update";

// Watch for goal progress updates
export const watchGoals = () => {
    const goalCollection = mongoose.connection.collection("goals");

    goalCollection.watch().on("change", async (change) => {
        if (change.operationType !== "update") return;

        const {documentKey} = change;
        const goal = await Goal.findById(documentKey._id);
        if (!goal) return;

        // Fetch user details
        const user = await User.findById(goal.userId);
        if (!user) {
            console.log("⚠️ User not found.");
            return;
        }

        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = Math.floor((goal.deadline - new Date()) / (1000 * 60 * 60 * 24));

        let status = "on track";
        let message = null;

        if (daysLeft < 5) {
            status = "urgent";
            message = `⏳ Hurry! Your goal <b>${goal.title}</b> is expiring in just <b>${daysLeft} days</b>.`;
        } else if (progress < 50 && daysLeft < 30) {
            status = "warning";
            message = `📊 You're at only <b>${progress.toFixed(1)}%</b> of your goal <b>${goal.title}</b> with less than <b>30 days</b> remaining. Try saving more!`;
        }

        if (!message) return;

        // Construct the email
        const alertMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                <div style="text-align: center; padding: 20px; background-color: #b50404; border-radius: 10px 10px 0 0;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 24px;">🎯 Goal Progress Alert</h2>
                </div>

                <!-- Cloudinary Image -->
                <div style="text-align: center; margin: 20px 0;">
                    <img src="https://res.cloudinary.com/dw0kg1jfw/image/upload/v1742484205/fintrackr_rdjtxv.png" 
                         alt="Budget Alert" 
                         style="max-width: 100%; height: auto; border-radius: 8px;">
                </div>

                <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #333333;">Dear ${user.name},</p>
                    <p style="font-size: 16px; color: #333333;">Here's an update on your goal ${goal.title}.</p>

                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 10px; font-size: 14px; color: #555555;">
                                <strong>📅 Days Left:</strong> ${daysLeft} days
                            </li>
                            <li style="font-size: 14px; color: #555555;">
                                <strong>🎯 Goal Progress:</strong> ${progress.toFixed(1)}%
                            </li>
                            <li style="font-size: 14px; color: #555555;">
                                <strong>🏆 Target Amount:</strong> $${goal.targetAmount.toFixed(2)}
                            </li>
                            <li style="font-size: 14px; color: #555555;">
                                <strong>💰 Current Savings:</strong> $${goal.currentAmount.toFixed(2)}
                            </li>
                        </ul>
                    </div>

                    <p style="font-size: 16px; color: #333333;">
                        ${message}
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://fintrackr.com/goals" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #b50404; text-decoration: none; border-radius: 5px;">
                            🎯 View My Goals
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #777777; text-align: center;">
                        Keep working towards your goal with <strong>FinTrackr</strong>.
                    </p>
                </div>

                <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 14px; color: #555555; margin: 0;">
                        Best regards,<br>🏆 <strong>FinTrackr Team</strong>
                    </p>
                </div>
            </div>
        `;

        // Send email notification
        await sendEmail(user.email, DEFAULT_GOAL_ALERT_SUBJECT, alertMessage);
    });

    console.log("👀 Goal watcher started...");
};

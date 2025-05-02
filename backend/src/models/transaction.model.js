import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Food", "Transportation", "Entertainment", "Salary", "Utilities", "Rent", "Gaming", "Other"],
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurrence: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly", "none"],
        default: "none",
    },
    nextOccurrence: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Transaction", transactionSchema);
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    month: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model("Budget", budgetSchema);
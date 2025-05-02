import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min: [1, "Target amount must be greater than zero"]
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, "Current amount cannot be negative"]
    },
    deadline: {
        type: Date,
        required: true
    },
    autoAllocate: {
        type: Boolean,
        default: false
    },
    allocationPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model("Goal", goalSchema);
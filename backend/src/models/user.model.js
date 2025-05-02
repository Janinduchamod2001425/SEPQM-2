import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    },
);

// Middleware to set a role automatically before saving
userSchema.pre("save", function (next) {
    if (this.email.includes("admin")) {
        this.role = "admin";
    } else {
        this.role = "user";
    }
    next();
});

export default mongoose.model("User", userSchema);

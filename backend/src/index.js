import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Database connection
import {connectDB} from "./lib/db.js";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import budgetRoutes from "./routes/budget.route.js";
import reportRoutes from "./routes/report.route.js";
import goalRoutes from "./routes/goal.route.js";
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';

// Error handlers
import {errorHandler} from "./middleware/error.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to the database before start the server
connectDB().then(r => {
    console.log("✅ Database Connected!");
});

// Middleware
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded data
app.use(errorHandler); // Apply global error handler

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})



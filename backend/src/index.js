import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {Server} from "socket.io";
import * as http from "node:http";

// Database connection
import {connectDB} from "./lib/db.js";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import budgetRoutes from "./routes/budget.route.js";
import reportRoutes from "./routes/report.route.js";
import goalRoutes from "./routes/goal.route.js";
import notificationRoutes from './routes/notification.route.js';
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
app.use(cors());
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
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Create http server for Express + WebSockets
const server = http.createServer(app);

// WebSocket setup and listening on the same server
export const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

// web socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join to a room based on user id
    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${socket.id}`);
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server on the specified port
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
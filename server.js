
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();

// Security
app.use(helmet());

// Frontend connection
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
}));

// Main route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Professional To-Do List API is running!"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Not found
app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found."
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();

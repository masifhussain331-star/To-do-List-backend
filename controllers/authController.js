
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.json({
        success: true,
        message: "Logged out successfully."
    });
};

// CURRENT USER
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch user."
        });
    }
};

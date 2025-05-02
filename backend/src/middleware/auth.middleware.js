import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect the routes
export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the jwt cookie
        const token = req.cookies.jwt;

        // Check if the token is valid
        if (!token) {
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is valid
        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid token"});
        }

        // Check if the user exists
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        // Set the user in the request object
        req.user = user;

        // Call the next middleware
        next();
    } catch (error) {
        console.log("Error in Protect Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Middleware to protect admin routes separately
export const adminProtectRoute = async (req, res, next) => {
    try {
        // Check if the user exists and has the admin role
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({message: "Unauthorized - User is not an admin"});
        }

        // proceed to next middleware
        next();
        
    } catch (error) {
        console.log("Error in Admin Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}
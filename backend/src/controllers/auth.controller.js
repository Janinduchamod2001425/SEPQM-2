import User from "../models/user.model.js"; // Import the User model
import bcrypt from "bcryptjs"; // Import bcrypt to hash passwords
import {generateToken} from "../utils/utils.js"; // Import the generateToken function

// Function to sign up users
export const signUp = async (req, res) => {

    // Destructure the name, email, and password from the request body
    const {name, email, password} = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({message: "All fields required"})
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance with the User model
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Save the hashed password
        });

        // Save the new user to the database
        if (newUser) {
            generateToken(newUser._id, res); // Generate JWT token
            await newUser.save(); // Save the user in the database

            // Send response with the newly created user details
            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            });
        } else {
            res.status(500).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in Signup controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Function to log in users
export const login = async (req, res) => {
    // Destructure the email and password from the request body
    const {email, password} = req.body;

    try {
        // Check if email is valid
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid credentials"}); // send error response
        }

        // Check if the password is correct
        const checkPassword = await bcrypt.compare(password, user.password); // Compare the password

        if (!checkPassword) {
            return res.status(400).json({message: "Password Incorrect"}); // send error response
        }

        const token = generateToken(user._id, res); // Generate JWT token

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        console.log("Error in Login controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Function to log out users
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}

// Function to check if user is authenticated
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in CheckAuth controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}
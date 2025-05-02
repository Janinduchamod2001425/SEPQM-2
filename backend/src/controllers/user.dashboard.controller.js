import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";
import Goal from "../models/goal.model.js";
import User from "../models/user.model.js";

// get Budgets belongs to logged in user
export const getBudgetsByUserId = async (req, res) => {
    try {
        // Find all budgets associated with the user
        const budgets = await Budget.find({userId: req.user.id});

        // Check if no budgets were found for the user
        if (!budgets || budgets.length === 0) {
            return res.status(404).json({message: "No budgets found for you"});
        }

        // Return the budgets to the user
        res.status(200).json(budgets);

    } catch (error) {
        console.error("error in get budget by user id controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

// get Transactions belongs to the logged user
export const getTransitionsByUserId = async (req, res) => {
    try {
        // Find all transitions associated with the user
        const transaction = await Transaction.find({userId: req.user.id});

        // Check if no transaction was found for the user
        if (!transaction || transaction.length === 0) {
            return res.status(404).json({message: "No transaction found for you"});
        }

        // Return the transaction to the user
        res.status(200).json(transaction);

    } catch (error) {
        console.error("error in get transaction by user id controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

// get Goals belongs to the logged user
export const getGoalsByUserId = async (req, res) => {
    try {
        // Find all goals associated with the user
        const goals = await Goal.find({userId: req.user.id});

        // Check if no goals were found for the user
        if (!goals || goals.length === 0) {
            return res.status(404).json({message: "No goals found for you"});
        }

        // Return the goals to the user
        res.status(200).json(goals);

    } catch (error) {
        console.error("error in get goal by user id controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

// get user profile
export const getUserProfile = async (req, res) => {
    try {
        // Find the user by id exclude the password
        const user = await User.findById(req.user.id).select("-password");

        // Check if the user was found
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Return the user profile
        res.status(200).json(user);

    } catch (error) {
        console.error("error in get user profile controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}
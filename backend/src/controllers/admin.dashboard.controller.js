import User from '../models/user.model.js';
import Transaction from "../models/transaction.model.js";
import Goal from '../models/goal.model.js';
import Budget from "../models/budget.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        // get user data except the password
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching all users", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// Get total users count
export const getTotalUsersCount = async (req, res) => {
    try {
        const totalCount = await User.countDocuments(); // count all users in the database

        res.status(200).json({total_users: totalCount});
    } catch (error) {
        console.log("Error fetching total users count", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// Get all Transactions
export const getAllTransactions = async (req, res) => {
    try {
        // Find all transactions for the user and sort them by date in descending order
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        // Log the error and send an error response
        console.error("Error in get All Transactions controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get total transactions
export const getTotalTransactionsCount = async (req, res) => {
    try {
        // Count all transactions in the database
        const totalCount = await Transaction.countDocuments();
        res.status(200).json({total_transactions: totalCount});
    } catch (error) {
        console.error("Error in getTotalTransactionsCount controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get all Goals
export const getAllGoals = async (req, res) => {
    try {
        // Find all goals for the user and sort them by date in descending order
        const goals = await Goal.find();
        res.status(200).json(goals);
    } catch (error) {
        // Log the error and send an error response
        console.error("Error in getAllGoals controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Get total goals
export const getTotalGoalsCount = async (req, res) => {
    try {
        // Count all goals in the database
        const totalCount = await Goal.countDocuments();
        res.status(200).json({total_goals: totalCount});
    } catch (error) {
        console.error("Error in getTotalGoalsCount controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get all budgets
export const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error in getAllBudgets controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Get total budgets
export const getTotalBudgetsCount = async (req, res) => {
    try {
        const totalCount = await Budget.countDocuments();
        res.status(200).json({total_budgets: totalCount});
    } catch (error) {
        console.error("Error in getTotalBudgetsCount controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};
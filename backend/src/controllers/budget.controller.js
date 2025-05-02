import Budget from '../models/budget.model.js';
import Transaction from '../models/transaction.model.js';
import moment from "moment";
import AlertService from "../service/budgetalert.service.js";

// add new budget
export const addBudget = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({message: "Unauthorized user - please login"});
    }

    try {
        // Get the category and amount from the request body
        const {category, amount} = req.body;

        // Get the user id from the request
        const userId = req.user.id;

        // Convert the month to the YYYY-MM format
        const month = moment().format("YYYY-MM");

        // Check if the budget already exists
        const existingBudget = await Budget.findOne({
            userId,
            category,
            month
        });

        if (existingBudget) {
            return res.status(400).json({message: "Budget already exists for this category"});
        }

        // Create a new budget
        const newBudget = new Budget({
            userId, category, amount, month
        });

        // Save the budget to the database
        await newBudget.save();

        res.status(201).json({message: "Budget added successfully", budget: newBudget});

    } catch (error) {
        console.error("Error in add budget controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Get all budgets
export const getAllBudgets = async (req, res) => {
    try {
        // Find all budgets for the user and sort by month in descending order
        const budgets = await Budget.find({userId: req.user.id}).sort({month: -1});

        // Get all budget
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error in get all budgets controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get a single budget data
export const getBudgetById = async (req, res) => {
    try {
        // Find the budget by id and check if it belongs to the user
        const budget = await Budget.findOne({_id: req.params.id, userId: req.user.id});

        // Check if the budget exists
        if (!budget) {
            return res.status(404).json({message: "Budget not found"});
        }

        // Send the budget details in the response
        res.status(200).json(budget);

    } catch (error) {
        console.error("Error in get budget by id controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Update the budget
export const updateBudget = async (req, res) => {
    const {category, amount, month} = req.body;

    try {

        const userId = req.user.id;

        const budget = await Budget.findOne({_id: req.params.id, userId});

        if (!budget) {
            return res.status(404).json({message: "Budget not found"});
        }

        // Update the budget details
        budget.amount = amount ?? budget.amount;
        budget.category = category ?? budget.category;
        budget.month = month ?? budget.month;

        // Save the updated budget
        await budget.save();

        res.status(200).json({message: "Budget updated successfully!", budget});

    } catch (error) {
        console.error("Error in update budget controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Delete the budget
export const deleteBudget = async (req, res) => {
    try {
        // Get the user id from the request
        const userId = req.user.id;

        // Find and delete the budget
        const deletedBudget = await Budget.findOneAndDelete({_id: req.params.id, userId});

        if (!deletedBudget) {
            return res.status(404).json({message: "Budget not found"});
        }

        res.status(200).json({message: "Budget deleted successfully!"});
    } catch (error) {
        console.error("Error in add budget controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Check budget status
// Should change as checkBudgetStatus = async (user) => {}
// Call like this for testing purposes
export const checkBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        const month = moment().format("YYYY-MM");

        // Fetch budget for the current month
        const budget = await Budget.find({userId, month});

        // Fetch transactions for the current month
        const transactions = await Transaction.find({
            userId,
            date: {$gte: moment().startOf("month")}
        });

        // Handle case where transactions might be empty or null
        if (!transactions || transactions.length === 0) {
            return res.status(200).json({message: "No transactions found for this month."});
        }

        let budgetStatus = budget.map(budget => {
            const spent = transactions
                .filter(tnx => tnx.category === budget.category)
                .reduce((acc, tnx) => acc + tnx.amount, 0);

            const remaining = budget.amount - spent;
            let status = "safe";
            let message = null;

            if (spent >= budget.amount * 0.9 && spent <= budget.amount) {
                // Near the budget limit
                status = "warning";
                message = `⚠️ You're near your budget limit for ${budget.category}. Be cautious!`;
            } else if (spent > budget.amount) {
                // Exceeded the budget limit
                status = "Exceeded";
                message = `⚠️ Budget for ${budget.category} exceeded! Reduce spending.`;
            } else {
                // No warning or exceed, user is within the budget
                status = "within limit";
                message = `✅ You're within the budget for ${budget.category}.`;
            }

            // Send email notification if necessary
            if (message) {
                AlertService.sendBudgetAlert(userId, message);
            }

            return {category: budget.category, budget: budget.amount, spent, remaining, status};
        });

        res.status(200).json(budgetStatus);

    } catch (error) {
        console.error("Error in check budget status controller: ", error.message);
        res.status(500).json({message: "Error checking budget status", error});
    }
};

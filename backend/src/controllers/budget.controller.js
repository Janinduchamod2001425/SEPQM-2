import Budget from '../models/budget.model.js';
import moment from "moment";

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

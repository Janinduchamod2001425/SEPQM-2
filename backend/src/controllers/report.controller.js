import Transaction from '../models/transaction.model.js';
import mongoose from "mongoose";

// Get Spending Trends
export const getSpendingTrends = async (req, res) => {
    try {
        const userId = req.user.id;

        // Aggregate transactions by month
        const trends = await Transaction.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(userId), type: "expense"}
            },
            {
                $group: {
                    _id: {month: {$month: "$date"}, year: {$year: "$date"}},
                    totalAmount: {$sum: "$amount"}
                }
            },
            {$sort: {"_id.year": 1, "_id.month": 1}}
        ]);

        // Send the spending trends in the response
        return res.status(200).json(trends);
    } catch (error) {
        console.error("Error in Get SpendingTrends controller", error.message);
        return res.status(500).json({error: 'Server Error'});
    }
}

// Get income and expenses for charts
export const getIncomeExpenses = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Aggregate transactions by type (income or expense)
        const summary = await Transaction.aggregate([
            {$match: {userId}},
            {
                $group: {
                    _id: "$type",
                    total: {$sum: "$amount"}
                }
            }
        ]);

        // Extract income and expense totals
        let income = 0, expenses = 0;
        summary.forEach(item => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expenses = item.total;
        });

        return res.status(200).json({income, expenses, balance: income - expenses});
    } catch (error) {
        console.error("Error in GetIncomeExpenses controller", error.message);
        return res.status(500).json({error: 'Server Error'});
    }
}

// Custom filters with filters
export const getCustomReport = async (req, res) => {
    try {
        const {startDate, endDate, category, tag} = req.query;

        const userId = req.user.id;

        // Build the filter query
        let filter = {userId};

        if (startDate && endDate) filter.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
        if (category) filter.category = category;
        if (tag) filter.tags = tag;

        // Fetch transaction based on filters
        const transactions = await Transaction.find(filter).sort({date: -1});

        return res.status(200).json(transactions);

    } catch (error) {
        console.error("Error in GetCustomReport controller", error.message);
        return res.status(500).json({error: 'Server Error'});
    }
}

// Filter based financial report
export const getFilteredFinancialReport = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            category,
            tag,
            type,
            minAmount,
            maxAmount,
            currency,
            isRecurring,
            sortBy
        } = req.query;
        const userId = req.user.id;

        // Build the filter query
        let filter = {userId};

        if (startDate && endDate) filter.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
        if (category) filter.category = category;
        if (tag) filter.tags = tag;
        if (type) filter.type = type; // "income" or "expense"
        if (currency) filter.currency = currency; // Filter by currency (e.g., USD, EUR)
        if (minAmount && maxAmount) filter.amount = {$gte: parseFloat(minAmount), $lte: parseFloat(maxAmount)};
        if (isRecurring) filter.isRecurring = isRecurring === "true"; // Convert string to Boolean

        // Sorting
        let sortCriteria = {date: -1}; // Default: Newest first
        if (sortBy === "oldest") sortCriteria = {date: 1};

        // Fetch transactions based on filters
        const transactions = await Transaction.find(filter).sort(sortCriteria);

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error in getFilteredFinancialReport controller:", error.message);
        return res.status(500).json({error: "Server Error"});
    }
};

import Transaction from "../models/transaction.model.js";
import Goal from "../models/goal.model.js";
import {getNextOccurrence} from "../utils/dateUtils.js";

// Create and Save a new Transaction
export const addTransaction = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({message: "Unauthorized user - please login"});
    }

    // Destructure the transaction details from the request body
    const {type, amount, currency, category, tags, isRecurring, recurrence, date} = req.body;

    try {
        // Check if the transaction details are not empty
        if (!type || !amount || !currency || !category) {
            return res
                .status(400)
                .send({message: "Transaction details cannot be empty"});
        }

        // Validate the transaction type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({message: "Invalid transaction type"});
        }

        // Validate the transaction amount
        if (amount <= 0) {
            return res.status(400).json({message: "Amount must be greater than 0"});
        }

        // Add a hash symbol to the tags
        const formattedTags = tags.map((tag) =>
            tag.startsWith("#") ? tag : `#${tag}`,
        );

        // Create a new transaction object
        const newTransaction = new Transaction({
            userId: req.user.id,
            type,
            amount,
            currency: currency.toUpperCase(),
            category,
            tags: formattedTags,
            isRecurring,
            recurrence,
            nextOccurrence: isRecurring ? getNextOccurrence(recurrence, date) : null, // Check what is the due date according to recurrence
            date,
        });

        await newTransaction.save();

        // Handle automatic saving allocation (Only for income transactions)
        if (type === "income") {
            const goals = await Goal.find({
                userId: req.user.id,
                autoAllocate: true,
            });

            for (let goal of goals) {
                const allocatedAmount =
                    ((await goal).allocationPercentage / 100) * amount;
                (await goal).currentAmount += allocatedAmount;
                await goal.save();
            }
        }

        return res.status(200).json(newTransaction);

    } catch (error) {
        console.error("Error in addTransaction controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get all transactions for a user
export const getAllTransactions = async (req, res) => {
    try {
        // Find all transactions for the user and sort them by date in descending order
        const transactions = await Transaction.find({userId: req.user.id}).sort({
            date: -1,
        }); // sort by date in descending order
        res.status(200).json(transactions);
    } catch (error) {
        // Log the error and send an error response
        console.error("Error in getTransactions controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Get a single transaction by id
export const getTransactionById = async (req, res) => {
    try {
        // Find the transaction by id and user id
        const transaction = await Transaction.findById({
            _id: req.params.id,
            userId: req.user.id,
        });

        // Check if the transaction exists
        if (!transaction) {
            return res.status(404).json({message: "Transaction not found"});
        }

        // Send the transaction details in the response
        res.status(200).json(transaction);
    } catch (error) {
        // Log the error and send an error response
        console.error("Error in getTransactionById controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Update transaction details
export const updateTransaction = async (req, res) => {
    const {type, amount, currency, category, tags, isRecurring, recurrence, date} =
        req.body;

    try {
        // Find the transaction by id
        const transaction = await Transaction.findById(req.params.id);

        // Check if the transaction exists and the user is authorized to update it
        if (!transaction || transaction.userId.toString() !== req.user.id) {
            return res.status(404).json({message: "Transaction not found"});
        }

        // Add a hash symbol to the tags
        const formattedTags = tags.map((tag) =>
            tag.startsWith("#") ? tag : `#${tag}`,
        );

        // Update the transaction details
        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.currency = currency || transaction.currency;
        transaction.category = category || transaction.category;
        transaction.tags = formattedTags.length > 0 ? formattedTags : transaction.tags;
        transaction.isRecurring = isRecurring ?? transaction.isRecurring;
        transaction.recurrence = recurrence || transaction.recurrence;
        transaction.date = date || transaction.date;

        // Update the next occurrence if the transaction is recurring
        if (isRecurring) {
            transaction.nextOccurrence = getNextOccurrence(recurrence, date);
        }

        // Save the transaction
        await transaction.save();

        // Send the updated transaction details in the response
        res
            .status(200)
            .json({message: "Transaction updated successfully", transaction});
    } catch (error) {
        console.error("Error in updateTransaction controller: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

// Delete a transaction by id
export const deleteTransaction = async (req, res) => {
    try {
        // Find the transaction by id and delete it
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        // Check if the transaction exists and the user is authorized to delete it
        if (!transaction || transaction.userId.toString() !== req.user.id) {
            return res.status(404).json({message: "Transaction not found"});
        }

        // Send the response
        return res
            .status(200)
            .json({message: "Transaction deleted successfully"});
    } catch (error) {
        console.error("Error in deleteTransaction controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Filter the transactions by tags
export const filterTransactions = async (req, res) => {
    try {
        // Get the tags from the query parameters
        const {tags, sortBy, order = "desc", limit = 10, page = 1} = req.query;

        // Build the filter object query
        let query = {userId: req.user.id};

        // Filter transactions by tags
        if (tags) {
            const tagArray = tags.split(",").map((tag) => {
                tag = tag.trim();
                return tag.startsWith("#") ? tag : `#${tag}`; // Ensure each tag has #
            });
            if (tagArray.length > 0) {
                query.tags = {$all: tagArray};
            }
        }

        // Define sort options
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === "asc" ? 1 : -1; // Sort by ascending or descending order
        } else {
            sortOptions.date = -1; // Sort by date in descending order by default (newest first)
        }

        // Pagination options
        const skip = (page - 1) * limit;

        // Fetch transactions from DB with filters and sorting
        const transaction = await Transaction.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Return filtered and sorted transactions
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error in filterTransactions controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};


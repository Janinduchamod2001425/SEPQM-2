import Goal from "../models/goal.model.js";

// Create new Goal
export const addGoal = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({message: "Unauthorized user - please login"});
    }

    try {
        const {
            title,
            targetAmount,
            deadline,
            autoAllocate,
            allocationPercentage,
        } = req.body;

        const userId = req.user.id;

        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (targetAmount <= 0) {
            return res
                .status(400)
                .json({message: "Target amount must be greater than zero"});
        }

        const newGoal = new Goal({
            userId,
            title,
            targetAmount,
            deadline,
            autoAllocate: autoAllocate || false,
            allocationPercentage: allocationPercentage || 0,
        });

        await newGoal.save();
        return res.status(200).json(newGoal);
    } catch (error) {
        console.error("Error in addGoal controller: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

// Fetch all goals
export const getUserGoals = async (req, res) => {
    try {
        const userId = req.user.id;

        const goals = await Goal.find({userId});

        return res.status(200).json(goals);
    } catch (error) {
        console.error("Error in getUserGoals controller: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

// Get goal progress
export const getGoalProgress = async (req, res) => {
    try {
        const {id} = req.params;

        const goal = await Goal.findById(id);

        if (!goal) {
            return res.status(404).json({message: "Goal not found"});
        }

        // Ensure values are valid numbers
        if (!goal.currentAmount || !goal.targetAmount || goal.targetAmount === 0) {
            return res
                .status(400)
                .json({message: "Invalid goal data for progress calculation"});
        }

        // Calculate progress
        const progress = (goal.currentAmount / goal.targetAmount) * 100;

        return res.status(200).json({goal, progress: progress.toFixed(2) + "%"});
    } catch (error) {
        console.error("Error in getGoalProgress controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

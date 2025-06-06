import express from "express";
import {
    addBudget,
    deleteBudget,
    getAllBudgets,
    getBudgetById,
    updateBudget
} from "../controllers/budget.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addBudget);
router.get("/getall", protectRoute, getAllBudgets);
router.get("/getone/:id", protectRoute, getBudgetById);
router.put("/update/:id", protectRoute, updateBudget);
router.delete("/delete/:id", protectRoute, deleteBudget);

export default router;
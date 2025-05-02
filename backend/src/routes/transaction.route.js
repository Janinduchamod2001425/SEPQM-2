import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    addTransaction,
    getTransactionById,
    getAllTransactions,
    updateTransaction, deleteTransaction, filterTransactions
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/add", protectRoute, addTransaction);
router.get("/getall", protectRoute, getAllTransactions);
router.get("/getone/:id", protectRoute, getTransactionById);
router.put("/update/:id", protectRoute, updateTransaction);
router.delete("/delete/:id", protectRoute, deleteTransaction);
router.get("/filter", protectRoute, filterTransactions);

export default router;
import express from 'express';
import {adminProtectRoute, protectRoute} from "../middleware/auth.middleware.js";
import {
    getAllBudgets,
    getAllGoals,
    getAllTransactions,
    getAllUsers, getTotalBudgetsCount, getTotalGoalsCount,
    getTotalTransactionsCount,
    getTotalUsersCount
} from "../controllers/admin.dashboard.controller.js";

const router = express.Router();

router.get("/users", protectRoute, adminProtectRoute, getAllUsers);
router.get("/total/users", protectRoute, adminProtectRoute, getTotalUsersCount);

router.get("/transactions", protectRoute, adminProtectRoute, getAllTransactions);
router.get("/total/transactions", protectRoute, adminProtectRoute, getTotalTransactionsCount);

router.get("/goals", protectRoute, adminProtectRoute, getAllGoals);
router.get("/total/goals", protectRoute, adminProtectRoute, getTotalGoalsCount);

router.get("/budgets", protectRoute, adminProtectRoute, getAllBudgets);
router.get("/total/budgets", protectRoute, adminProtectRoute, getTotalBudgetsCount);

export default router;
import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    getCustomReport,
    getFilteredFinancialReport,
    getIncomeExpenses,
    getSpendingTrends
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/trends", protectRoute, getSpendingTrends);
router.get("/income", protectRoute, getIncomeExpenses);
router.get("/custom", protectRoute, getCustomReport);
router.get("/filter", protectRoute, getFilteredFinancialReport);

export default router;
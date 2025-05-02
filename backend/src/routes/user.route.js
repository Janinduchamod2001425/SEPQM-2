import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    getBudgetsByUserId,
    getGoalsByUserId,
    getTransitionsByUserId,
    getUserProfile
} from "../controllers/user.dashboard.controller.js";

const router = express.Router();

router.get("/mybudgets", protectRoute, getBudgetsByUserId);
router.get("/mytransactions", protectRoute, getTransitionsByUserId);
router.get("/mygoals", protectRoute, getGoalsByUserId);
router.get("/profile", protectRoute, getUserProfile);

export default router;
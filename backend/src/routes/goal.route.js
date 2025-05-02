import express from "express";
import {
  addGoal,
  getGoalProgress,
  getUserGoals,
} from "../controllers/goal.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addGoal);
router.get("/getall", protectRoute, getUserGoals);
router.get("/progress/:id", protectRoute, getGoalProgress);

export default router;

import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {fetchExchangeRates, getUserTransactions} from "../controllers/currency.controller.js";

const router = express.Router();

router.get("/exchange-rates/:baseCurrency", protectRoute, fetchExchangeRates);
router.get("/user/:userId", protectRoute, getUserTransactions);

export default router;
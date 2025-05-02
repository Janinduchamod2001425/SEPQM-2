import {getExchangeRates} from "../service/currency.service.js";
import Transaction from "../models/transaction.model.js";

// Fetch exchange rates for a specific base currency
export const fetchExchangeRates = async (req, res) => {

    try {
        const {baseCurrency} = req.params;
        console.log("Fetching exchange rates for:", baseCurrency); // Debug log

        const rates = await getExchangeRates(baseCurrency.toUpperCase());

        if (!rates) {
            return res.status(404).json({error: "Failed to fetch exchange rates"});
        }

        res.status(200).json({baseCurrency, rates});
    } catch (error) {
        console.error("Failed to fetch exchange rates", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Convert the currency in the transaction
export const getUserTransactions = async (req, res) => {
    try {
        const {userId} = req.params;
        const {targetCurrency} = req.query;

        if (!targetCurrency) {
            return res.status(400).json({error: "Target currency is required"});
        }

        const transaction = await Transaction.find({userId});

        if (!transaction.length) {
            return res.status(404).json({error: "No transactions found"});
        }

        let exchangeRates = {};

        // Fetch exchange rates for the target currency
        const uniqueCurrencies = [...new Set(transaction.map((tnx) => tnx.currency))];

        for (const currency of uniqueCurrencies) {
            exchangeRates[currency] = await getExchangeRates(currency);
        }

        // Convert the currency in each transaction
        const convertedTransactions = transaction.map((tnx) => {
            const baseCurrency = tnx.currency.toUpperCase();
            const baseAmount = tnx.amount;

            if (baseCurrency === targetCurrency.toUpperCase()) {
                return {...tnx._doc, convertedAmount: baseAmount, convertedCurrency: baseCurrency};
            }

            // Check if exchange rate exists for baseCurrency -> targetCurrency
            if (!exchangeRates[baseCurrency] || !exchangeRates[baseCurrency][targetCurrency.toUpperCase()]) {
                console.warn(`Missing exchange rate for ${baseCurrency} -> ${targetCurrency.toUpperCase()}`);
                return {...txn._doc, convertedAmount: null, convertedCurrency: "Unavailable"};
            }

            const conversionRate = exchangeRates[baseCurrency][targetCurrency.toUpperCase()];
            const convertedAmount = (baseAmount * conversionRate).toFixed(2);

            return {
                ...tnx._doc,
                convertedAmount,
                convertedCurrency: targetCurrency.toUpperCase(),
            };
        });

        res.status(200).json({transactions: convertedTransactions});

    } catch (error) {
        console.error("Failed to fetch user transactions", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
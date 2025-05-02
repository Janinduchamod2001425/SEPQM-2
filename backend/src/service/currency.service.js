import axios from "axios";

// Get exchange rates from the External API
export const getExchangeRates = async (baseCurrency) => {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        return response.data.rates; // returns exchange rates
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
        return null; // return null if error occurs
    }
}
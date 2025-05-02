import React, {useState} from "react";
import api from "../services/api.js";

const AddBudgetPage = () => {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState("");
    const [error, setError] = useState("");

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1]; // allow current and next year
    const months = Array.from({length: 12}, (_, i) =>
        new Date(0, i).toLocaleString("default", {month: "long"})
    );

    const handleSubmit = async () => {
        setError("");
        try {
            const res = await api.post("/budget/add", {category, amount, month});
            alert(res.data.message);
            setCategory("");
            setAmount("");
            setMonth("");
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to add budget");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Add Budget</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

                <div className="mb-4">
                    <input
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <input
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Month</option>
                        {years.map((year) =>
                            months.map((m) => (
                                <option key={`${m} ${year}`} value={`${m} ${year}`}>
                                    {m} {year}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default AddBudgetPage;

import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTransactionPage = () => {
    const [formData, setFormData] = useState({
        type: "expense",
        amount: "",
        currency: "USD",
        category: "Food",
        tags: [],
        currentTag: "",
        isRecurring: false,
        recurrence: "none",
        date: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = [
        "Food", "Transportation", "Entertainment", 
        "Salary", "Utilities", "Rent", "Gaming", "Other"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagAdd = () => {
        if (formData.currentTag && !formData.tags.includes(formData.currentTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, prev.currentTag],
                currentTag: ""
            }));
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError("Amount must be greater than 0");
        setLoading(false);
        return;
    }

    try {
        const payload = {
            ...formData,
            amount: parseFloat(formData.amount),
            isRecurring: formData.isRecurring,
            recurrence: formData.isRecurring ? formData.recurrence : "none"
        };

        const res = await api.post("/transaction/add", payload);
        toast.success("Transaction added successfully");
        
        // Reset form to initial state instead of navigating away
        setFormData({
            type: "expense",
            amount: "",
            currency: "USD",
            category: "Food",
            tags: [],
            currentTag: "",
            isRecurring: false,
            recurrence: "none",
            date: new Date().toISOString().split('T')[0]
        });
        
    } catch (err) {
        // Handle 401 Unauthorized specifically
        if (err.response?.status === 401) {
            toast.error("Session expired. Please login again.");
            navigate("/"); // Only redirect to login if unauthorized
        } else {
            const errorMsg = err.response?.data?.message || "Failed to add transaction";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Add Transaction</h2>

                {error && (
                    <div className="mb-4 text-red-600 text-center" data-cy="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === "expense"}
                                    onChange={handleChange}
                                    className="mr-2"
                                    data-cy="transaction-type-expense"
                                />
                                Expense
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === "income"}
                                    onChange={handleChange}
                                    className="mr-2"
                                    data-cy="transaction-type-income"
                                />
                                Income
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            data-cy="transaction-amount"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Currency</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            data-cy="transaction-currency"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            data-cy="transaction-category"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={formData.currentTag}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    currentTag: e.target.value
                                }))}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                data-cy="transaction-tag-input"
                            />
                            <button
                                type="button"
                                onClick={handleTagAdd}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                data-cy="transaction-add-tag"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                                <span 
                                    key={tag} 
                                    className="inline-flex items-center px-3 py-1 bg-gray-200 rounded-full"
                                    data-cy={`transaction-tag-${tag}`}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleTagRemove(tag)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        data-cy={`transaction-remove-tag-${tag}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleChange}
                                className="mr-2"
                                data-cy="transaction-recurring"
                            />
                            Recurring Transaction
                        </label>
                    </div>

                    {formData.isRecurring && (
    <div data-cy="transaction-recurrence-container">
        <label className="block mb-2">Recurrence</label>
        <select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="transaction-recurrence"
        >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
    </div>
)}

                    <div className="mb-6">
                        <label className="block mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            data-cy="transaction-date"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-green-500"} text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        data-cy="transaction-submit"
                    >
                        {loading ? "Processing..." : "Add Transaction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionPage;
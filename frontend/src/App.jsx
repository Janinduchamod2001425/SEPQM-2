import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import AddBudget from "./pages/AddBudgetPage.jsx";

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/add_budget" element={<AddBudget/>}/>
            </Routes>
            <ToastContainer position="bottom-right"/>
        </Router>
    );
}

export default App;

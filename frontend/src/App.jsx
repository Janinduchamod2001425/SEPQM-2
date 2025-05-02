import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import AddBudget from "./pages/AddBudgetPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/add-budget" element={<AddBudget/>}/>
            </Routes>
        </Router>
    );
}

export default App;

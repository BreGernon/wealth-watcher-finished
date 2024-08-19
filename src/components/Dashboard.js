import React from 'react'; // Importing the React library
import logo from '../assets/Logo.png'; // Importing the logo image
import { Link } from 'react-router-dom'; // Importing Link for navigation
import '../styles/Dashboard.css'; // Importing CSS for the Dashboard component

// Functional component for the Dashboard page
const Dashboard = () => {
    return (
        <div className="dashboard">
            {/* Header section with logo and navigation */}
            <header className="loggedin-header">
                <div className="logo-container">
                    {/* Displaying the logo image */}
                    <img src={logo} className="loggedin-logo" alt="logo" />
                </div>
                <nav className="full-width-nav">
                    <div className="loggedin-nav">
                        {/* Navigation links */}
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/account">Account</Link>
                        <Link to="/expenses">Expenses</Link>
                        <Link to="/budgets">Budgets</Link>
                        <Link to="/goals">Goals</Link>
                        <Link to="/reports">Reports</Link>
                        <Link to="/settings">Settings</Link>
                        <Link to="/help-center">Help Center</Link>
                        <Link to="/about">About</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
                </nav>
            </header>
            {/* Main content section */}
            <div className="data-section">
                {/* Section with placeholder circles */}
                <div className="data-circles">
                    <div className="circle">Placeholder 1</div>
                    <div className="circle">Placeholder 2</div>
                    <div className="circle">Placeholder 3</div>
                </div>
                {/* Table displaying expenses */}
                <table className="expense-table">
                    <thead>
                        <tr>
                            {/* Table headers */}
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table rows with placeholder data */}
                        <tr>
                            <td>Placeholder Date</td>
                            <td>Placeholder Category</td>
                            <td>Placeholder Description</td>
                            <td>$0.00</td>
                        </tr>
                        <tr>
                            <td>Placeholder Date</td>
                            <td>Placeholder Category</td>
                            <td>Placeholder Description</td>
                            <td>$0.00</td>
                        </tr>
                        <tr>
                            <td>Placeholder Date</td>
                            <td>Placeholder Category</td>
                            <td>Placeholder Description</td>
                            <td>$0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* Action buttons section */}
            <div className="action-buttons">
                <button>Add Expense</button>
                <button>Add Goal</button>
                <button>Set Budget</button>
            </div>
        </div>
    );
};

export default Dashboard; // Exporting the Dashboard component for use in other parts of the application

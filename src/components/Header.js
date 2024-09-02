import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import logo from '../assets/Logo.png'; // Importing the logo image

const Header = () => {
    // useNavigate hook allows navigation programmatically
    const navigate = useNavigate();

    /**
     * Handles user logout by signing out and redirecting to the home page.
     */
    const handleLogout = async () => {
        try {
            await auth.signOut(); // Sign out the user
            navigate('/'); // Redirect to the home page
        } catch (error) {
            console.error('Error logging out: ', error); // Log any errors that occur during sign-out
        }
    };

    return (
        <header className="loggedin-header">
            <div className="logo-container">
                {/* Display the logo */}
                <img src={logo} className="loggedin-logo" alt="logo" />
            </div>
            <nav className='full-width-nav'>
                <div className='loggedin-nav'>
                    {/* Navigation links */}
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/account">Account</NavLink>
                    <NavLink to="/expenses">Expenses</NavLink>
                    <NavLink to="/budgets">Budgets</NavLink>
                    <NavLink to="/goals">Goals</NavLink>
                    <NavLink to="/reports">Reports</NavLink>
                    <NavLink to="/help-center">Help Center</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {/* Logout button */}
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;

import React from 'react';
import Header from './Header';
import '../styles/About.css';

/**
 * About component displays the information about the Wealth Watcher application.
 * It includes details about the app's mission, features, and the team behind it.
 * 
 * @component
 */
const About = () => {
    return (
        <div className="about-page">
            {/* Header component to display the navigation header */}
            <Header />

            {/* Main content section for the About page */}
            <div className="about-content">

                {/* Heading for the page title */}
                <h2>About Wealth Watcher</h2>

                {/* Paragraph describing the purpose and goal of Wealth Watcher */}
                <p>Welcome to Wealth Watcher, your go-to solution for managing and tracking your finances effortlessly. Our goal is to provide a comprehensive and user-friendly platform that helps you take control of your financial health and achieve your financial goals.</p>

                {/* Subheading for the mission statement */}
                <h3>Our Mission</h3>

                {/* Paragraph detailing the mission of Wealth Watcher */}
                <p>At Wealth Watcher, we are committed to empowering individuals with the tools they need to make informed financial decisions. Whether you’re looking to track your expenses, set budgets, or analyze your spending patterns, our platform offers a suite of features designed to meet your needs.</p>

                {/* Subheading for the features list */}
                <h3>Features</h3>

                {/* Unordered list of key features provided by Wealth Watcher */}
                <ul>
                    <li>Track and categorize your expenses</li>
                    <li>Set and manage budgets</li>
                    <li>Monitor progress toward your financial goals</li>
                    <li>Generate detailed financial reports</li>
                </ul>

                {/* Subheading for the team section */}
                <h3>Our Team</h3>

                {/* Paragraph providing a brief introduction to the team */}
                <p>Our dedicated team is made up of one college student about to graduate and who used to struggle with money!</p>
            </div>
        </div>
    );
};

export default About;

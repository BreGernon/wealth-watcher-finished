import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from './Header';
import '../styles/Dashboard.css';

const Dashboard = () => {
    // State hooks for managing data
    const [expenses, setExpenses] = useState([]);
    const [monthToDateExpenses, setMonthToDateExpenses] = useState(0);
    const [totalBudgets, setTotalBudgets] = useState(0);
    const [recentGoalPercentage, setRecentGoalPercentage] = useState(0);

    /**
     * Fetches user data from Firestore and updates state with
     * expenses, month-to-date expenses, total budgets, and
     * recent goal percentage.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current authenticated user
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    // Reference to user document in Firestore
                    const docRef = doc(db, "users", userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();

                        // Fetch and sort expenses data
                        const expensesData = userData.expenses || [];
                        const sortedExpenses = expensesData.sort((a, b) => {
                            const dateA = a.date && a.date.toDate ? a.date.toDate() : new Date(a.date);
                            const dateB = b.date && b.date.toDate ? b.date.toDate() : new Date(b.date);
                            return dateB - dateA;
                        });

                        // Update state with the three most recent expenses
                        setExpenses(sortedExpenses.slice(0, 3));

                        // Calculate month-to-date expenses
                        const now = new Date();
                        const currentMonth = now.getMonth();
                        const currentYear = now.getFullYear();
                        const monthToDateExpensesTotal = sortedExpenses
                            .filter(expense => {
                                const expenseDate = expense.date && expense.date.toDate
                                    ? expense.date.toDate()
                                    : new Date(expense.date);
                                return (
                                    expenseDate.getMonth() === currentMonth &&
                                    expenseDate.getFullYear() === currentYear
                                );
                            })
                            .reduce((total, expense) => total + Number(expense.amount), 0);

                        // Update state with month-to-date expenses
                        setMonthToDateExpenses(monthToDateExpensesTotal);

                        // Fetch and calculate total budgets
                        const budgetsData = userData.budgets || [];
                        console.log("Budgets Data:", budgetsData); // Debugging line
                        const totalBudgetsAmount = budgetsData.reduce((total, budget) => {
                            const budgetAmount = Number(budget.budgetedAmount) || 0;
                            console.log("Budget Amount:", budgetAmount); // Debugging line
                            return total + budgetAmount;
                        }, 0);
                        console.log("Total Budgets Amount:", totalBudgetsAmount); // Debugging line
                        setTotalBudgets(totalBudgetsAmount);

                        // Calculate the most recent goal percentage
                        const goalsData = userData.goals || [];
                        if (goalsData.length > 0) {
                            const mostRecentGoal = goalsData[goalsData.length - 1];
                            const goalPercentage = mostRecentGoal.amount > 0
                                ? (mostRecentGoal.currentAmount / mostRecentGoal.amount) * 100
                                : 0;
                            setRecentGoalPercentage(goalPercentage.toFixed(2));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    return (
        <div className="dashboard">
            <Header />
            <div className="data-section">
                <div className="data-circles">
                    <div className="circle expense-circle">
                        <h3>Month-to-Date Expenses</h3>
                        <p>${monthToDateExpenses.toFixed(2)}</p>
                    </div>
                    <div className="circle budget-circle">
                        <h3>Total Budgets</h3>
                        <p>${totalBudgets.toFixed(2)}</p>
                    </div>
                    <div className="circle goal-circle">
                        <h3>Recent Goal Percentage</h3>
                        <p>{recentGoalPercentage}%</p>
                    </div>
                </div>
                <h2>Expenses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => {
                            let formattedDate;
                            try {
                                const expenseDate = expense.date && expense.date.toDate
                                    ? expense.date.toDate()
                                    : new Date(expense.date);

                                if (!isNaN(expenseDate.getTime())) {
                                    formattedDate = expenseDate.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    });
                                } else {
                                    formattedDate = "Invalid Date";
                                }
                            } catch (error) {
                                formattedDate = "Invalid Date";
                            }

                            return (
                                <tr key={index}>
                                    <td>{expense.category}</td>
                                    <td>${Number(expense.amount).toFixed(2)}</td>
                                    <td>{expense.description}</td>
                                    <td>{formattedDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from './Header';
import '../styles/Reports.css';
import { generatePDF } from '../utils/pdfUtils';
import { generateMonthlyExpensesReport, generateGoalProgressReport, generateBudgetAdherenceReport } from '../utils/reportHelpers';

const Reports = () => {
    // State to store the selected report type and fetched report data
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        console.log('Report Type:', reportType); // Log to see if the report type updates

        const fetchReportData = async () => {
            try {
                // Fetch the current user
                const user = auth.currentUser;
                if (user) {
                    // Reference to the user's document in Firestore
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // Retrieve user data
                        const userData = docSnap.data();
                        let data;

                        // Generate report data based on the selected report type
                        switch (reportType) {
                            case 'monthlyExpenses':
                                data = generateMonthlyExpensesReport(userData.expenses || []);
                                console.log(userData.expenses); // Log expenses data
                                break;
                            case 'goalProgress':
                                data = generateGoalProgressReport(userData.goals || []);
                                break;
                            case 'budgetAdherence':
                                data = generateBudgetAdherenceReport(userData.budgets || [], userData.expenses || []);
                                break;
                            default:
                                data = [];
                        }
                        console.log('Fetched Data:', data); // Log the fetched report data
                        setReportData(data);
                    } else {
                        console.error("No such document!"); // Handle case where document does not exist
                    }
                } else {
                    console.error("User not authenticated!"); // Handle case where user is not authenticated
                }
            } catch (error) {
                console.error("Error fetching report data:", error); // Handle fetch error
            }
        };

        // Fetch report data if a report type is selected
        if (reportType) {
            fetchReportData();
        }
    }, [reportType]); // Dependency array to re-run effect when reportType changes

    // Handle PDF download
    const handleDownloadPDF = () => {
        console.log('Generating PDF with data:', reportData); // Log data for PDF generation
        generatePDF(reportType, reportData);
    };

    return (
        <div>
            <Header />
            <h2>Reports</h2>
            <div className="report-options">
                {/* Buttons to select the type of report to generate */}
                <button onClick={() => setReportType('monthlyExpenses')}>Generate Monthly Expenses Report</button>
                <button onClick={() => setReportType('goalProgress')}>Generate Goal Progress Report</button>
                <button onClick={() => setReportType('budgetAdherence')}>Generate Budget Adherence Report</button>
            </div>
            <div className="report-results">
                {/* Display report data or message if no data is available */}
                {reportData.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    {reportType === 'monthlyExpenses' && (
                                        <>
                                            <th>Month</th>
                                            <th>Total Expenses</th>
                                        </>
                                    )}
                                    {reportType === 'goalProgress' && (
                                        <>
                                            <th>Goal</th>
                                            <th>Amount</th>
                                            <th>Progress</th>
                                        </>
                                    )}
                                    {reportType === 'budgetAdherence' && (
                                        <>
                                            <th>Category</th>
                                            <th>Budgeted Amount</th>
                                            <th>Actual Spend</th>
                                            <th>Remaining Amount</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        {reportType === 'monthlyExpenses' && (
                                            <>
                                                <td>{item.month}</td>
                                                <td>${item.total}</td>
                                            </>
                                        )}
                                        {reportType === 'goalProgress' && (
                                            <>
                                                <td>{item.goal}</td>
                                                <td>${item.amount}</td>
                                                <td>{item.progress !== undefined ? item.progress.toFixed(2) : '0.00'}%</td>
                                            </>
                                        )}
                                        {reportType === 'budgetAdherence' && (
                                            <>
                                                <td>{item.category}</td>
                                                <td>${item.budgetedAmount}</td>
                                                <td>${item.actualSpend}</td>
                                                <td>${item.remainingAmount}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Button to download the report as a PDF */}
                        <button onClick={handleDownloadPDF}>Download PDF</button>
                    </>
                ) : (
                    <p>No data available. Please generate a report.</p>
                )}
            </div>
        </div>
    );
};

export default Reports;

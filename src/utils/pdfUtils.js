import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF report based on the given report type and data.
 * @param {string} reportType - The type of report to generate ('monthlyExpenses', 'goalProgress', 'budgetAdherence').
 * @param {Array} reportData - The data to include in the report.
 */
export const generatePDF = (reportType, reportData) => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Initialize headers and data arrays
    let headers = [];
    let data = [];

    // Determine headers and data based on the report type
    switch (reportType) {
        case 'monthlyExpenses':
            headers = ['Month', 'Total Expenses'];
            data = reportData.map(item => [
                item.month, 
                `$${item.total ? Number(item.total).toFixed(2) : 'N/A'}`  // Format total expenses
            ]);
            break;
        case 'goalProgress':
            headers = ['Goal', 'Amount', 'Progress'];
            data = reportData.map(item => [
                item.goal, 
                `$${item.amount ? Number(item.amount).toFixed(2) : 'N/A'}`, // Format amount
                `${item.progress ? item.progress.toFixed(2) : 'N/A'}%` // Format progress percentage
            ]);
            break;
        case 'budgetAdherence':
            headers = ['Category', 'Budgeted Amount', 'Actual Spend', 'Remaining Amount'];
            data = reportData.map(item => [
                item.category,
                `$${item.budgetedAmount ? Number(item.budgetedAmount).toFixed(2) : 'N/A'}`, // Format budgeted amount
                `$${item.actualSpend ? Number(item.actualSpend).toFixed(2) : 'N/A'}`, // Format actual spend
                `$${item.budgetedAmount && item.actualSpend ? (item.budgetedAmount - item.actualSpend).toFixed(2) : 'N/A'}` // Calculate remaining amount
            ]);
            break;
        default:
            // If reportType does not match, exit the function
            return;
    }

    // Generate the PDF with table
    doc.autoTable({
        head: [headers], // Set table headers
        body: data, // Set table data
        margin: { top: 20 }, // Add top margin for table
        styles: { fontSize: 10 }, // Set font size
    });

    // Save the PDF file with a name based on the report type
    doc.save(`${reportType}_Report.pdf`);
};

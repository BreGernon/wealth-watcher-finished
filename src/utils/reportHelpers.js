/**
 * Generates a monthly expenses report by aggregating expenses for the current month.
 * @param {Array} expenses - List of expense objects with date and amount properties.
 * @returns {Array} - Array with a single object containing the month and total expenses.
 */
export const generateMonthlyExpensesReport = (expenses) => {
    // Get the current date and extract the month and year
    const now = new Date();
    const currentMonth = now.getMonth(); // Month is 0-based (0 = January, 11 = December)
    const currentYear = now.getFullYear(); // Full year (YYYY)

    let totalExpenses = 0;

    // Iterate over expenses and sum up those from the current month and year
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth();
        const expenseYear = expenseDate.getFullYear();

        if (expenseMonth === currentMonth && expenseYear === currentYear) {
            totalExpenses += parseFloat(expense.amount); // Sum up expenses for the current month
        }
    });

    // Return an array with a single object for consistency with rendering logic
    return [{
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' }), // Format month and year
        total: totalExpenses.toFixed(2) // Format total expenses to 2 decimal places
    }];
};

/**
 * Generates a goal progress report showing each goal's description, current amount, and progress.
 * @param {Array} goals - List of goal objects with description, amount, and currentAmount properties.
 * @returns {Array} - Array of objects containing goal description, amount, and progress percentage.
 */
export const generateGoalProgressReport = (goals) => {
    return goals.map(goal => ({
        goal: goal.description, // Goal description
        amount: goal.currentAmount, // Current amount achieved
        progress: (goal.currentAmount / goal.amount) * 100 // Calculate progress percentage
    }));
};

/**
 * Generates a budget adherence report comparing budgeted amounts with actual spending.
 * @param {Array} budgets - List of budget objects with category and budgetedAmount properties.
 * @param {Array} expenses - List of expense objects with category and amount properties.
 * @returns {Array} - Array of objects containing category, budgeted amount, actual spend, and remaining amount.
 */
export const generateBudgetAdherenceReport = (budgets, expenses) => {
    // Aggregate expenses by category
    const expenseByCategory = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Unknown'; // Default to 'Unknown' if no category is provided
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount) || 0; // Sum up expenses by category
        return acc;
    }, {});

    return budgets.map((budget) => {
        const category = budget.category || 'Unknown'; // Default to 'Unknown' if no category is provided
        const budgetedAmount = parseFloat(budget.budgetedAmount) || 0; // Budgeted amount
        const actualSpend = parseFloat(expenseByCategory[category]) || 0; // Actual spend for the category
        const remainingAmount = budgetedAmount - actualSpend; // Calculate remaining amount

        // Optional: Log values for debugging
        console.log('Category:', category);
        console.log('Budgeted Amount:', budgetedAmount);
        console.log('Actual Spend:', actualSpend);
        console.log('Remaining Amount:', remainingAmount);

        return {
            category,
            budgetedAmount,
            actualSpend,
            remainingAmount
        };
    });
};
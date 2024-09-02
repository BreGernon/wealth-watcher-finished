import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { auth, db } from '../utils/firebase'; // Importing Firebase authentication and Firestore database
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Importing Firestore functions
import Header from './Header'; // Importing Header component
import '../styles/Expenses.css'; // Importing CSS for styling
import Modal from './Modal'; // Importing Modal component for user interaction
import { v4 as uuidv4 } from 'uuid'; // Importing UUID for generating unique IDs

const Expenses = () => {
    // State variables to manage expenses, selected expense, modal state, and form data
    const [expenses, setExpenses] = useState([]); // Stores list of expenses
    const [selectedExpense, setSelectedExpense] = useState(null); // Stores the currently selected expense
    const [isModalOpen, setIsModalOpen] = useState(false); // Manages the state of the modal (open/close)
    const [modalType, setModalType] = useState(''); // Type of modal ('edit', 'add', or 'delete')
    const [formData, setFormData] = useState({ category: '', amount: '', description: '', date: '' }); // Stores form input data

    /**
     * Fetches the user's expenses from Firestore on component mount.
     */
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setExpenses(userData.expenses || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching expenses:", error); // Log error if fetching fails
            }
        };

        fetchExpenses();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    /**
     * Handles clicking on an expense row to select it.
     * 
     * @param {Object} expense - The expense object that was clicked.
     */
    const handleRowClick = (expense) => {
        setSelectedExpense(expense); // Set the selected expense
    };

    /**
     * Opens the modal for adding, editing, or deleting an expense.
     * 
     * @param {string} type - The type of modal to open ('edit', 'add', or 'delete').
     */
    const openModal = (type) => {
        setModalType(type);
        if (type === 'edit' && selectedExpense) {
            // Pre-fill the form with data if editing an existing expense
            setFormData({
                category: selectedExpense.category,
                amount: selectedExpense.amount,
                description: selectedExpense.description,
                date: selectedExpense.date,
            });
        } else {
            // Reset form data for adding a new expense
            setFormData({ category: '', amount: '', description: '', date: '' });
        }
        setIsModalOpen(true);
    };

    /**
     * Closes the modal and resets form data.
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ category: '', amount: '', description: '', date: '' });
    };

    /**
     * Handles changes to the form fields.
     * 
     * @param {Event} e - The change event from the form input.
     */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles the form submission for adding or editing an expense.
     * 
     * @param {Event} e - The form submission event.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if (user) {
            const docRef = doc(db, "users", user.uid);

            const dateObject = new Date(formData.date);
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const newExpense = {
                id: uuidv4(),
                ...formData,
                date: formattedDate,
            };

            if (modalType === 'add') {
                try {
                    // Add new expense to Firestore
                    await updateDoc(docRef, {
                        expenses: arrayUnion(newExpense),
                    });

                    setExpenses([...expenses, newExpense]); // Update local state
                } catch (error) {
                    console.error("Error adding expense:", error); // Log error if adding fails
                }
            } else if (modalType === 'edit' && selectedExpense) {
                const updatedExpenses = expenses.map((expense) =>
                    expense.id === selectedExpense.id ? { ...expense, ...formData } : expense
                );
                try {
                    // Update existing expense in Firestore
                    await updateDoc(docRef, {
                        expenses: updatedExpenses,
                    });

                    setExpenses(updatedExpenses); // Update local state
                } catch (error) {
                    console.error("Error updating expense:", error); // Log error if updating fails
                }
            }

            closeModal(); // Close modal after submission
        }
    };

    /**
     * Handles the deletion of an expense.
     */
    const handleDelete = async () => {
        const user = auth.currentUser;
        if (user && selectedExpense) {
            const docRef = doc(db, "users", user.uid);

            try {
                // Remove the expense from Firestore
                await updateDoc(docRef, {
                    expenses: arrayRemove(selectedExpense),
                });

                setExpenses(expenses.filter((expense) => expense.id !== selectedExpense.id)); // Update local state
                setSelectedExpense(null);
                closeModal(); // Close modal after deletion
            } catch (error) {
                console.error("Error deleting expense:", error); // Log error if deletion fails
            }
        }
    };

    return (
        <div>
            <Header /> {/* Render Header component */}
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
                    {expenses.map((expense) => (
                        <tr
                            key={expense.id}
                            onClick={() => handleRowClick(expense)} // Handle row click to select an expense
                            className={selectedExpense && selectedExpense.id === expense.id ? 'selected' : ''}
                        >
                            <td>{expense.category}</td>
                            <td>${Number(expense.amount).toFixed(2)}</td>
                            <td>{expense.description}</td>
                            <td>{new Date(expense.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="expense-actions">
                <button onClick={() => openModal('edit')} disabled={!selectedExpense}>
                    Edit
                </button>
                <button onClick={() => openModal('delete')} disabled={!selectedExpense}>
                    Delete
                </button>
                <button onClick={() => openModal('add')}>Add New Expense</button>
            </div>

            {/* Modal for Adding and Editing Expenses */}
            <Modal show={isModalOpen && modalType !== 'delete'} onClose={closeModal} title={modalType === 'add' ? 'Add New Expense' : 'Edit Expense'}>
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Category:
                        <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="description" value={formData.description} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </Modal>

            {/* Modal for Deleting Expense */}
            <Modal show={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Delete Expense">
                <p>Are you sure you want to delete this expense?</p>
                <button onClick={handleDelete}>Yes, Delete</button>
            </Modal>
        </div>
    );
};

export default Expenses; // Exporting the Expenses component for use in other parts of the application

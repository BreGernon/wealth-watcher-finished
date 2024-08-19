import React from 'react'; // Importing React
import { Navigate } from 'react-router-dom'; // Importing Navigate component for redirection
import { useAuth } from '../contexts/AuthContext'; // Importing custom hook for authentication context

// ProtectedRoute component to handle route access based on authentication
const ProtectedRoute = ({ children }) => {
    // Accessing the current user from the authentication context
    const { currentUser } = useAuth();

    // If there is no current user (i.e., user is not authenticated), redirect to the home page
    if (!currentUser) {
        return <Navigate to="/" />;
    }

    // If the user is authenticated, render the children components
    return children;
};

export default ProtectedRoute; // Exporting ProtectedRoute component for use in other parts of the application

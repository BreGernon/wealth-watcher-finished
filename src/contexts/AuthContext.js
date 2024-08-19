import React, { useContext, useState, useEffect } from 'react'; // Import necessary React hooks
import { auth } from '../utils/firebase'; // Import the Firebase authentication instance

// Create a Context for authentication state
const AuthContext = React.createContext();

// Custom hook to use the AuthContext
export function useAuth() {
    return useContext(AuthContext); // Returns the current context value (auth state)
}

// Provider component to manage authentication state and provide context to the app
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); // State to store the current authenticated user
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        // Set up an auth state listener to handle user sign-in and sign-out
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user); // Update state with the current user
            setLoading(false); // Set loading to false once user state is resolved
        });

        // Clean up the listener on component unmount
        return unsubscribe;
    }, []); // Empty dependency array means this effect runs only once on mount

    const value = {
        currentUser, // Provide currentUser in context value
    };

    // Render the provider with children components
    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Only render children if loading is complete */}
        </AuthContext.Provider>
    );
}

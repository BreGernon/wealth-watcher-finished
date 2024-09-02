import React, { useState } from "react"; // Importing React and useState hook
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Importing Firebase auth functions
import { auth } from "../utils/firebase"; // Importing the auth instance from Firebase configuration
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation

// Functional component for Login
const Login = () => {
    // State variables for email, password, error message, and reset email status
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setError(null); // Clears any previous error message
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
            
        } catch (error) {
            console.error("Login error: ", error.code, error.message);

            if (error.code === "auth/wrong-password") {
                setError("No user found with this email. Please check of sign up.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Failed to log in. Please check your credentials.");
            }
        }
    };

    // Function to handle password reset
    const handlePasswordReset = () => {
        // Firebase password reset function
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // On successful email sending, update state and alert the user
                setResetEmailSent(true);
                alert("Password reset email sent! Please check your inbox.");
            })
            .catch((error) => {
                // On error, log the error and alert the user
                console.error("Error resetting password: ", error);
                alert("Failed to send password reset email. Please try again.");
            });
    };

    return (
        <div>
            <h2>Login</h2>
            {/* Login form */}
            <form onSubmit={handleLogin}>
                {/* Email input */}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {/* Password input */}
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Submit button */}
                <button type="submit">Login</button>
                {/* Display error message if any */}
                {error && <p className="error">{error}</p>}
            </form>
            {/* Password reset section */}
            <div className="forgot-password-section">
                {/* Button to trigger password reset */}
                <button className="forgot-password-button" onClick={handlePasswordReset}>Forgot Password?</button>
                {/* Message indicating that the reset email has been sent */}
                {resetEmailSent && <p>Check your email for a password reset link.</p>}
            </div>
        </div>
    );
};

export default Login; // Exporting the Login component for use in other parts of the application

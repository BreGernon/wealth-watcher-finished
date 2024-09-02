import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { updateProfile, updateEmail, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "../styles/AccountDetails.css";
import { useNavigate } from "react-router-dom";
import Header from './Header';

/**
 * AccountDetails component allows users to view and update their account information
 * and provides an option to delete the account. The component handles user authentication,
 * updates to the display name and email, and account deletion with confirmation.
 * 
 * @component
 */
const AccountDetails = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [newDisplayName, setNewDisplayName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    /**
     * useEffect hook to fetch user data from Firebase when the component mounts.
     * It sets the initial display name and email based on the authenticated user.
     */
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                setDisplayName(user.displayName || "");
                setEmail(user.email || "");
                
                // Fetch user data from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Additional user data can be set here if needed
                }
            }
        };

        fetchUserData();
    }, []);

    /**
     * Handles the profile update for the display name and email.
     * It updates the Firebase Authentication profile and the Firestore document.
     */
    const handleUpdateProfile = async () => {
        setError(null);
        setSuccess(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error ("No user is currently signed in");

            // Update display name if changed
            if (newDisplayName) {
                await updateProfile(user, { displayName: newDisplayName });
                setDisplayName(newDisplayName);
                setNewDisplayName("");
            }

            // Update email if changed
            if (newEmail) {
                await updateEmail(user, newEmail);
                setEmail(newEmail);
                setNewEmail("");
            }

            // Update user document in Firestore
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                displayName: newDisplayName || displayName,
                email: newEmail || email,
            });

            setSuccess("Profile updated successfully!");
        } catch (error) {
            setError("Failed to update profile. Please try again.");
            console.error("Profile update error:", error);
        }
    };

    /**
     * Handles the account deletion process. Deletes the user's data from Firestore
     * and the Firebase Authentication account. Redirects to the homepage after deletion.
     */
    const handleDeleteAccount = async () => {
        setError(null);
        setIsDeleting(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No user is currently signed in.");

            // Delete user document from Firestore
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);

            // Delete Firebase Authentication account
            await deleteUser(user);

            alert("Your account has been deleted successfully.");
            navigate("/");
        } catch (error) {
            setError("Failed to delete account. Please try again.");
            console.error("Account deletion error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="account-details">
                <h2>Account Details</h2>
                
                {/* Profile information section for updating display name and email */}
                <div className="profile-info">
                    <div>
                        <label>Display Name: </label>
                        <input
                            type="text"
                            placeholder={displayName || "No display name set"}
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input
                            type="email"
                            placeholder={email}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error and success message display */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {/* Button to save profile changes */}
                <button onClick={handleUpdateProfile}>Save Changes</button>

                {/* Button to log out the user */}
                <button className="logout" onClick={() => auth.signOut().then(() => navigate("/"))}>
                    Log Out
                </button>

                {/* Account deletion section */}
                <div className="account-deletion">
                    <h3>Danger Zone</h3>
                    <p>Deleting your account will permanently remove all your data. This action cannot be undone.</p>
                    <button onClick={handleDeleteAccount} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
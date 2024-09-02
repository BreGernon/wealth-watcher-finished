import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { updateProfile, updateEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "../styles/AccountDetails.css";
import { useNavigate } from "react-router-dom";
import Header from './Header';

const AccountDetails = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [newDisplayName, setNewDisplayName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [password, setPassword] = useState(""); // State for password input
    const [showPasswordInput, setShowPasswordInput] = useState(false); // Show password input form
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                setDisplayName(user.displayName || "");
                setEmail(user.email || "");
                
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                }
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async () => {
        setError(null);
        setSuccess(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error ("No user is currently signed in");

            if (newDisplayName) {
                await updateProfile(user, { displayName: newDisplayName });
                setDisplayName(newDisplayName);
                setNewDisplayName("");
            }

            if (newEmail) {
                await updateEmail(user, newEmail);
                setEmail(newEmail);
                setNewEmail("");
            }

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

    const handleDeleteAccount = async () => {
        setError(null);
        setIsDeleting(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No user is currently signed in.");

            // Re-authenticate user
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

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
            if (error.code === 'auth/requires-recent-login') {
                setError("Please re-authenticate before deleting your account.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="account-details">
                <h2>Account Details</h2>
                
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

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button onClick={handleUpdateProfile}>Save Changes</button>

                <button className="logout" onClick={() => auth.signOut().then(() => navigate("/"))}>
                    Log Out
                </button>

                <div className="account-deletion">
                    <h3>Danger Zone</h3>
                    <p>Deleting your account will permanently remove all your data. This action cannot be undone.</p>
                    <button onClick={() => setShowPasswordInput(true)} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                    {showPasswordInput && (
                        <div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={handleDeleteAccount} disabled={isDeleting}>
                                Confirm Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;

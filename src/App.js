import React from "react"; // Import React
import logo from './assets/Logo.png'; // Import the logo image
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router components
import './styles/StartPage.css'; // Import CSS for styling the StartPage
import Login from './components/Login'; // Import the Login component
import Signup from "./components/Signup"; // Import the Signup component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import Expenses from "./components/Expenses";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import AccountDetails from "./components/AccountDetails";
import Budgets from "./components/Budgets";
import Goals from "./components/Goals";
import Reports from "./components/Reports";
import HelpCenter from "./components/HelpCenter";
import About from "./components/About";

function App() {
  return (
    <Router> {/* Wrap everything in the Router component to enable routing */}
      <div>
        <Routes> {/* Define routing for the application */}
          <Route
            path="/" // Route for the root path
            element={
              <div className="StartPage"> {/* Main container for the StartPage */}
                <div className="auth-container">
                  <header className="App-header"> {/* Header with logo */}
                    <img src={logo} className="App-logo" alt="logo" />
                  </header>
                  <div className="form-container"> {/* Container for login and signup forms */}
                    <div className="login-box"> {/* Box for login form */}
                      <Login />
                    </div>
                    <div className="signup-box"> {/* Box for signup form */}
                      <Signup />
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Protected routes require authentication */}
          <Route
            path="/dashboard" // Route for the dashboard path
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} // Protect the Dashboard route with ProtectedRoute
          />
          <Route
            path="/expenses"
            element={<ProtectedRoute><Expenses /></ProtectedRoute>}
          />

          <Route
            path="/account"
            element={<ProtectedRoute><AccountDetails /></ProtectedRoute>}
          />
          <Route
            path="/budgets"
            element={<ProtectedRoute><Budgets /></ProtectedRoute>}
          />
          <Route
            path="/goals"
            element={<ProtectedRoute><Goals /></ProtectedRoute>}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute><Reports /></ProtectedRoute>}
          />
          <Route
            path="/help-center"
            element={<ProtectedRoute><HelpCenter /></ProtectedRoute>}
          />
          <Route
            path="/about"
            element={<ProtectedRoute><About /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

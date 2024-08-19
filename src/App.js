import React from "react"; // Import React
import logo from './assets/Logo.png'; // Import the logo image
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router components
import './styles/StartPage.css'; // Import CSS for styling the StartPage
import Login from './components/Login'; // Import the Login component
import Signup from "./components/Signup"; // Import the Signup component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

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

          <Route
            path="/dashboard" // Route for the dashboard path
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} // Protect the Dashboard route with ProtectedRoute
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import LandingPage from './LandingPage';
import Navbar from './Navbar';
import UserHome from './UserHome';
import LoginForm from './Login';
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [error, setError] = useState(''); // Track login errors

  const onLogin = (email, password) => {
    axios
      .post('http://localhost:5001/login', { email, password })
      .then((response) => {
        setUser(response.data.user); // Set user state
        setError(''); // Clear errors
      })
      .catch((err) => {
        setError('Invalid credentials');
        console.error(err);
      });
  };

  const onSignOut = () => {
    setUser(null); // Reset user state to null
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onSignOut={onSignOut} />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/home" /> : <LoginForm onLogin={onLogin} error={error} />
            }
          />

          {/* User Home Page */}
          <Route
            path="/home"
            element={
              user ? <UserHome user={user} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

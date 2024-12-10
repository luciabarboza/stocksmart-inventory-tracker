import './App.css';
import LandingPage from './LandingPage';
import Navbar from './Navbar';
import UserHome from './UserHome';
import LoginForm from './Login';
import ExpirationAlerts from './ExpirationAlerts';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState('');

  const onLogin = (email, password) => {
    axios
      .post('http://localhost:5001/login', { email, password })
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user to localStorage
        setError('');
      })
      .catch((err) => {
        setError('Invalid credentials');
        console.error(err);
      });
  };

  const onSignOut = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
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


          {/* Expiration Alerts */}
          <Route
            path="/alerts"
            element={
              user ? <ExpirationAlerts user={user} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

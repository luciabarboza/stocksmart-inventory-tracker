import './App.css';
import LandingPage from './LandingPage';
import Navbar from './Navbar';
import UserHome from './UserHome';
import LoginForm from './Login';
import InventoryManager from './InventoryManager';
import CreateShoppingList from './CreateShoppingList'; // Import the component
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState('');

  const onLogin = (email, password) => {
    axios
      .post('http://localhost:5001/login', { email, password })
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setError('');
      })
      .catch((err) => {
        setError('Invalid credentials');
        console.error(err);
      });
  };

  const onSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onSignOut={onSignOut} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <LoginForm onLogin={onLogin} error={error} />}
          />
          <Route
            path="/home"
            element={user ? <UserHome user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/inventory"
            element={user ? <InventoryManager user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/createshoppinglist"
            element={user ? <CreateShoppingList /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

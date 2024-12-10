import React from 'react';
import './UserHome.css';
import InventoryManager from './InventoryManager';

const UserHome = ({ user }) => {
  // Get the current hour to determine the greeting
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <div className="food-items-page">
      <div className="greeting">
        <h1>{greeting}, {user?.name || 'Guest'}!</h1>
        <p>Welcome to your inventory management system.</p>
      </div>
      
      <InventoryManager />
    </div>
  );
};

export default UserHome;

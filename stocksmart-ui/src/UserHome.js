import React, { useState, useEffect } from 'react';
import './UserHome.css';
import InventoryManager from './InventoryManager';

const UserHome = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);

  useEffect(() => {
    // Fetch inventory data from the backend
    fetch('http://localhost:5001/inventory')
      .then((response) => response.json())
      .then((data) => {
        // Separate items into pantry and fridge categories
        const pantry = data.filter((item) => item.category_name === 'pantry');
        const fridge = data.filter((item) => item.category_name === 'fridge');
        setPantryItems(pantry);
        setFridgeItems(fridge);
      })
      .catch((error) => {
        console.error('Error fetching inventory data:', error);
      });
  }, []);

  return (
    <div className="food-items-page">
      <h1>Welcome to Your Inventory</h1>

      
      <InventoryManager/>
    </div>
  );
};

export default UserHome;

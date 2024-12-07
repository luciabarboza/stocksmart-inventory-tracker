import React, { useState, useEffect } from 'react';
import './UserHome.css';

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

      <section className="inventory-section">
        <h2>Pantry Items</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {pantryItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.expiration_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Fridge Items</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {fridgeItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.expiration_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserHome;

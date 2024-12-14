import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryManager.css';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    user_id: 1, // Replace with dynamic user ID
    item_name: '',
    quantity: '',
    expiration_date: '',
    category_name: '',
    brand_name: '', // Optional
    nutritional_id: '',
    calories: '',
    protein: '',
    fat: '',
    carbohydrates: '',
    dietary_labels: '',
  });
  const [updateItem, setUpdateItem] = useState(null); // Item to be updated
  const [error, setError] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);

  // Fetch inventory items on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch all inventory items
  const fetchInventory = async () => {
    try {
      const userId = 1; // Replace with actual user ID from context or props
      const response = await axios.get(`http://localhost:5001/inventory/${userId}`);
      setInventory(response.data);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    }
  };

  // Add a new item to inventory
  const handleAddItem = async (e) => {
    e.preventDefault();

    const sanitizedItem = {
      ...newItem,
      brand_name: newItem.brand_name || null, // Set to null if not provided
    };

    try {
      await axios.post('http://localhost:5001/inventory', sanitizedItem);
      setNewItem({
        user_id: 1,
        item_name: '',
        quantity: '',
        expiration_date: '',
        category_name: '',
        brand_name: '',
        nutritional_id: '',
        calories: '',
        protein: '',
        fat: '',
        carbohydrates: '',
        dietary_labels: '',
      });
      setShowAddPopup(false);
      fetchInventory(); // Refresh the inventory after adding
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    }
  };

  // Update an existing item in inventory
  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const sanitizedUpdateItem = {
      ...updateItem,
      brand_name: updateItem.brand_name || null, // Set to null if not provided
    };

    try {
      await axios.put(`http://localhost:5001/inventory/${updateItem.inventory_id}`, sanitizedUpdateItem);
      setUpdateItem(null); // Reset update state
      fetchInventory(); // Refresh the inventory after updating
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  // Delete an item from inventory
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/inventory/${id}`);
      fetchInventory(); // Refresh the inventory after deleting
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  // Filter inventory by category
  const filterByCategory = (category) =>
    inventory.filter((item) => item.category_name === category);

  return (
    <div className="inventory-manager">
      <h1>Inventory Manager</h1>

      {error && <p className="error">{error}</p>}

      {/* Add Item Popup Trigger */}
      <button className="add-item-btn" onClick={() => setShowAddPopup(true)}>+</button>

      {showAddPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                required
              />
              <input
                type="date"
                value={newItem.expiration_date}
                onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
                required
              />
              <select
                value={newItem.category_name}
                onChange={(e) => setNewItem({ ...newItem, category_name: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                <option value="freezer">Freezer</option>
                <option value="fridge">Fridge</option>
                <option value="pantry">Pantry</option>
              </select>
              <input
                type="text"
                placeholder="Brand Name (Optional)"
                value={newItem.brand_name}
                onChange={(e) => setNewItem({ ...newItem, brand_name: e.target.value })}
              />
              <button type="submit">Add Item</button>
              <button type="button" onClick={() => setShowAddPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Update Item Popup */}
      {updateItem && (
        <div className="popup">
          <div className="popup-content">
            <h2>Update Item</h2>
            <form onSubmit={handleUpdateItem}>
              <input
                type="text"
                placeholder="Item Name"
                value={updateItem.item_name || ''}
                onChange={(e) => setUpdateItem({ ...updateItem, item_name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={updateItem.quantity || ''}
                onChange={(e) => setUpdateItem({ ...updateItem, quantity: e.target.value })}
                required
              />
              <input
                type="date"
                value={updateItem.expiration_date || ''}
                onChange={(e) => setUpdateItem({ ...updateItem, expiration_date: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Brand Name (Optional)"
                value={updateItem.brand_name || ''}
                onChange={(e) => setUpdateItem({ ...updateItem, brand_name: e.target.value })}
              />
              <button type="submit">Update Item</button>
              <button type="button" onClick={() => setUpdateItem(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Tables */}
      {['fridge', 'freezer', 'pantry'].map((category) => (
        <section key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterByCategory(category).map((item) => (
                <tr key={item.inventory_id}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.expiration_date}</td>
                  <td>{item.brand_name || 'N/A'}</td> {/* Show N/A if brand_name is null */}
                  <td>
                    <button onClick={() => setUpdateItem(item)}>Edit</button>
                    <button onClick={() => handleDeleteItem(item.inventory_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
};

export default InventoryManager;

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
    brand_name: '',
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
  const [showNutritionPopup, setShowNutritionPopup] = useState(false); // Tracks Nutrition Info popup visibility
  const [nutritionInfo, setNutritionInfo] = useState(null); // Holds selected item's nutrition info
  const [isEditingNutrition, setIsEditingNutrition] = useState(false); // Tracks edit mode for Nutrition Info popup

  // Fetch inventory items on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch all inventory items
  const fetchInventory = async () => {
    try {
      const userId = 1; // Replace this with the actual user ID from context or props
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
    try {
      await axios.post('http://localhost:5001/inventory', newItem);
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
      fetchInventory();
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    }
  };

  // Update an existing item in inventory
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/inventory/${updateItem.inventory_id}`, updateItem);
      setUpdateItem(null);
      fetchInventory();
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  // Update nutrition info for an item
  const handleUpdateNutritionInfo = async () => {
    try {
      await axios.put(
        `http://localhost:5001/inventory/${nutritionInfo.inventory_id}`, // Use the item's inventory_id
        nutritionInfo // Send the updated nutrition info
      );
      fetchInventory(); // Refresh inventory data to reflect changes
      setShowNutritionPopup(false); // Close the popup
    } catch (err) {
      setError('Failed to update nutrition info');
      console.error(err);
    }
  };

  // Delete an item from inventory
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  // Show nutrition info popup
  const handleViewNutrition = (item) => {
    setNutritionInfo(item); // Set the selected item's nutrition info
    setShowNutritionPopup(true); // Show the popup
    setIsEditingNutrition(false); // Ensure it's in view mode by default
  };

  // Filter inventory by category
  const filterByCategory = (category) => inventory.filter((item) => item.category_name === category);

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
                placeholder="Brand Name"
                value={newItem.brand_name}
                onChange={(e) => setNewItem({ ...newItem, brand_name: e.target.value })}
                required
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
          placeholder="Brand Name" // Add this field
          value={updateItem.brand_name || ''} // Bind to updateItem.brand_name
          onChange={(e) => setUpdateItem({ ...updateItem, brand_name: e.target.value })}
          required
        />
        <button type="submit">Update Item</button>
        <button type="button" onClick={() => setUpdateItem(null)}>Cancel</button>
      </form>
    </div>
  </div>
)}


      {/* Nutrition Info Popup */}
      {showNutritionPopup && nutritionInfo && (
        <div className="popup">
          <div className="popup-content">
            <h2>Nutrition Information</h2>
            {isEditingNutrition ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateNutritionInfo(); // Save changes to the backend
                }}
              >
                <label>
                  Nutritional ID:
                  <input
                    type="text"
                    value={nutritionInfo.nutritional_id || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, nutritional_id: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Calories:
                  <input
                    type="number"
                    value={nutritionInfo.calories || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, calories: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Protein:
                  <input
                    type="number"
                    value={nutritionInfo.protein || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, protein: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Fat:
                  <input
                    type="number"
                    value={nutritionInfo.fat || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, fat: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Carbohydrates:
                  <input
                    type="number"
                    value={nutritionInfo.carbohydrates || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, carbohydrates: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Dietary Labels:
                  <input
                    type="text"
                    value={nutritionInfo.dietary_labels || ''}
                    onChange={(e) =>
                      setNutritionInfo({ ...nutritionInfo, dietary_labels: e.target.value })
                    }
                  />
                </label>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowNutritionPopup(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p><strong>Nutritional ID:</strong> {nutritionInfo.nutritional_id}</p>
                <p><strong>Calories:</strong> {nutritionInfo.calories}</p>
                <p><strong>Protein:</strong> {nutritionInfo.protein}</p>
                <p><strong>Fat:</strong> {nutritionInfo.fat}</p>
                <p><strong>Carbohydrates:</strong> {nutritionInfo.carbohydrates}</p>
                <p><strong>Dietary Labels:</strong> {nutritionInfo.dietary_labels}</p>
                <button onClick={() => setIsEditingNutrition(true)}>Edit</button>
              </>
            )}
            <button onClick={() => setShowNutritionPopup(false)}>Close</button>
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
                <th>Nutrition Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterByCategory(category).map((item) => (
                <tr key={item.inventory_id}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.expiration_date}</td>
                  <td>{item.brand_name}</td>
                  <td>
                    <button onClick={() => handleViewNutrition(item)}>👁️</button>
                  </td>
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

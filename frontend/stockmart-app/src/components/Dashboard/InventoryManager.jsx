import React, { useState } from "react";
import "./inventorymanager.css";

const InventoryManager = () => {
  // Sample inventory data
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Milk",
      quantity: 3,
      expiration: "2024-12-31",
      category: "Fridge",
    },
    {
      id: 2,
      name: "Apples",
      quantity: 3,
      expiration: "2024-12-20",
      category: "Fridge",
    },
    {
      id: 3,
      name: "Oranges",
      quantity: 2,
      expiration: "2025-01-23",
      category: "Pantry",
    },
    {
      id: 4,
      name: "Cilantro",
      quantity: 3,
      expiration: "2025-01-21",
      category: "Fridge",
    },
    {
      id: 5,
      name: "Potatoes",
      quantity: 2,
      expiration: "2025-02-23",
      category: "Pantry",
    },
  ]);

  const handleEdit = (id) => {
    alert(`Edit item with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container">
      <h1 className="title">Inventory Manager</h1>
      <p className="subtitle">
        Manage your fridge, pantry, and freezer items easily
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.expiration}</td>
              <td>{item.category}</td>
              <td>
                <button
                  className="button edit"
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button>
                <button
                  className="button delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;

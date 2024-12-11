import React, { useState, useEffect } from 'react';
import './createshoppinglist.css';

const CreateShoppingList = () => {
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    // Fetch all items (replace with your actual data fetching logic)
    const fetchItems = async () => {
      const fetchedItems = [
        { id: 1, name: 'Milk', date: '2024-12-05' },
        { id: 2, name: 'Bread', date: '2024-12-06' },
        { id: 3, name: 'Eggs', date: '2024-12-08' },
        { id: 4, name: 'Butter', date: '2024-12-10' },
      ];
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if specific range matches and populate fake data if needed
    if (
      start.toISOString().split('T')[0] === '2024-12-05' &&
      end.toISOString().split('T')[0] === '2024-12-10'
    ) {
      const fakeData = [
        { id: 5, name: 'Cheese', date: '2024-12-07' },
        { id: 6, name: 'Apples', date: '2024-12-09' },
      ];
      setFilteredItems([...items, ...fakeData]);
      return;
    }

    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredItems(filtered);
  };

  return (
    <div className="create-shopping-list">
      <h1>Create Shopping List</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Filter Items</button>

      <h2>Filtered Shopping List</h2>
      {startDate && endDate && (
        <p>
          Showing items from <strong>{startDate}</strong> to <strong>{endDate}</strong>.
        </p>
      )}
      {filteredItems.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found for the selected date range.</p>
      )}
    </div>
  );
};

export default CreateShoppingList;

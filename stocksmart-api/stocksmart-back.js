const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database('./Checkpoint2-dbase.sqlite3', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Endpoints

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(
    'SELECT * FROM user WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      } else if (!row) {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        res.json({ message: 'Login successful', user: row });
      }
    }
  );
});

// Get all inventory items for a specific user
app.get('/inventory/:userId', (req, res) => {
  const { userId } = req.params;
  db.all('SELECT * FROM inventory WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add an item to a user's inventory
app.post('/inventory', (req, res) => {
  const { user_id, item_name, quantity, expiration_date, category_name } = req.body;
  db.run(
    'INSERT INTO inventory (user_id, item_name, quantity, expiration_date, category_name) VALUES (?, ?, ?, ?, ?)',
    [user_id, item_name, quantity, expiration_date, category_name],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Item added successfully', id: this.lastID });
    }
  );
});

// Update an item in the user's inventory
app.put('/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;
  const { quantity, expiration_date } = req.body;
  db.run(
    'UPDATE inventory SET quantity = ?, expiration_date = ? WHERE inventory_id = ?',
    [quantity, expiration_date, itemId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Item updated successfully' });
    }
  );
});

// Delete an item from the user's inventory
app.delete('/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;
  db.run('DELETE FROM inventory WHERE inventory_id = ?', [itemId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

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

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
  db.get(query, [email, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (!row) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful', user: row });
    }
  });
});

// Get all inventory items for a specific user
app.get('/inventory/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = 'SELECT * FROM inventory WHERE user_id = ?';
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add an item to a user's inventory
app.post('/inventory', (req, res) => {
  const {
    user_id,
    item_name,
    quantity,
    expiration_date,
    category_name,
    brand_name,
    nutritional_id,
    calories,
    protein,
    fat,
    carbohydrates,
    dietary_labels,
  } = req.body;

  if (
    !user_id ||
    !item_name ||
    !quantity ||
    !expiration_date ||
    !category_name ||
    !brand_name ||
    calories == null ||
    protein == null ||
    fat == null ||
    carbohydrates == null
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO inventory (
      user_id, item_name, quantity, expiration_date, category_name,
      brand_name, nutritional_id, calories, protein, fat, carbohydrates, dietary_labels
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      user_id,
      item_name,
      quantity,
      expiration_date,
      category_name,
      brand_name,
      nutritional_id,
      calories,
      protein,
      fat,
      carbohydrates,
      dietary_labels,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Item added successfully', id: this.lastID });
      }
    }
  );
});

// Update an item in the user's inventory
app.put('/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;
  const {
    quantity,
    expiration_date,
    brand_name,
    nutritional_id,
    calories,
    protein,
    fat,
    carbohydrates,
    dietary_labels,
  } = req.body;

  if (
    !quantity ||
    !expiration_date ||
    !brand_name ||
    calories == null ||
    protein == null ||
    fat == null ||
    carbohydrates == null
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    UPDATE inventory
    SET quantity = ?, expiration_date = ?, brand_name = ?, nutritional_id = ?,
        calories = ?, protein = ?, fat = ?, carbohydrates = ?, dietary_labels = ?
    WHERE inventory_id = ?
  `;

  db.run(
    query,
    [
      quantity,
      expiration_date,
      brand_name,
      nutritional_id,
      calories,
      protein,
      fat,
      carbohydrates,
      dietary_labels,
      itemId,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json({ message: 'Item updated successfully' });
      }
    }
  );
});

// Delete an item from the user's inventory
app.delete('/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  const query = 'DELETE FROM inventory WHERE inventory_id = ?';
  db.run(query, [itemId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
});

// Get expiring items for a specific user
app.get('/inventory/:userId/expiring', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = `
    SELECT * FROM inventory
    WHERE user_id = ? AND expiration_date <= date('now', '+3 days')
    ORDER BY expiration_date ASC
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Global Error Handling for Unknown Routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

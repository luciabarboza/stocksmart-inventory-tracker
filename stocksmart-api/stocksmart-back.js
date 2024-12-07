const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 5001;
/// need to npm i express cors in order for backend to work
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

//Endpoints


// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists with the provided email and password
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


// Get all inventory items should be two of em http://localhost:5001/inventory

app.get('/inventory', (req, res) => {
  db.all('SELECT * FROM inventory', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});



// Add an item to inventory
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
      res.json({ id: this.lastID });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

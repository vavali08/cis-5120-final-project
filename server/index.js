const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/users
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const sql = 'INSERT INTO users (username) VALUES (?)';
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
});

// GET all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single user by ID
app.get('/api/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// PUT update user by ID
app.put('/api/users/:id', (req, res) => {
  const { username } = req.body;
  db.query('UPDATE users SET username = ? WHERE id = ?', [username, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET friends of user
app.get('/api/users/:id/friends', (req, res) => {
  const userId = req.params.id;
  db.query(
    'SELECT u.id, u.username FROM users u JOIN friends f ON f.friend_id = u.id WHERE f.user_id = ? AND f.status = "accepted"',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Test DB connection
console.log("Registering /api/test-db route...");
app.get('/api/test-db', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    connection.release();
    res.json({ message: 'Connected to MySQL successfully!' });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
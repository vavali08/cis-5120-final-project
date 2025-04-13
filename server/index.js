const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// PROFILE RELATED

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

// EVENTS/EVENT MAPS

// Query to get user's schedule
app.get('/api/users/:id/schedules', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      e.id AS eventId,
      e.date,
      e.time_range AS time,
      e.dining_type AS diningType,
      e.is_availability,
      e.title,
      e.location,
      ep.status,
      u.username AS friend
    FROM events e
    LEFT JOIN event_participants ep ON ep.event_id = e.id AND ep.user_id = ?
    LEFT JOIN users u ON e.host_id = u.id
    WHERE (ep.user_id = ? OR e.host_id = ?)
    ORDER BY e.date, e.time_range;
  `;

  db.query(sql, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error("Error in /schedules:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


app.get('/api/users/:id/availabilities', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      id AS eventId,
      date,
      time_range AS time,
      dining_type AS diningType,
      title,
      location,
      is_availability
    FROM events
    WHERE host_id = ? AND is_availability = TRUE
    ORDER BY date, time_range;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Query to get friend schedules and availabilities
app.get('/api/users/:id/friends/availabilities', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      e.id AS eventId,
      e.date,
      e.time_range AS time,
      e.dining_type AS diningType,
      e.title,
      e.location,
      e.is_availability,
      e.is_public,
      u.username AS friend
    FROM friends f
    JOIN users u ON u.id = f.friend_id
    JOIN events e ON e.host_id = u.id
    WHERE f.user_id = ? AND f.status = 'accepted'
      AND (e.is_availability = TRUE OR e.is_public = TRUE)
    ORDER BY e.date, e.time_range;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/events/:id', (req, res) => {
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

app.get('/api/events/:id/attendees', (req, res) => {
  const sql = `
    SELECT u.username, ep.status, ep.joined_by_user
    FROM event_participants ep
    JOIN users u ON u.id = ep.user_id
    WHERE ep.event_id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Status update route
app.put('/api/events/:id/attendees', (req, res) => {
  const { username, status } = req.body;
  const eventId = req.params.id;

  const sql = `
    UPDATE event_participants ep
    JOIN users u ON ep.user_id = u.id
    SET ep.status = ?
    WHERE ep.event_id = ? AND u.username = ?
  `;

  db.query(sql, [status, eventId, username], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
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
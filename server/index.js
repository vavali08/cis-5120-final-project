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

// GET visible events for map page
app.get('/api/users/:id/visible-events', (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      e.*, 
      u.username AS host_name 
    FROM events e
    JOIN users u ON e.host_id = u.id
    LEFT JOIN event_participants ep ON ep.event_id = e.id AND ep.user_id = ?
    WHERE e.is_public = TRUE OR e.host_id = ? OR ep.user_id = ?
    ORDER BY e.date, e.time_range
  `;
  db.query(sql, [userId, userId], (err, results) => {
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

// Create new avent
app.post('/api/events', (req, res) => {
  const {
    title, host_id, location, date,
    time_range, dining_type, latitude,
    longitude, is_availability, is_public
  } = req.body;

  const sql = `INSERT INTO events
    (title, host_id, location, date, time_range, dining_type, latitude, longitude, is_availability, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [title, host_id, location, date, time_range, dining_type, latitude, longitude, is_availability, is_public];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const eventId = result.insertId;

    const insertHostParticipant = `
      INSERT INTO event_participants (event_id, user_id, status)
      VALUES (?, ?, 'confirmed')
    `;
    db.query(insertHostParticipant, [eventId, host_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ id: eventId });
    });
  });
});

// Invite to event
app.post('/api/events/:id/invite', (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;

  const sql = `
    INSERT INTO event_participants (event_id, user_id, status)
    VALUES (?, ?, 'invitation_pending')
    ON DUPLICATE KEY UPDATE status = 'invitation_pending'
  `;

  db.query(sql, [eventId, user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});



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
  const eventId = req.params.id;
  const sql = `
    SELECT ep.user_id, u.username, ep.status
    FROM event_participants ep
    JOIN users u ON u.id = ep.user_id
    WHERE ep.event_id = ?
  `;
  db.query(sql, [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//Request to join event
app.post('/api/events/:id/request', (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;

  const sql = `
    INSERT INTO event_participants (event_id, user_id, status)
    VALUES (?, ?, 'request_pending')
    ON DUPLICATE KEY UPDATE status = 'request_pending'
  `;

  db.query(sql, [eventId, user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
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

app.get('/api/events/location/:location', (req, res) => {
  const location = decodeURIComponent(req.params.location);
  db.query(
    `SELECT e.*, u.username as host_name
     FROM events e
     LEFT JOIN users u ON e.host_id = u.id
     WHERE e.location = ?`,
    [location],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// EVENTS PAGE
// delete an event from the events page
app.delete('/api/events/:id', (req, res) => {
  const eventId = req.params.id;

  // Delete attendees first to satisfy foreign key constraint (if exists)
  db.query('DELETE FROM event_participants WHERE event_id = ?', [eventId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Then delete event
    db.query('DELETE FROM events WHERE id = ?', [eventId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// Handling event firend invites etc
// Cancel join request
// DELETE /api/events/:id/request/:userId
app.delete('/api/events/:id/request/:userId', (req, res) => {
  const eventId = req.params.id;
  const userId = req.params.userId;

  const sql = `
    DELETE FROM event_participants 
    WHERE event_id = ? AND user_id = ? AND status = 'request_pending'
  `;

  db.query(sql, [eventId, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Join request removed.' });
  });
});

// Uninvite/remove attendees as host
// DELETE /api/events/:id/attendees/:userId
app.delete('/api/events/:id/attendees/:userId', (req, res) => {
  const eventId = req.params.id;
  const userId = req.params.userId;

  const sql = `
    DELETE FROM event_participants 
    WHERE event_id = ? AND user_id = ?
  `;

  db.query(sql, [eventId, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Attendee removed from event.' });
  });
});


// Edit events
// PUT /api/events/:id — Update event details
app.put('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  const {
    title, location, latitude, longitude,
    date, dining_type, time_range
  } = req.body;

  const sql = `
    UPDATE events
    SET title = ?, location = ?, latitude = ?, longitude = ?, date = ?, dining_type = ?, time_range = ?
    WHERE id = ?
  `;

  const values = [title, location, latitude, longitude, date, dining_type, time_range, eventId];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error updating event:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: "Event updated successfully." });
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

process.on('exit', (code) => {
  console.log('Process exited with code:', code);
});

process.on('SIGINT', () => {
  console.log('Caught SIGINT (Ctrl+C?)');
  process.exit();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
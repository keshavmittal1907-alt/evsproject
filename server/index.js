const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite DB Connection
const dbPath = path.resolve(__dirname, 'ledger.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('REST API Error opening local SQLite database:', err.message);
  } else {
    // Scaffold immutable ledger reports table structure
    db.run(`CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      location TEXT,
      description TEXT,
      status TEXT,
      upvotes INTEGER
    )`, (createErr) => {
      // Seed initial mock data if the database is genuinely empty (first run)
      if (!createErr) {
        db.get('SELECT COUNT(*) as count FROM reports', [], (countErr, row) => {
          if (!countErr && row.count === 0) {
            console.log("Empty ledger detected. Seeding mock environmental violations...");
            const stmt = db.prepare('INSERT INTO reports (date, location, description, status, upvotes) VALUES (?, ?, ?, ?, ?)');
            stmt.run(['2024-03-24', 'Okhla Phase 1 WTE Plant', 'Thick black localized smoke bypassing the secondary scrubber. Strong sulfur odor.', 'verified', 142]);
            stmt.run(['2024-03-22', 'Bawana Sector 4', 'Illegal dumping and internal burning of chemical barrels behind Sector 4 units at 2AM.', 'pending review', 56]);
            stmt.run(['2024-03-20', 'Manesar Auto Hub, Plot 89', 'Unfiltered particulate matter blowing directly across the highway reducing visibility to near-zero.', 'verified', 214]);
            stmt.finalize();
          }
        });
      }
    });
  }
});

// GET /api/reports - Fetch full chronological ledger
app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM reports ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST /api/reports - Publish new community ledger entry
app.post('/api/reports', (req, res) => {
  const { date, location, description, status, upvotes } = req.body;
  
  if (!location || !description) {
    return res.status(400).json({ error: 'Payload rejected: Location and explicit description are legally required for tracking.' });
  }

  const sql = `INSERT INTO reports (date, location, description, status, upvotes) VALUES (?, ?, ?, ?, ?)`;
  const params = [date, location, description, status || 'pending review', upvotes || 0];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Echo the newly created immutable record to the client
    res.json({
      id: this.lastID,
      date,
      location,
      description,
      status: status || 'pending review',
      upvotes: upvotes || 0
    });
  });
});

// PUT /api/reports/:id/upvote - Increment community verification metric
app.put('/api/reports/:id/upvote', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE reports SET upvotes = upvotes + 1 WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, verifiedId: id, totalChangesProcessed: this.changes });
  });
});

app.listen(port, () => {
  console.log(`[EcoWatch] Backend REST Integrations Server natively listening on http://localhost:${port}`);
});

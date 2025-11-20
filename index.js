const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const dbFile = path.join(__dirname, 'data', 'db.sqlite');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      rollNo TEXT,
      institution TEXT,
      phone TEXT,
      createdAt TEXT
    )
  `);

  // Items table
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      type TEXT,
      title TEXT,
      description TEXT,
      category TEXT,
      location TEXT,
      dateReported TEXT,
      status TEXT,
      reportedBy TEXT,
      reporterName TEXT,
      reporterRollNo TEXT,
      reporterInstitution TEXT,
      imageUrl TEXT,
      aiAnalysis TEXT,
      matchedWith TEXT
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      fromUserId TEXT,
      toUserId TEXT,
      itemId TEXT,
      lostItemId TEXT,
      foundItemId TEXT,
      content TEXT,
      timestamp TEXT,
      read INTEGER DEFAULT 0,
      FOREIGN KEY(fromUserId) REFERENCES users(id),
      FOREIGN KEY(toUserId) REFERENCES users(id)
    )
  `);

  // Matches table
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      lostItemId TEXT,
      foundItemId TEXT,
      confidence REAL,
      status TEXT,
      createdAt TEXT,
      FOREIGN KEY(lostItemId) REFERENCES items(id),
      FOREIGN KEY(foundItemId) REFERENCES items(id)
    )
  `);
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});

const upload = multer({ storage });

// Helper: Simple password hashing (NOT for production - use bcrypt)
const hashPassword = (pwd) => Buffer.from(pwd).toString('base64');
const verifyPassword = (pwd, hash) => hashPassword(pwd) === hash;

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, name, password, rollNo, institution, phone } = req.body;
    if (!email || !name || !password || !rollNo || !institution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email or rollNo already exists
    db.get('SELECT id FROM users WHERE email = ? OR rollNo = ?', [email, rollNo], (err, existingUser) => {
      if (err) {
        console.error('Register error', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email or student ID' });
      }

      const id = `user_${Date.now()}`;
      const hashedPwd = hashPassword(password);
      const createdAt = new Date().toISOString();

      const stmt = db.prepare(
        `INSERT INTO users (id,email,name,password,rollNo,institution,phone,createdAt) 
         VALUES (?,?,?,?,?,?,?,?)`
      );
      stmt.run(id, email, name, hashedPwd, rollNo, institution, phone || '', createdAt, function(err) {
        if (err) {
          console.error('Register error', err);
          return res.status(400).json({ error: 'User already exists with this email or student ID' });
        }
        res.json({ 
          success: true, 
          user: { id, email, name, rollNo, institution, phone: phone || '', createdAt } 
        });
      });
      stmt.finalize();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const { password: _, ...userWithoutPwd } = user;
      res.json({ 
        success: true, 
        user: userWithoutPwd,
        token: `token_${user.id}` 
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    db.get('SELECT id,email,name,rollNo,institution,phone,createdAt FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/auth/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, rollNo, institution } = req.body;
    
    const stmt = db.prepare('UPDATE users SET name=?, phone=?, rollNo=?, institution=? WHERE id=?');
    stmt.run(name, phone, rollNo, institution, userId, function(err) {
      if (err) {
        console.error('Profile update error', err);
        return res.status(500).json({ error: 'Update failed' });
      }
      res.json({ success: true, message: 'Profile updated' });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Matching algorithm helper
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 100;
  
  // Check for substring match
  if (s1.includes(s2) || s2.includes(s1)) return 75;
  
  // Simple word overlap
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w));
  const union = new Set([...words1, ...words2]);
  return Math.round((intersection.length / union.size) * 100);
};

const findMatches = (newItem, callback) => {
  try {
    // Look for opposite type items
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    db.all(
      'SELECT * FROM items WHERE type = ? AND status IN (?, ?) AND id != ?',
      [oppositeType, 'active', 'matched', newItem.id],
      (err, potentialMatches) => {
        if (err || !potentialMatches || potentialMatches.length === 0) {
          return callback();
        }

        // Score each potential match
        const scoredMatches = potentialMatches.map(candidate => {
          let confidence = 0;

          // Category exact match: +40 points
          if (newItem.category && candidate.category && newItem.category === candidate.category) {
            confidence += 40;
          }

          // Title similarity: +30 points
          const titleSim = calculateSimilarity(newItem.title, candidate.title);
          confidence += (titleSim / 100) * 30;

          // Description similarity: +25 points
          const descSim = calculateSimilarity(newItem.description, candidate.description);
          confidence += (descSim / 100) * 25;

          // Location similarity: +5 points (simple word match for now)
          const locSim = calculateSimilarity(newItem.location, candidate.location);
          confidence += (locSim / 100) * 5;

          return { candidate, confidence: Math.round(confidence) };
        });

        // Filter matches with confidence > 60%
        const bestMatches = scoredMatches.filter(m => m.confidence > 60);

        if (bestMatches.length === 0) {
          return callback();
        }

        // Create matches (sorted by confidence, highest first)
        bestMatches.sort((a, b) => b.confidence - a.confidence);
        const topMatch = bestMatches[0];

        const matchId = `match_${Date.now()}`;
        const createdAt = new Date().toISOString();
        const lostItemId = newItem.type === 'lost' ? newItem.id : topMatch.candidate.id;
        const foundItemId = newItem.type === 'found' ? newItem.id : topMatch.candidate.id;

        // Insert match record
        const matchStmt = db.prepare(
          `INSERT INTO matches (id,lostItemId,foundItemId,confidence,status,createdAt) 
           VALUES (?,?,?,?,?,?)`
        );
        matchStmt.run(
          matchId, lostItemId, foundItemId, topMatch.confidence, 'pending', createdAt,
          (err) => {
            if (err) {
              console.error('Match insert error', err);
              return callback();
            }

            // Update both items to matched status
            const updateStmt = db.prepare('UPDATE items SET status = ?, matchedWith = ? WHERE id = ?');
            updateStmt.run('matched', foundItemId, lostItemId, () => {});
            updateStmt.run('matched', lostItemId, foundItemId, () => {});

            console.log(`✓ Match created: ${topMatch.confidence}% confidence between ${lostItemId} and ${foundItemId}`);
            callback();
          }
        );
        matchStmt.finalize();
      }
    );
  } catch (err) {
    console.error('Matching error:', err);
    callback();
  }
};

// Create item
app.post('/api/items', upload.single('image'), (req, res) => {
  try {
    const { type, title, description, category, location, dateReported, status, reportedBy, reporterName, reporterRollNo, reporterInstitution, aiAnalysis } = req.body;
    const id = `item_${Date.now()}`;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const stmt = db.prepare(
      `INSERT INTO items (id,type,title,description,category,location,dateReported,status,reportedBy,reporterName,reporterRollNo,reporterInstitution,imageUrl,aiAnalysis) 
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    );
    stmt.run(
      id, type, title, description, category, location, dateReported, status, 
      reportedBy || null, reporterName || null, reporterRollNo || null, reporterInstitution || null, 
      imageUrl, aiAnalysis || null, 
      function(err) {
        if (err) {
          console.error('DB insert error', err);
          return res.status(500).json({ error: 'db insert failed' });
        }

        // Trigger matching algorithm
        const newItem = { id, type, title, description, category, location };
        findMatches(newItem, () => {
          res.json({ 
            success: true, 
            item: { id, type, title, description, category, location, dateReported, status, reportedBy, reporterName, reporterRollNo, reporterInstitution, imageUrl, aiAnalysis } 
          });
        });
      }
    );
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('UPDATE items SET status = ? WHERE id = ?');
    stmt.run('deleted', id, function(err) {
      if (err) {
        console.error('Delete error', err);
        return res.status(500).json({ error: 'delete failed' });
      }
      res.json({ success: true, message: 'Item deleted' });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get user's items
app.get('/api/items/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    db.all('SELECT * FROM items WHERE reportedBy = ? AND status != ?', [userId, 'deleted'], (err, items) => {
      if (err) {
        console.error('DB read error', err);
        return res.status(500).json({ error: 'db read failed' });
      }
      res.json({ items });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// List items (optional filter by type)
app.get('/api/items', (req, res) => {
  const type = req.query.type;
  let sql = 'SELECT * FROM items WHERE status != ?';
  const params = ['deleted'];
  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  db.all(sql + ' ORDER BY rowid DESC LIMIT 200', params, (err, rows) => {
    if (err) {
      console.error('DB read error', err);
      return res.status(500).json({ error: 'db read failed' });
    }
    // map imageUrl to absolute URL when available
    const host = req.protocol + '://' + req.get('host');
    const items = rows.map(r => ({ ...r, imageUrl: r.imageUrl ? host + r.imageUrl : '' }));
    res.json({ items });
  });
});

// Messages endpoints
app.post('/api/messages', (req, res) => {
  try {
    const { fromUserId, toUserId, lostItemId, foundItemId, content } = req.body;
    const id = `msg_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(
      `INSERT INTO messages (id,fromUserId,toUserId,lostItemId,foundItemId,content,timestamp,read) 
       VALUES (?,?,?,?,?,?,?,?)`
    );
    stmt.run(id, fromUserId, toUserId, lostItemId, foundItemId, content, timestamp, 0, function(err) {
      if (err) {
        console.error('Message insert error', err);
        return res.status(500).json({ error: 'Message failed' });
      }
      res.json({ success: true, message: { id, fromUserId, toUserId, content, timestamp } });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/messages/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    db.all('SELECT * FROM messages WHERE toUserId = ? ORDER BY timestamp DESC', [userId], (err, messages) => {
      if (err) {
        console.error('Messages read error', err);
        return res.status(500).json({ error: 'Read failed' });
      }
      res.json({ messages });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Matching endpoints
app.post('/api/matches', (req, res) => {
  try {
    const { lostItemId, foundItemId, confidence } = req.body;
    const id = `match_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(
      `INSERT INTO matches (id,lostItemId,foundItemId,confidence,status,createdAt) 
       VALUES (?,?,?,?,?,?)`
    );
    stmt.run(id, lostItemId, foundItemId, confidence, 'pending', createdAt, function(err) {
      if (err) {
        console.error('Match insert error', err);
        return res.status(500).json({ error: 'Match creation failed' });
      }
      // Mark both items as matched
      db.prepare('UPDATE items SET status = ?, matchedWith = ? WHERE id = ?').run('matched', foundItemId, lostItemId, () => {});
      db.prepare('UPDATE items SET status = ?, matchedWith = ? WHERE id = ?').run('matched', lostItemId, foundItemId, () => {});
      res.json({ success: true, match: { id, lostItemId, foundItemId, confidence, status: 'pending', createdAt } });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get matches for a user
app.get('/api/matches/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    // Get matches where user is either lost or found item reporter
    const query = `
      SELECT m.*, 
             li.title AS lostTitle, li.reporterName AS lostReporterName, li.reportedBy AS lostReportedBy,
             fi.title AS foundTitle, fi.reporterName AS foundReporterName, fi.reportedBy AS foundReportedBy
      FROM matches m
      LEFT JOIN items li ON m.lostItemId = li.id
      LEFT JOIN items fi ON m.foundItemId = fi.id
      WHERE li.reportedBy = ? OR fi.reportedBy = ?
      ORDER BY m.createdAt DESC
    `;
    db.all(query, [userId, userId], (err, matches) => {
      if (err) {
        console.error('Matches read error', err);
        return res.status(500).json({ error: 'Read failed' });
      }
      res.json({ matches });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

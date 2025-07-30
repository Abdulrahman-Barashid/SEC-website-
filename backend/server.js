const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Function to get Saudi Arabia time
const getSaudiTime = () => {
  // Get current time in Saudi Arabia timezone
  const now = new Date();
  const saudiTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(now);

  // Build ISO string manually
  const year = saudiTime.find(part => part.type === 'year').value;
  const month = saudiTime.find(part => part.type === 'month').value;
  const day = saudiTime.find(part => part.type === 'day').value;
  const hour = saudiTime.find(part => part.type === 'hour').value;
  const minute = saudiTime.find(part => part.type === 'minute').value;
  const second = saudiTime.find(part => part.type === 'second').value;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// Initialize SQLite Database
const db = new sqlite3.Database('./reservations.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      fileName TEXT,
      filePath TEXT,
      createdAt DATETIME NOT NULL
    )`);
  }
});

// Routes

// Get all reservations
app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new reservation
app.post('/api/reservations', upload.single('file'), (req, res) => {
  const { name, phone } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const fileName = req.file ? req.file.originalname : null;
  const filePath = req.file ? req.file.filename : null;
  const createdAt = getSaudiTime(); // Use Saudi time instead of CURRENT_TIMESTAMP

  db.run(
    'INSERT INTO reservations (name, phone, fileName, filePath, createdAt) VALUES (?, ?, ?, ?, ?)',
    [name, phone, fileName, filePath, createdAt],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Return the created reservation
      db.get('SELECT * FROM reservations WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(row);
      });
    }
  );
});

// Delete reservation
app.delete('/api/reservations/:id', (req, res) => {
  const id = req.params.id;
  
  // First, get the reservation to delete associated file
  db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Reservation not found' });
    }
    
    // Delete file if exists
    if (row.filePath) {
      const filePath = path.join(__dirname, 'uploads', row.filePath);
      fs.unlink(filePath, (err) => {
        if (err) console.log('Error deleting file:', err);
      });
    }
    
    // Delete from database
    db.run('DELETE FROM reservations WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Reservation deleted successfully' });
    });
  });
});

// Download file
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
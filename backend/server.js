const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database & Auto-Seed if empty
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] Fresh MongoDB database detected. Populating initial seed data...');
      const seedDB = require('./utils/seedData');
      await seedDB();
    }
  } catch (err) {
    // Non-blocking catch
  }
});

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static Folder for Uploaded Evidence Images
app.use('/uploads', express.static(uploadsDir));

// Frontend static directory (root folder containing index.html, app.js, styles.css)
const frontendDir = path.join(__dirname, '..');
app.use(express.static(frontendDir));

// Root Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SmartCivic Express REST API Server Operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// REST API Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Standalone File Upload Endpoint
const upload = require('./middleware/uploadMiddleware');
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`
  });
});

// Single Page Application (SPA) Client-Side Routing Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Error Handling Middleware for unmatched API routes
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use('/api/*', notFound);
app.use(errorHandler);

// Start Express Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`🚀 SmartCivic Single Unified Web Application running on port ${PORT}`);
  console.log(`🌐 Public / Web Interface: http://localhost:${PORT}`);
  console.log(`⚙️ REST API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

module.exports = app;

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../../../server/config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../../../server/uploads')));

// Routes
app.use('/api/auth', require('../../../server/routes/auth'));
app.use('/api/products', require('../../../server/routes/products'));
app.use('/api/orders', require('../../../server/routes/orders'));
app.use('/api/upload', require('../../../server/routes/upload'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports.handler = serverless(app);
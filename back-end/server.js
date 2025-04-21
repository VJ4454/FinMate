// back‑end/server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Mongo
connectDB();

// Public auth routes
app.use('/api/auth', require('./auth/auth'));  // auth.js exports the /register & /login routes

// Bring in middleware
const authMiddleware = require('./middleware/authMiddleware');

// Example of a protected route:
app.get('/api/transactions', authMiddleware, (req, res) => {
  // req.userId is available here
  // fetch transactions for req.userId…
  res.json({ msg: `Here are your transactions for user ${req.userId}` });
});

// ...other routes (e.g. /api/goals, /api/categories) also wrapped in authMiddleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

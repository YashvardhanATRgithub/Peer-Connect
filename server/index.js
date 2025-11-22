const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('PeerConnect API is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));

module.exports = app;

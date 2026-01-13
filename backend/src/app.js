require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/auth.routes');
const gigRoutes = require('./routes/gig.routes');
const bidRoutes = require('./routes/bid.routes');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust as needed for frontend
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = app;

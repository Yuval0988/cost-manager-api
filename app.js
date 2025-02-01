const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root to add-cost.html
app.get('/api/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-cost.html'));
});

// Import routes
const costRoutes = require('./routes/costs');
const userRoutes = require('./routes/users');
const aboutRoutes = require('./routes/about');

// Use routes
app.use('/api', costRoutes);
app.use('/api', userRoutes);
app.use('/api', aboutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Only connect to MongoDB if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;

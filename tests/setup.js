const mongoose = require('mongoose');

beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
});

afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
});

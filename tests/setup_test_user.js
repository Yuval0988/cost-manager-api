const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/user');
const Cost = require('../models/cost');

async function setupTestUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear existing data
        await User.deleteMany({});
        await Cost.deleteMany({});
        console.log('Cleared existing data');

        // Create test user with specific ID
        const testUser = new User({
            _id: '123123',
            first_name: 'Test',
            last_name: 'User',
            birthday: new Date('1990-01-01'),
            marital_status: 'single'
        });

        await testUser.save();
        console.log('Test user created successfully');
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error setting up test user:', error);
        await mongoose.connection.close();
    }
}

setupTestUser();

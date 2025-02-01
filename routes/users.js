const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @route POST /api/users
 * @description Create a new user
 * @param {string} first_name - User's first name
 * @param {string} last_name - User's last name
 * @param {Date} birthday - User's birthday
 * @param {string} marital_status - User's marital status (single, married, divorced, widowed)
 * @returns {Object} JSON object of the created user
 */
router.post('/users', async (req, res) => {
    try {
        const user = new User({
            _id: req.body._id || '123123', // Default to test user ID if not provided
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: req.body.birthday,
            marital_status: req.body.marital_status
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route GET /api/users/:id
 * @description Get user details including total costs
 * @param {string} id - User ID
 * @returns {Object} JSON object containing user details and total costs
 */
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate total costs for the user
        const costs = await Cost.find({ userid: user._id });
        const total = costs.reduce((sum, cost) => sum + cost.sum, 0);

        res.json({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            total
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

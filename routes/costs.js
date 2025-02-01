const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

// POST /api/add - Add new cost item
router.post('/add', async (req, res) => {
    try {
        // Validate required parameters
        const { description, category, userid, sum } = req.body;
        if (!description || !category || !userid || sum === undefined) {
            return res.status(400).json({ 
                error: 'Missing required parameters. Required: description, category, userid, sum' 
            });
        }

        // Check if user exists
        const userExists = await User.findById(userid);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cost = new Cost({
            description,
            category,
            userid,
            sum,
            date: req.body.date || new Date()
        });

        const savedCost = await cost.save();
        res.status(201).json(savedCost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/report - Get monthly report
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // Validate required parameters
        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing required parameters. Required: id, year, month' });
        }

        // Create date range for the specified month
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const costs = await Cost.find({
            userid: id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Create array of category objects
        const categories = ['food', 'education', 'health', 'housing', 'sport'];
        const result = [];

        // Add each category as a separate object in the array
        categories.forEach(category => {
            const categoryCosts = costs
                .filter(cost => cost.category === category)
                .map(cost => ({
                    sum: cost.sum,
                    description: cost.description,
                    day: cost.date.getDate()
                }));

            result.push({
                [category]: categoryCosts
            });
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

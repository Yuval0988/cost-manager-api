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

        // Group costs by category with required format
        const groupedCosts = costs.reduce((acc, cost) => {
            if (!acc[cost.category]) {
                acc[cost.category] = [];
            }
            acc[cost.category].push({
                sum: cost.sum,
                day: cost.date.getDate(),
                description: cost.description
            });
            return acc;
        }, {});

        // Ensure all categories exist in response even if empty
        const categories = ['food', 'health', 'housing', 'sport', 'education'];
        categories.forEach(category => {
            if (!groupedCosts[category]) {
                groupedCosts[category] = [];
            }
        });

        res.json(groupedCosts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

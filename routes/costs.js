const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

/**
 * @route POST /api/add
 * @description Add a new cost item
 * @param {string} description - Description of the cost
 * @param {string} category - Category of the cost (food, health, housing, sport, education)
 * @param {string} userid - ID of the user
 * @param {number} sum - Cost amount
 * @returns {Object} JSON object of the created cost
 */
router.post('/add', async (req, res) => {
    try {
        // Check if user exists
        const userExists = await User.findById(req.body.userid);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cost = new Cost({
            description: req.body.description,
            category: req.body.category,
            userid: req.body.userid,
            sum: req.body.sum,
            date: req.body.date || new Date()
        });

        const savedCost = await cost.save();
        res.status(201).json(savedCost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route GET /api/report
 * @description Get monthly report of costs grouped by category
 * @param {string} id - User ID
 * @param {number} year - Year for the report
 * @param {number} month - Month for the report
 * @returns {Object} JSON object with costs grouped by category
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // Validate required parameters
        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing required parameters' });
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

        // Group costs by category
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

        // Ensure all categories exist in response
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

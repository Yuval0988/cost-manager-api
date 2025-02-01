const express = require('express');
const router = express.Router();

/**
 * @route GET /api/about
 * @description Get information about the development team
 * @returns {Array} Array of objects containing team members' first and last names
 * @example
 * Response:
 * [
 *   {
 *     "first_name": "John",
 *     "last_name": "Doe"
 *   }
 * ]
 */
router.get('/about', (req, res) => {
    // Replace with actual team members' information
    const developers = [
        {
            first_name: "John",
            last_name: "Doe"
        }
        // Add other team members here as needed
    ];
    
    res.json(developers);
});

module.exports = router;

const express = require('express');
const router = express.Router();

/**
 * GET /api/about - Get developers team information
 * Returns only first and last names of team members
 */
router.get('/about', (req, res) => {
    // Return team members with only first_name and last_name
    const developers = [
        {
            first_name: "Yuval",
            last_name: "Shilo"
        },
        {
            first_name: "Shaked",
            last_name: "Kraidman"
        }
    ];
    
    // Verify each developer object only has first_name and last_name
    const cleanDevelopers = developers.map(dev => ({
        first_name: dev.first_name,
        last_name: dev.last_name
    }));
    
    res.json(cleanDevelopers);
});

module.exports = router;

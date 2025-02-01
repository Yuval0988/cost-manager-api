const mongoose = require('mongoose');

/**
 * @typedef Cost
 * @property {string} description - Description of the cost item
 * @property {string} category - Category of the cost (food, health, housing, sport, education)
 * @property {string} userid - ID of the user who created the cost
 * @property {number} sum - Amount of the cost
 * @property {Date} date - Date when the cost was created
 */

/**
 * Cost Schema
 * @description Schema for cost items in the system
 * Each cost is associated with a user and must belong to one of the predefined categories
 */
const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        validate: {
            validator: function(v) {
                return ['food', 'health', 'housing', 'sport', 'education'].includes(v);
            },
            message: props => `${props.value} is not a valid category. Must be one of: food, health, housing, sport, education`
        }
    },
    userid: {
        type: String,
        ref: 'User',
        required: true
    },
    sum: {
        type: Number,
        required: true,
        min: [0, 'Cost amount cannot be negative']
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

/**
 * Index for efficient querying of costs by user and date
 * Supports the monthly report feature
 */
costSchema.index({ userid: 1, date: 1 });

module.exports = mongoose.model('Cost', costSchema);

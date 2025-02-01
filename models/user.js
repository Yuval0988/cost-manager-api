const mongoose = require('mongoose');

/**
 * @typedef User
 * @property {string} _id - Unique identifier for the user
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {Date} birthday - User's date of birth
 * @property {string} marital_status - User's marital status (single, married, divorced, widowed)
 * @property {number} total - Virtual property that computes total costs for the user
 */

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    marital_status: {
        type: String,
        required: true,
        enum: ['single', 'married', 'divorced', 'widowed']
    }
}, {
    toJSON: {
        virtuals: true
    }
});

/**
 * Virtual property to compute total costs for a user
 * Implements the computed pattern as required
 */
userSchema.virtual('total', {
    ref: 'Cost',
    localField: '_id',
    foreignField: 'userid',
    count: false,
    get: function(costs) {
        if (!costs) return 0;
        return costs.reduce((total, cost) => total + cost.sum, 0);
    }
});

module.exports = mongoose.model('User', userSchema);

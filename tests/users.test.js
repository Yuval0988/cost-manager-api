const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Cost = require('../models/cost');

describe('User API Endpoints', () => {
    beforeEach(async () => {
        // Clear collections before each test
        await User.deleteMany({});
        await Cost.deleteMany({});
    });

    describe('GET /api/users/:id', () => {
        it('should get user details with total costs', async () => {
            // Create a test user
            const user = await User.create({
                first_name: 'Test',
                last_name: 'User',
                birthday: new Date('1990-01-01'),
                marital_status: 'single'
            });

            // Create some costs for the user
            await Cost.create([
                {
                    description: 'Test cost 1',
                    category: 'food',
                    userid: user._id,
                    sum: 100
                },
                {
                    description: 'Test cost 2',
                    category: 'health',
                    userid: user._id,
                    sum: 200
                }
            ]);

            const response = await request(app)
                .get(`/api/users/${user._id}`)
                .expect(200);

            expect(response.body.first_name).toBe('Test');
            expect(response.body.last_name).toBe('User');
            expect(response.body.total).toBe(300);
        });

        it('should return 404 if user does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            await request(app)
                .get(`/api/users/${nonExistentId}`)
                .expect(404);
        });
    });
});

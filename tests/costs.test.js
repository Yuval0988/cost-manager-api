const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Cost = require('../models/cost');

describe('Cost API Endpoints', () => {
    beforeEach(async () => {
        // Clear collections before each test
        await User.deleteMany({});
        await Cost.deleteMany({});
    });

    describe('POST /api/add', () => {
        it('should create a new cost item', async () => {
            // Create a test user first
            const user = await User.create({
                first_name: 'Test',
                last_name: 'User',
                birthday: new Date('1990-01-01'),
                marital_status: 'single'
            });

            const costData = {
                description: 'Test cost',
                category: 'food',
                userid: user._id,
                sum: 100
            };

            const response = await request(app)
                .post('/api/add')
                .send(costData)
                .expect(201);

            expect(response.body.description).toBe(costData.description);
            expect(response.body.category).toBe(costData.category);
            expect(response.body.sum).toBe(costData.sum);
        });

        it('should return 404 if user does not exist', async () => {
            const costData = {
                description: 'Test cost',
                category: 'food',
                userid: new mongoose.Types.ObjectId(),
                sum: 100
            };

            await request(app)
                .post('/api/add')
                .send(costData)
                .expect(404);
        });
    });

    describe('GET /api/report', () => {
        it('should get monthly report for user', async () => {
            const user = await User.create({
                first_name: 'Test',
                last_name: 'User',
                birthday: new Date('1990-01-01'),
                marital_status: 'single'
            });

            // Create test costs
            await Cost.create([
                {
                    description: 'Test cost 1',
                    category: 'food',
                    userid: user._id,
                    sum: 100,
                    date: new Date('2023-01-15')
                },
                {
                    description: 'Test cost 2',
                    category: 'health',
                    userid: user._id,
                    sum: 200,
                    date: new Date('2023-01-20')
                },
                {
                    description: 'Test cost 3',
                    category: 'food',
                    userid: user._id,
                    sum: 150,
                    date: new Date('2023-02-01') // Different month
                }
            ]);

            const response = await request(app)
                .get('/api/report')
                .query({ id: user._id, year: 2023, month: 1 })
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body.reduce((sum, cost) => sum + cost.sum, 0)).toBe(300);
        });

        it('should return 400 if parameters are missing', async () => {
            await request(app)
                .get('/api/report')
                .query({ year: 2023 }) // Missing id and month
                .expect(400);
        });
    });
});

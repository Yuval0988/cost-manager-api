const request = require('supertest');
const app = require('../app');

describe('About API Endpoint', () => {
    describe('GET /api/about', () => {
        it('should return developers team information', async () => {
            const response = await request(app)
                .get('/api/about')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            
            // Check structure of each developer object
            response.body.forEach(developer => {
                expect(developer).toHaveProperty('first_name');
                expect(developer).toHaveProperty('last_name');
                expect(typeof developer.first_name).toBe('string');
                expect(typeof developer.last_name).toBe('string');
            });
        });
    });
});

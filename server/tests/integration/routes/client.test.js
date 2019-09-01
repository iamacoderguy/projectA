const request = require('supertest');
const app = require('../../../startup/app');

describe('/', () => {
    describe('GET /', () => {
        it('should return the hello world message', async () => {
            const res = await request(app).get('/');

            expect(res.status).toBe(200);
            expect(res.text).toMatch(/hello/i);
            expect(res.text).toMatch(/world/i);
        });
    });
});
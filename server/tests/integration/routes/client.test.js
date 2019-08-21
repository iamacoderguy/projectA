const request = require('supertest');
let server;

describe('/', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(() => { server.close(); });

    describe('GET /', () => {
        it('should return the hello world message', async () => {
            const res = await request(server).get('/');
            
            expect(res.status).toBe(200);
            expect(res.text).toMatch(/hello/i);
            expect(res.text).toMatch(/world/i);
        });
    });
});
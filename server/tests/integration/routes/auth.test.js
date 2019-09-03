const endpoint = '/api/auth';

const request = require('supertest');
const app = require('../../../startup/app');

const jwt = require('jsonwebtoken');
const config = require('config');

describe(endpoint, () => {
    describe('POST /connect', () => {
        const connectEndpoint = endpoint + '/connect';

        it('should always return 200', async () => {
            // act
            const res = await request(app).post(connectEndpoint);

            // assert
            expect(res.status).toBe(200);
        })
    
        it('should always return a valid jwt', async () => {
            // act
            const res = await request(app).post(connectEndpoint);

            // assert
            const token = res.text;
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            console.log(decoded);

            expect(decoded).toMatchObject({
                client: {
                    ipAddr: expect.any(String),
                    isAdmin: expect.any(Boolean)
                },
                expCode: expect.any(Number),
                exp: expect.any(Number)
            });
        })

        it('should disable previous jwts of the client', async () => {
            // arrange
            // connect and get a jwt

            // act
            const res = await request(app).post(connectEndpoint);

            // assert
            // use a helper to validate the previous jwt
        })
    })

    describe('POST /disconnect', () => {
        const disconnectEndpoint = endpoint + '/disconnect';

        it('should always return 200', async () => {
            // act
            const res = await request(app).post(disconnectEndpoint);

            // assert
            expect(res.status).toBe(200);
        })

        it('should disable all jwt of the client', async () => {
            // arrange
            // connect and get a jwt

            // act
            const res = await request(app).post(disconnectEndpoint);

            // assert
            // use a helper to validate the jwt
        })
    })
})
const endpoint = '/api/auth';

const request = require('supertest');
const app = require('../../../startup/app');

const jwt = require('jsonwebtoken');
const config = require('config');
const authHelper = require('../../../helpers/authHelper');

describe(endpoint, () => {
    const connectEndpoint = endpoint + '/connect';
    const disconnectEndpoint = endpoint + '/disconnect';

    describe('POST /connect', () => {
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

            expect(decoded).toMatchObject({
                id: expect.any(String),
                isAdmin: expect.any(Boolean),
                expCode: expect.any(Number),
                exp: expect.any(Number)
            });
        })

        it('should disable previous jwts of the client', async () => {
            // arrange
            const clientIpAddr = '192.168.1.7';
            let res = await request(app).post(connectEndpoint).set('x-forwarded-for', clientIpAddr);
            const previousToken = res.text;

            // act
            res = await request(app).post(connectEndpoint).set('x-forwarded-for', clientIpAddr);
            const currentToken = res.text;

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            const currentErr = authHelper.verify(clientIpAddr, currentToken);

            expect(previousErr.name).toBe('TokenExpiredError');
            expect(currentErr).toBeNull();
        })
    })

    describe('POST /disconnect', () => {
        it('should always return 200', async () => {
            // act
            const res = await request(app).post(disconnectEndpoint);

            // assert
            expect(res.status).toBe(200);
        })

        it('should disable all jwt of the client', async () => {
            // arrange
            const clientIpAddr = '192.168.1.7';
            let res = await request(app).post(connectEndpoint).set('x-forwarded-for', clientIpAddr);
            const previousToken = res.text;

            // act
            await request(app).post(disconnectEndpoint).set('x-forwarded-for', clientIpAddr);

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            expect(previousErr.name).toBe('DisconnectedError');
        })
    })
})
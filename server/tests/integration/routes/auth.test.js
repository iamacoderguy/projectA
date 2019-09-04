const endpoint = '/api/auth';

const request = require('supertest');
const app = require('../../../startup/app');

const jwt = require('jsonwebtoken');
const config = require('config');
const authHelper = require('../../../helpers/authHelper');

describe(endpoint, () => {
    const connectEndpoint = endpoint + '/connect';
    const disconnectEndpoint = endpoint + '/disconnect';

    const clientIpAddr = '192.168.1.7';

    function postDisconnect(token) {
        return request(app)
            .post(disconnectEndpoint)
            .set('x-forwarded-for', clientIpAddr)
            .set('x-auth-token', token);
    }

    function postConnect(ipAddr) {
        return request(app)
            .post(connectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr);
    }

    describe('POST /connect', () => {
        it('should always return 200', async () => {
            // act
            const res = await postConnect();

            // assert
            expect(res.status).toBe(200);
        })

        it('should always return a valid jwt', async () => {
            // act
            const res = await postConnect();

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
            let res = await postConnect();
            const previousToken = res.text;

            // act
            res = await postConnect();
            const currentToken = res.text;

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            const currentErr = authHelper.verify(clientIpAddr, currentToken);

            expect(previousErr.name).toBe('TokenExpiredError');
            expect(currentErr).toBeNull();
        })
    })

    describe('POST /disconnect', () => {

        it('should return 401 if disconnecting other clients', async () => {
            // arrange
            const otherClientIpAddr = "111.222.1.3";
            let res = await postConnect(otherClientIpAddr);
            const token = res.text;

            // act
            res = await postDisconnect(token);

            // assert
            expect(res.status).toBe(401);
        })

        it('should return 200 if disconnect current client', async () => {
            // arrange
            let res = await postConnect();
            const token = res.text;

            // act
            res = await postDisconnect(token);

            // assert
            expect(res.status).toBe(200);
        })

        it('should disable all jwt of the client', async () => {
            // arrange
            let res = await postConnect();
            const previousToken = res.text;

            // act
            await postDisconnect(previousToken);

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            expect(previousErr.name).toBe('DisconnectedError');
        })
    })
})
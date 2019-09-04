const endpoint = '/api/auth';

const request = require('supertest');
const app = require('../../../startup/app');

const jwt = require('jsonwebtoken');
const config = require('config');
const authHelper = require('../../../helpers/authHelper');
const db_Clients = require('../../../models/db_Clients');

describe(endpoint, () => {
    const connectEndpoint = endpoint + '/connect';
    const disconnectEndpoint = endpoint + '/disconnect';

    const clientIpAddr = '192.168.1.7';

    function postDisconnect(ipAddr, token) {
        if (!token) token = '';

        return request(app)
            .post(disconnectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr)
            .set('x-auth-token', token);
    }

    function postConnect(ipAddr, token) {
        if (!token) token = '';

        return request(app)
            .post(connectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr)
            .set('x-auth-token', token);
    }

    describe('POST /connect', () => {
        afterEach(() => db_Clients.reset());

        describe('if the client is not connecting to server', () => {
            it('should return 200 without requiring token', async () => {
                // act
                const res = await postConnect();

                // assert
                expect(res.status).toBe(200);
            })

            it('should return a valid jwt without requiring token', async () => {
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
        })

        describe('if the client is connecting to server', () => {
            it('should return 401 if providing invalid token', async () => {
                // arrange
                let res = await postConnect(clientIpAddr);

                // act
                res = await postConnect(clientIpAddr);

                // assert
                expect(res.status).toBe(401);
            })

            it('should return 200 if providing valid token', async () => {
                // arrange
                let res = await postConnect(clientIpAddr);
                let token = res.text;

                // act
                res = await postConnect(clientIpAddr, token);

                // assert
                expect(res.status).toBe(200);
            })

            it('should disable previous jwts of the client if providing valid token', async () => {
                // arrange
                let res = await postConnect(clientIpAddr);
                const previousToken = res.text;

                // act
                res = await postConnect(clientIpAddr, previousToken);
                const currentToken = res.text;

                // assert
                const previousErr = authHelper.verify(clientIpAddr, previousToken);
                const currentErr = authHelper.verify(clientIpAddr, currentToken);

                expect(previousErr.name).toBe('TokenExpiredError');
                expect(currentErr).toBeNull();
            })
        })
    })

    describe('POST /disconnect', () => {

        it('should return 401 if using another client\'s token', async () => {
            // arrange
            const otherClientIpAddr = "111.222.1.3";
            let res = await postConnect(otherClientIpAddr);
            const token = res.text;

            // act
            res = await postDisconnect(clientIpAddr, token);

            // assert
            expect(res.status).toBe(401);
        })

        it('should return 200 if using current client\'s token', async () => {
            // arrange
            let res = await postConnect(clientIpAddr);
            const token = res.text;

            // act
            res = await postDisconnect(clientIpAddr, token);

            // assert
            expect(res.status).toBe(200);
        })

        it('should disable all jwt of the client if using the client\'s token', async () => {
            // arrange
            let res = await postConnect(clientIpAddr);
            const previousToken = res.text;

            // act
            await postDisconnect(clientIpAddr, previousToken);

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            expect(previousErr.name).toBe('DisconnectedError');
        })
    })
})
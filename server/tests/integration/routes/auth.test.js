const endpoint = '/api/auth';

const request = require('supertest');
const app = require('../../../startup/app');

const jwt = require('jsonwebtoken');
const config = require('config');
const authHelper = require('../../../helpers/authHelper');
const db_Clients = require('../../../models/db_Clients');
const pinHelper = require('../../../helpers/pinHelper');
const { encrypt, decrypt } = require('../../../helpers/cryptoHelper');

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

    function postConnect(ipAddr, tokenOrPin) {
        return request(app)
            .post(connectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr)
            .set('x-auth-token', tokenOrPin);
    }

    function postConnectWithDefaultPin(ipAddr) {
        return request(app)
            .post(connectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr)
            .set('x-auth-token', pinCode);
    }

    function getARandomPin() {
        return Math.floor((Math.random() * 10000) + 1).toString();
    }

    let pinCode = '';

    beforeEach(() => {
        pinCode = getARandomPin();
        pinHelper.setPin(pinCode);
    })

    describe('POST /connect', () => {
        afterEach(() => {
            db_Clients.reset();
            jest.resetModules();
        });

        describe('if the client is not connecting to server', () => {
            it('should return 400 if NOT providing correct pin', async () => {
                // act
                const pin = getARandomPin();
                const res = await postConnect(clientIpAddr, pin);

                // assert
                expect(res.status).toBe(400);
            })

            it('should return 200 if providing correct pin', async () => {
                // act
                const pin = getARandomPin();
                pinHelper.setPin(pin);
                const res = await postConnect(clientIpAddr, pin);

                // assert
                expect(res.status).toBe(200);
            })

            it('should return a valid jwt if providing correct pin', async () => {
                // act
                const pin = getARandomPin();
                pinHelper.setPin(pin);
                const res = await postConnect(clientIpAddr, pin);

                // assert
                const token = res.text;
                const decryptedToken = decrypt(token, pin);
                const decoded = jwt.verify(decryptedToken, config.get('jwtPrivateKey'));

                expect(decoded).toMatchObject({
                    id: expect.any(String),
                    isAdmin: expect.any(Boolean),
                    expCode: expect.any(Number),
                    exp: expect.any(Number)
                });
            })
        })

        describe('if the client is connecting to server', () => {
            it('should return 401 if NOT providing valid token', async () => {
                // arrange
                let res = await postConnectWithDefaultPin(clientIpAddr);

                // act
                res = await postConnect(clientIpAddr, '');

                // assert
                expect(res.status).toBe(401);
            })

            it('should return 200 if providing valid token', async () => {
                // arrange
                let res = await postConnectWithDefaultPin(clientIpAddr);
                let token = res.text;

                // act
                res = await postConnect(clientIpAddr, token);

                // assert
                expect(res.status).toBe(200);
            })

            it('should disable previous jwts of the client if providing valid token', async () => {
                // arrange
                let res = await postConnectWithDefaultPin(clientIpAddr);
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
            let res = await postConnectWithDefaultPin(otherClientIpAddr);
            const token = res.text;

            // act
            res = await postDisconnect(clientIpAddr, token);

            // assert
            expect(res.status).toBe(401);
        })

        it('should return 200 if using current client\'s token', async () => {
            // arrange
            let res = await postConnectWithDefaultPin(clientIpAddr);
            const token = res.text;

            // act
            res = await postDisconnect(clientIpAddr, token);

            // assert
            expect(res.status).toBe(200);
        })

        it('should disable all jwt of the client if using the client\'s token', async () => {
            // arrange
            let res = await postConnectWithDefaultPin(clientIpAddr);
            const previousToken = res.text;

            // act
            await postDisconnect(clientIpAddr, previousToken);

            // assert
            const previousErr = authHelper.verify(clientIpAddr, previousToken);
            expect(previousErr.name).toBe('DisconnectedError');
        })
    })
})
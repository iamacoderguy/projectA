const endpoint = '/api/auth';

const request = require('supertest');

const jwt = require('jsonwebtoken');
const config = require('config');
const { encrypt, decrypt } = require('../../../helpers/cryptoHelper');

const clientIpAddr = '192.168.1.7';
const connectEndpoint = endpoint + '/connect';
const disconnectEndpoint = endpoint + '/disconnect';

let app;
let pinHelper, authHelper;

describe(endpoint, () => {
    beforeEach(async () => {
        app = require('../../../startup/app');
        pinHelper = require('../../../helpers/pinHelper');
        authHelper = require('../../../helpers/authHelper');
    });

    afterEach(async () => {
        jest.resetModules();
    });

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
        const pinCode = pinHelper.getPin();

        return request(app)
            .post(connectEndpoint)
            .set('x-forwarded-for', !ipAddr ? clientIpAddr : ipAddr)
            .set('x-auth-token', pinCode);
    }

    function getAnIncorrectRandomPin() {
        return Math.floor(10000 + Math.random() * 90000);
    }

    describe('POST /connect', () => {
        describe('if the client is not connecting to server', () => {
            it('should return 400 if NOT providing correct pin', async () => {
                // act
                const pin = getAnIncorrectRandomPin();
                const res = await postConnect(clientIpAddr, pin);

                // assert
                expect(res.status).toBe(400);
            })

            it('should return 200 if providing correct pin', async () => {
                // act
                const pinCode = pinHelper.getPin();
                const res = await postConnect(clientIpAddr, pinCode);

                // assert
                expect(res.status).toBe(200);
            })

            it('should return a valid jwt if providing correct pin', async () => {
                // act
                const pinCode = pinHelper.getPin();
                const res = await postConnect(clientIpAddr, pinCode);

                // assert
                const token = res.text;
                const decryptedToken = decrypt(token, pinCode.toString());
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
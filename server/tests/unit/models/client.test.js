const config = require('config');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../../../helpers/cryptoHelper');

let Client = require('../../../models/client');

describe('generateAuthToken', () => {
    afterEach(() => jest.resetModules());

    it('should generate a correct jwt', () => {
        // arrange
        const pinCode = '1234';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.5";
        const client = new Client(ipAddr);

        // act
        client.createNewSession();
        const token = client.generateAuthToken();

        // assert
        const decryptedToken = decrypt(token, pinCode);
        const decoded = jwt.verify(decryptedToken, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject({
            id: client.id,
            isAdmin: client.isAdmin,
            expCode: expect.any(Number),
            exp: expect.any(Number)
        });
    })
})

describe('verifyToken', () => {
    afterEach(() => jest.resetModules());

    it('should return null if the token is valid', () => {
        // arrange
        const pinCode = '123457';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.7";
        const client = new Client(ipAddr);
        client.createNewSession();
        const token = client.generateAuthToken();

        // act
        const err = client.verifyToken(token);

        // assert
        expect(err).toBeNull();
    })

    it('should return IncorrectPasscodeError with message containing pin changed if the token is encrypted by incorrect pin', () => {
        // arrange
        const pinCode = '123457';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.7";
        const client = new Client(ipAddr);
        client.createNewSession();
        const token = client.generateAuthToken();

        const newPinCode = '123457478';
        pinHelper.setPin(newPinCode);

        // act
        const err = client.verifyToken(token);

        // assert
        expect(err.name).toBe('IncorrectPasscodeError');
        expect(err.message).toMatch(/pin/i);
        expect(err.message).toMatch(/changed/i);
    })

    it('should return IdMismatchedError if the token belongs to another client', () => {
        // arrange
        const pinCode = '123457';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.7";
        const client = new Client(ipAddr);
        client.createNewSession();

        const anotherIpAddr = "123.0.1.8";
        const anotherClient = new Client(anotherIpAddr);
        anotherClient.createNewSession();
        const anotherToken = anotherClient.generateAuthToken();
        

        // act
        const err = client.verifyToken(anotherToken);

        // assert
        expect(err.name).toBe('IdMismatchedError');
    })

    it('should return DisconnectedError if the client is disconnected', () => {
        // arrange
        const pinCode = '123457';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.7";
        const client = new Client(ipAddr);
        client.createNewSession();
        const token = client.generateAuthToken();
        client.cleanAllSessions();

        // act
        const err = client.verifyToken(token);

        // assert
        expect(err.name).toBe('DisconnectedError');
    })

    it('should return TokenExpiredError with message expCode expired if the expCode is out-of-date', () => {
        // arrange
        const pinCode = '123457';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.setPin(pinCode);

        Client = require('../../../models/client');
        const ipAddr = "123.0.1.7";
        const client = new Client(ipAddr);
        client.createNewSession();
        const token = client.generateAuthToken();

        // simulate that the session will be renew after 50 milliseconds
        jest.useFakeTimers();
        setTimeout(() => {
            client.createNewSession();
        }, 50);
        jest.runAllTimers()

        // act
        const err = client.verifyToken(token);

        // assert
        expect(err.name).toBe('TokenExpiredError');
    })
})

describe('createNewSession', () => {
    it('should change expCode to current moment', () => {
        // arrange
        const now = Date.now();
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);

        // act
        client.createNewSession();

        // assert
        expect(typeof client.expCode).toBe("number");
        expect(client.expCode).toBeGreaterThanOrEqual(now);
    })
})

describe('cleanAllSessions', () => {
    it('should change expCode to NaN', () => {
        // arrange
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);
        client.createNewSession();

        // act
        client.cleanAllSessions();

        // assert
        expect(client.expCode).toBeNaN();
    })
})

describe('getIpAddr', () => {
    it('should return the decrypted client ip address', () => {
        // arrange
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);

        // act
        const actualIp = client.getIpAddr();

        // assert
        expect(actualIp).toBe(expectedIpAddr);
    })
})

describe('getStatus', () => {
    it('should return disconnected if NO session is set up, yet', () => {
        // arrange
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);

        // act
        const status = client.getStatus();

        // assert
        expect(status).toBe('disconnected');
    })

    it('should return disconnected if all active sessions are reset', () => {
        // arrange
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);
        client.createNewSession();
        client.cleanAllSessions();

        // act
        const status = client.getStatus();

        // assert
        expect(status).toBe('disconnected');
    })

    it('should return connecting if there is any active sessions', () => {
        // arrange
        const expectedIpAddr = "123.5.1.5";
        const client = new Client(expectedIpAddr);
        client.createNewSession();

        // act
        const status = client.getStatus();

        // assert
        expect(status).toBe('connecting');
    })
})
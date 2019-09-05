const Client = require('../../../models/client');
const config = require('config');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../../../helpers/cryptoHelper');

describe('generateAuthToken', () => {
    afterEach(() => jest.resetModules());

    it('should generate a correct jwt', () => {
        // arrange
        const pinCode = '1234';
        const pinHelper = require('../../../helpers/pinHelper');
        pinHelper.getPin = jest.fn().mockReturnValue('1234');

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
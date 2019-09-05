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
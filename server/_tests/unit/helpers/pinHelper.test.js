const each = require('jest-each').default;
const pinHelper = require('../../../helpers/pinHelper');

describe('initializeARandomPin', () => {
    each([[0.1], [0.9], [0.01], [0.09], [0.001], [0.009]]).it('should create a four-digit pin and store in app db in case Math.random = %f', (randnum) => {
        // arrange
        const mockMath = Object.create(global.Math);
        mockMath.random = () => randnum;
        global.Math = mockMath;

        // act
        pinHelper.initializeARandomPin();

        // assert
        const pin = pinHelper.getPin();
        expect(pin).toBeGreaterThanOrEqual(1000);
        expect(pin).toBeLessThanOrEqual(9999);
    })
})
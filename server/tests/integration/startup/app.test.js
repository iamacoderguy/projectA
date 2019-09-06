const each = require('jest-each').default;

describe('when app starts up', () => {
    afterEach(() => jest.resetModules());

    each([[0.1], [0.9], [0.01], [0.09], [0.001], [0.009]]).it('should initialize a random four-digit pin in db in case Math.random = %f', (randnum) => {
        // arrange
        const mockMath = Object.create(global.Math);
        mockMath.random = () => randnum;
        global.Math = mockMath;

        // act
        require('../../../startup/app');

        // assert
        const pinHelper = require('../../../helpers/pinHelper');
        const pin = pinHelper.getPin();
        expect(pin).toBeGreaterThanOrEqual(1000);
        expect(pin).toBeLessThanOrEqual(9999);
    })
})
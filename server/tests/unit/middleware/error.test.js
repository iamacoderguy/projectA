const error = require('../../../middleware/error');
let winston;

describe('error middleware', () => {

    beforeEach(() => {
        winston = require('winston');
    });

    it('should write down the error using winston', () => {
        // arrange
        const errMsg = 'test err message';
        const err = new Error(errMsg);
        const req = null;
        const res = {};
        const next = null;

        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        winston.error = jest.fn();

        // act
        error(err, req, res, next);

        // assert
        expect(winston.error).toHaveBeenCalledWith(errMsg, err);
    });

    it('should return code 500 with a friendly error message', () => {
        // arrange
        const errMsg = 'test err message';
        const err = new Error(errMsg);
        const req = null;
        const res = {};
        const next = null;

        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        winston.error = jest.fn();

        // act
        error(err, req, res, next);

        // assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(expect.stringMatching(/something failed/i));
    });
});
const util = require('util');
const Promise = require('promise');
const path = require('path');

function statExisted() {
    return Promise.resolve();
}

function statNotExisted() {
    return Promise.reject({ code: 'ENOENT' });
}

const dpath = 'path-to-shared-folder';
const notExistedFile = 'file not existed';
const existedFile = 'file existed';
const existedPath = path.join(dpath, existedFile);
const existedPath_1 = existedPath + '_1';
const existedPath_2 = existedPath + '_2';

describe('getAvailableName', () => {
    afterEach(() => jest.resetModules());

    it('should return the same fname if file is not existed', async () => {
        // arrange
        util.promisify = jest.fn(() => {
            // faking statPromise so that anyPath is not existed...
            return () => statNotExisted();
        })

        const { getAvailableName } = require('../../../helpers/sharedFileHelper');

        // act
        const newName = await getAvailableName(notExistedFile, dpath);

        // assert
        expect(newName).toBe(notExistedFile);
    })

    it('should return the fname + _1 if file is existed', async () => {
        // arrange
        util.promisify = jest.fn(() => {
            // faking statPromise so that file is existed...
            return (pathToStat) => {
                if (pathToStat === existedPath) {
                    return statExisted();
                }

                return statNotExisted();
            };
        })

        const { getAvailableName } = require('../../../helpers/sharedFileHelper');

        // act
        const newName = await getAvailableName(existedFile, dpath);

        // assert
        expect(newName).toBe(existedFile + '_1');
    })

    it('should return the fname + _2 if file and file_1 are existed', async () => {
        // arrange
        util.promisify = jest.fn(() => {
            // faking statPromise so that file and file_1 is existed...
            return (pathToStat) => {
                if (pathToStat === existedPath || pathToStat === existedPath_1) {
                    return statExisted();
                }

                return statNotExisted();
            };
        })

        const { getAvailableName } = require('../../../helpers/sharedFileHelper');

        // act
        const newName = await getAvailableName(existedFile, dpath);

        // assert
        expect(newName).toBe(existedFile + '_2');
    })

    it('should return the fname + _3 if file, file_1 and file_2 are existed', async () => {
        // arrange
        util.promisify = jest.fn(() => {
            // faking statPromise so that file, file_1 and file_2 is existed...
            return (pathToStat) => {
                if (pathToStat === existedPath || pathToStat === existedPath_1 || pathToStat === existedPath_2) {
                    return statExisted();
                }

                return statNotExisted();
            };
        })

        const { getAvailableName } = require('../../../helpers/sharedFileHelper');

        // act
        const newName = await getAvailableName(existedFile, dpath);

        // assert
        expect(newName).toBe(existedFile + '_3');
    })
})
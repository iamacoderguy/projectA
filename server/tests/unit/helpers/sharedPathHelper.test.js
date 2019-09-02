const { setSharedPath, getSharedPath } = require('../../../helpers/sharedPathHelper');
const each = require('jest-each').default;

describe('setSharedPath', () => {
    each([[''], ['path/to/file'], ['../path/to/file']]).it('should set \'%s\' to the sharedPath', (path) => {
        // arrange
        const newSetSharedPath = require('../../../helpers/sharedPathHelper').setSharedPath;

        // act
        newSetSharedPath(path);

        // assert
        const theSharedPath = getSharedPath();
        expect(theSharedPath).toBe(path);
    })
})

describe('getSharedPath', () => {
    each([[''], ['path/to/file'], ['../path/to/file']]).it('should return the sharedPath in case path=\'%s\'', (path) => {
        // arrange
        setSharedPath(path);
        const newGetSharedPath = require('../../../helpers/sharedPathHelper').getSharedPath;

        // act
        const theSharedPath = newGetSharedPath();

        // assert
        expect(theSharedPath).toBe(path);
    })
})
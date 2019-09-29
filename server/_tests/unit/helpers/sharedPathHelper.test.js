const each = require('jest-each').default;
let setSharedPath, getSharedPath;

describe('sharedPathHelper', () => {
    beforeEach(() => {
        const sharedPathHelper = require('../../../helpers/sharedPathHelper');
        setSharedPath = sharedPathHelper.setSharedPath;
        getSharedPath = sharedPathHelper.getSharedPath;
    });
    afterEach(() => jest.resetModules());

    describe('setSharedPath', () => {
        each([[''], ['path/to/file'], ['../path/to/file']]).it('should set \'%s\' to the sharedPath', (path) => {
            // act
            setSharedPath(path);
    
            // assert
            const theSharedPath = getSharedPath();
            expect(theSharedPath).toBe(path);
        })
    })

    describe('getSharedPath', () => {
        each([[''], ['path/to/file'], ['../path/to/file']]).it('should return the sharedPath in case path=\'%s\'', (path) => {
            // arrange
            setSharedPath(path);
    
            // act
            const theSharedPath = getSharedPath();
    
            // assert
            expect(theSharedPath).toBe(path);
        })
    })
})
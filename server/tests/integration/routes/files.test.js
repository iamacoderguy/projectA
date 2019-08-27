const request = require('supertest');
const path = require('path');
const fs = require('fs');

const app = require('../../../startup/app');
const { setSharedPath } = require('../../../helpers/sharedPathHelper');

const endpoint = '/api/files';
const validSharedPath = path.resolve(path.join(__dirname, 'fakePublicFolder'));

describe(endpoint, () => {
    describe('GET /', () => {
        describe('if the shared path is set', () => {
            it('should return 200', async () => {
                // arrange
                setSharedPath(validSharedPath);

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(200);
            });

            it('should return the list of current shared files', async () => {
                // arrange
                setSharedPath(validSharedPath);

                const expectedFiles = [
                    'demo.docx',
                    'iso_8859-1.txt',
                    'SampleAudio_0.7mb.mp3',
                    'SampleDOCFile_5000kb.doc',
                    'SampleJPGImage_50kbmb.jpg',
                    'SamplePDFFile_5mb.pdf',
                    'SampleSVGImage_53kbmb.svg',
                    'SampleVideo_640x360_5mb.mp4',
                    'SampleZIPFile_10mbmb.zip',
                    'noExtensionFile',
                ]

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.body.length).toBe(expectedFiles.length);
                expectedFiles.forEach(expectedFile => {
                    expect(res.body.some(f => f === expectedFile)).toBeTruthy();
                });
            });
        });

        describe('if the shared path is not set', () => {
            it('should return 404', async () => {
                // arrange
                setSharedPath('');

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(404);
            });
        });
    });

    describe('GET /:filename', () => {
        beforeEach(() => { setSharedPath(validSharedPath); });

        it('should return 200 if valid filename is passed', async () => {
            // arrange
            let validFilename = 'demo.docx';

            // act
            const res = await request(app).get(endpoint + '/' + validFilename);

            // assert
            expect(res.status).toBe(200);
        });

        it('should return the file if valid filename is passed', async () => {
            // arrange
            let validFilename = 'SamplePDFFile_5mb.pdf';
            let expectedType = 'application/pdf';
            let expectedLength = fs.statSync(validSharedPath + '/' + validFilename)["size"];

            // act
            const res = await request(app).get(endpoint + '/' + validFilename);

            // assert
            expect(res.headers['content-type']).toBe(expectedType);
            expect(res.headers['content-length']).toBe(expectedLength.toString());
        });

        it('should return 404 if invalid filename is passed', async () => {
            // arrange
            let invalidFilename = 'abc';

            // act
            const res = await request(app).get(endpoint + '/' + invalidFilename);

            // assert
            expect(res.status).toBe(404);
        });
    })
});
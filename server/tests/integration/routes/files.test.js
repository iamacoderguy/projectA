const request = require('supertest');
const path = require('path');

const app = require('../../../startup/app');
const files = require('../../../routes/files');

const endpoint = '/api/files';

describe(endpoint, () => {
    describe('GET /', () => {
        describe('if the shared path is set', () => {
            it('should return 200', async () => {
                // arrange
                let sharedPath = path.resolve(path.join(__dirname, 'fakePublicFolder'));
                files.setSharedPath(sharedPath);

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(200);
            });

            it('should return the list of current shared files', async () => {
                // arrange
                let sharedPath = path.resolve(path.join(__dirname, 'fakePublicFolder'));
                files.setSharedPath(sharedPath);

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
                let sharedPath = '';
                files.setSharedPath(sharedPath);

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(404);
            });
        });
    })
});
const request = require('supertest');
const path = require('path');
const fs = require('fs');

const app = require('../../../startup/app');
const { setSharedPath, getSharedPath } = require('../../../helpers/sharedPathHelper');

const endpoint = '/api/files';
const validSharedPath = path.resolve(path.join(__dirname, 'fakePublicFolder'));

describe(endpoint, () => {
    describe('GET /', () => {
        describe('if the shared path is set', () => {
            beforeEach(() => { setSharedPath(validSharedPath); });
            afterEach(() => { setSharedPath(''); });

            it('should return 200', async () => {
                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(200);
            });

            it('should return the list of current shared files', async () => {
                // arrange
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
            beforeEach(() => { setSharedPath(''); });
            afterEach(() => { setSharedPath(''); });

            it('should return 404', async () => {
                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(404);
            });
        });
    });

    describe('GET /:filename', () => {
        beforeEach(() => { setSharedPath(validSharedPath); });
        afterEach(() => { setSharedPath(''); });

        async function getFile(fname) {
            const url = endpoint + '/' + fname;
            return await request(app).get(url);
        }

        it('should return 200 if valid filename is passed', async () => {
            // arrange
            const validFilename = 'demo.docx';

            // act
            const res = await getFile(validFilename);

            // assert
            expect(res.status).toBe(200);
        });

        it('should return the file if valid filename is passed', async () => {
            // arrange
            const validFilename = 'SamplePDFFile_5mb.pdf';
            const expectedType = 'application/pdf';
            const expectedLength = fs.statSync(validSharedPath + '/' + validFilename)["size"];

            // act
            const res = await getFile(validFilename);

            // assert
            expect(res.headers['content-type']).toBe(expectedType);
            expect(res.headers['content-length']).toBe(expectedLength.toString());
        });

        it('should return 404 if invalid filename is passed', async () => {
            // arrange
            const invalidFilename = 'abc';

            // act
            const res = await getFile(invalidFilename);

            // assert
            expect(res.status).toBe(404);
        });
    })

    describe('GET ?filename=', () => {
        async function getFile(fname) {
            const url = endpoint + '?filename=' + fname;
            return await request(app).get(url);
        }

        it('should return 302', async () => {
            // arrange
            const anyFileName = 'any-file-name';

            // act
            const res = await getFile(anyFileName);

            // assert
            expect(res.status).toBe(302);
        });

        it('should redirect to /:filename', async () => {
            // arrange
            const anyFileName = 'any-file-name';

            // act
            const res = await getFile(anyFileName);

            // assert
            expect(res.header['location']).toBe(endpoint + '/' + anyFileName);
            expect(res.text).toMatch(/redirect/i);
        });
    })

    describe('PUT /path', () => {
        it('should return 200 if input is valid', async () => {
            // arrange
            setSharedPath('');

            // act
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: validSharedPath });

            // assert
            expect(res.status).toBe(200);
        });

        it('should return the list of new shared files if input is valid', async () => {
            // arrange
            setSharedPath('');
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
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: validSharedPath });

            // assert
            expect(res.body.length).toBe(expectedFiles.length);
            expectedFiles.forEach(expectedFile => {
                expect(res.body.some(f => f === expectedFile)).toBeTruthy();
            });
        });

        it('should update the sharedPath if input is valid', async () => {
            // arrange
            setSharedPath('another-path');

            // act
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: validSharedPath });
            const actualPath = getSharedPath();

            // assert
            expect(actualPath).toBe(validSharedPath);
        });

        it('should return 404 if input is invalid', async () => {
            // arrange
            setSharedPath(validSharedPath);

            // act
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: 'invalid-path' });

            // assert
            expect(res.status).toBe(404);
        });
    })
});
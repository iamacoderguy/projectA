const each = require('jest-each').default;
const request = require('supertest');
const path = require('path');
const fs = require('fs');

const { promisify } = require('util');
const statPromise = promisify(fs.stat);
const unlinkPromise = promisify(fs.unlink);
const readdirPromise = promisify(fs.readdir);

const app = require('../../../startup/app');
const { setSharedPath, getSharedPath } = require('../../../helpers/sharedPathHelper');
const { tmpDirPath } = require('../../../helpers/sharedFileHelper');

const endpoint = '/api/files';
const validSharedPath = path.resolve(path.join(__dirname, 'fakePublicFolder'));
const sharedFiles = [
    'demo.docx',
    'fileExisted.mp3',
    'fileExisted_1.mp3',
    'iso_8859-1.txt',
    'SampleDOCFile_5000kb.doc',
    'SampleJPGImage_50kbmb.jpg',
    'SamplePDFFile_5mb.pdf',
    'SampleSVGImage_53kbmb.svg',
    'SampleVideo_640x360_5mb.mp4',
    'SampleZIPFile_10mbmb.zip',
    'noExtensionFile',
]

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
            })

            it('should return the list of current shared files', async () => {
                // arrange
                const expectedFiles = sharedFiles;

                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.body.length).toBe(expectedFiles.length);
                expectedFiles.forEach(expectedFile => {
                    expect(res.body.some(f => f === expectedFile)).toBeTruthy();
                })
            })
        })

        describe('if the shared path is not set', () => {
            beforeEach(() => { setSharedPath(''); });
            afterEach(() => { setSharedPath(''); });

            it('should return 404', async () => {
                // act
                const res = await request(app).get(endpoint);

                // assert
                expect(res.status).toBe(404);
            })
        })
    })

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
        })

        it('should return the file if valid filename is passed', async () => {
            // arrange
            const validFilename = 'SamplePDFFile_5mb.pdf';
            const expectedType = 'application/pdf';
            const expectedLength = fs.statSync(path.join(validSharedPath, validFilename))["size"];

            // act
            const res = await getFile(validFilename);

            // assert
            expect(res.headers['content-type']).toBe(expectedType);
            expect(res.headers['content-length']).toBe(expectedLength.toString());
        })

        it('should return 404 if invalid filename is passed', async () => {
            // arrange
            const invalidFilename = 'abc';

            // act
            const res = await getFile(invalidFilename);

            // assert
            expect(res.status).toBe(404);
        })
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
        })

        it('should redirect to /:filename', async () => {
            // arrange
            const anyFileName = 'any-file-name';

            // act
            const res = await getFile(anyFileName);

            // assert
            expect(res.header['location']).toBe(endpoint + '/' + anyFileName);
            expect(res.text).toMatch(/redirect/i);
        })
    })

    describe('POST /', () => {
        async function postFile(filename) {
            const filePath = path.join(__dirname, 'postFiles', filename);
            return await request(app).post(endpoint).attach('file', filePath);
        }

        const existedFile = 'fileExisted.mp3';
        const notExistedFile = 'fileNotExisted.mp4';

        function getNewName(fname) {
            if (fname === existedFile) return 'fileExisted_2.mp3'; // fileExisted_1.mp3 is existed, too
            if (fname === notExistedFile) return 'fileNotExisted.mp4';
            return fname;
        }

        describe('if the shared path is set', () => {
            beforeEach(() => { setSharedPath(validSharedPath); });
            afterEach(async () => {
                setSharedPath('');
                await unlinkPromise(path.join(validSharedPath, getNewName(existedFile))).catch(_ => {});
                await unlinkPromise(path.join(validSharedPath, getNewName(notExistedFile))).catch(_ => {});
            });

            each([[existedFile], [notExistedFile]]).it('should return 200 in case file=%s', async (filename) => {
                // act
                const res = await postFile(filename);

                // assert
                expect(res.status).toBe(200);
            })

            each([[existedFile], [notExistedFile]]).it('should return the filename in case file=%s', async (filename) => {
                // act
                const res = await postFile(filename);

                // assert
                expect(res.text).toBe(getNewName(filename));
            })

            it('should store the file if the file is not existed', async () => {
                // arrange
                const expectedNewFilePath = path.join(validSharedPath, getNewName(notExistedFile));
                
                // act
                await postFile(notExistedFile);

                // assert
                expect(statPromise(expectedNewFilePath)).resolves.toBeTruthy();
            })

            it('should store the file with a new name if the file is existed', async () => {
                // arrange
                const expectedNewFilePath = path.join(validSharedPath, getNewName(existedFile));
                
                // act
                await postFile(existedFile);

                // assert
                expect(statPromise(expectedNewFilePath)).resolves.toBeTruthy();
            })

            each([[existedFile], [notExistedFile]]).it('should remove the tmp file in case file=%s', async (fname) => {
                // act
                await postFile(fname);

                // assert
                const tmpFiles = await readdirPromise(tmpDirPath);
                expect(tmpFiles.length).toBe(0);
            })
        })

        describe('if the shared path is not set', () => {
            beforeEach(() => { setSharedPath(''); });
            afterEach(() => { setSharedPath(''); });

            each([[existedFile], [notExistedFile]]).it('should return 404 in case file=%s', async (fname) => {
                // act
                const res = await postFile(fname);

                // assert
                expect(res.status).toBe(404);
            })

            each([[existedFile], [notExistedFile]]).it('should remove the tmp file', async (fname) => {
                // act
                await postFile(fname);

                // assert
                const tmpFiles = await readdirPromise(tmpDirPath);
                expect(tmpFiles.length).toBe(0);
            })
        })
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
        })

        it('should return the list of new shared files if input is valid', async () => {
            // arrange
            setSharedPath('');
            const expectedFiles = sharedFiles;

            // act
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: validSharedPath });

            // assert
            expect(res.body.length).toBe(expectedFiles.length);
            expectedFiles.forEach(expectedFile => {
                expect(res.body.some(f => f === expectedFile)).toBeTruthy();
            })
        })

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
        })

        it('should return 404 if input is invalid', async () => {
            // arrange
            setSharedPath(validSharedPath);

            // act
            const res = await request(app)
                                .put(endpoint + '/path')
                                .send({ path: 'invalid-path' });

            // assert
            expect(res.status).toBe(404);
        })
    })
})
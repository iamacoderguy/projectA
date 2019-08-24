const request = require('supertest');
const endpoint = '/api/files';
let server;


describe(endpoint, () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(() => { server.close(); });
    
    describe('GET /', () => {
        describe('if the shared path is set', () => {
            it('should return 200', async () => {
                const res = await request(server).get(endpoint);
                expect(res.status).toBe(200);
            });
    
            it('should return the list of current shared files', async () => {
                const files = [
                    { filename: 'textFile.txt' },
                    { filename: 'videoFile.mp4' },
                    { filename: 'audioFile.mp3' },
                    { filename: 'pdfFile.pdf' },
                    { filename: 'wordFile.docx' },
                    { filename: 'imageFile.jpg' },
                    { filename: 'noExtensionFile' },
                ]
    
                const res = await request(server).get(endpoint);
                expect(res.body.length).toBe(files.length);

                files.forEach(expectedFile => {
                    expect(res.body.some(f => f.filename === expectedFile.filename)).toBeTruthy();
                });
            });
        });
    })
});
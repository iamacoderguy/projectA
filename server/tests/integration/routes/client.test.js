const request = require('supertest');
let app;

describe('/', () => {
    beforeEach(() => {
        app = require('../../../startup/app');
    });
    afterEach(() => jest.resetModules());

    describe('GET /', () => {

        describe('when client is on localhost', () => {
            it('should return 200', async () => {
                // arrange
                const networkHelper = require('../../../helpers/networkHelper');
                networkHelper.isFromLocalhost = jest.fn().mockReturnValue(true);
    
                // act
                const res = await request(app).get('/');
    
                // assert
                expect(res.status).toBe(200);
            })

            it('should render adminDashboardView correctly', async () => {
                // arrange
                const serverIpAddr = '192.168.5.1';
                const serverPort = 3000;
                const networkHelper = require('../../../helpers/networkHelper');
                networkHelper.getServerIpAddress = jest.fn().mockReturnValue(serverIpAddr);
                networkHelper.getServerPort = jest.fn().mockReturnValue(serverPort);
                networkHelper.isFromLocalhost = jest.fn().mockReturnValue(true);
    
                const sharedPath = 'path-to-files';
                const sharedPathHelper = require('../../../helpers/sharedPathHelper');
                sharedPathHelper.getSharedPath = jest.fn().mockReturnValue(sharedPath);
    
                const db_Clients = require('../../../models/db_Clients');
                const Client = require('../../../models/client');
                const client1 = new Client('111.222.333.444');
                const client2 = new Client('111.222.333.555');
                const client3 = new Client('111.222.333.666');
                client1.expCode = 0; client2.expCode = NaN; client3.expCode = 2;
                db_Clients.getClients = jest.fn().mockReturnValue([client1, client2, client3]);
    
                // act
                const res = await request(app).get('/');
    
                // assert
                expect(res.text).toMatchSnapshot();
            })
        })

        describe('when client is NOT on localhost', () => {
            it('should redirect to apidoc/index.html', async () => {
                // arrange
                const networkHelper = require('../../../helpers/networkHelper');
                networkHelper.isFromLocalhost = jest.fn().mockReturnValue(false);
    
                // act
                const res = await request(app).get('/');
    
                // assert
                expect(res.status).toBe(302);
                expect(res.header['location']).toBe('apidoc/index.html');
            })
        })
    })
})
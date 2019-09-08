const each = require('jest-each').default;
const request = require('supertest');
let app;

describe('/', () => {
    beforeEach(() => {
        app = require('../../../startup/app');
    });
    afterEach(() => jest.resetModules());

    describe('GET /', () => {

        describe('when client is on localhost', () => {
            each([['127.0.0.1'], ['::1']]).it('should return 200 in case request ip = %s', async (ipAddr) => {
                // act
                const res = await request(app).get('/').set('x-forwarded-for', ipAddr);
    
                // assert
                expect(res.status).toBe(200);
            })

            each([['127.0.0.1'], ['::1']]).it('should render adminDashboardView correctly in case request ip = %s', async (ipAddr) => {
                // arrange
                const serverIpAddr = '192.168.5.1';
                const serverPort = 3000;
                const networkHelper = require('../../../helpers/networkHelper');
                networkHelper.getServerIpAddress = jest.fn().mockReturnValue(serverIpAddr);
                networkHelper.getServerPort = jest.fn().mockReturnValue(serverPort);
    
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

                const pinHelper = require('../../../helpers/pinHelper');
                pinHelper.setPin('8694');
    
                // act
                const res = await request(app).get('/').set('x-forwarded-for', ipAddr);
    
                // assert
                expect(res.text).toMatchSnapshot();
            })
        })

        describe('when client is NOT on localhost', () => {
            each([
                ['requestIp is as same as serverIp', '192.168.5.1', '192.168.5.1'],
                ['requestIp is diff from serverIp', '192.168.5.1', '192.168.5.2']
            ]).it('should redirect to apidoc/index.html in case %s', async (_, serverIpAddr, clientIpAddr) => {
                // arrange
                const networkHelper = require('../../../helpers/networkHelper');
                networkHelper.getServerIpAddress = jest.fn().mockReturnValue(serverIpAddr);
    
                // act
                const res = await request(app).get('/').set('x-forwarded-for', clientIpAddr);
    
                // assert
                expect(res.status).toBe(302);
                expect(res.header['location']).toBe('apidoc/index.html');
            })
        })
    })
})
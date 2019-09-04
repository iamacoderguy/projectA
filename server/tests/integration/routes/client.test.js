const each = require('jest-each').default;
const request = require('supertest');
let app;

describe('/', () => {
    beforeEach(() => {
        app = require('../../../startup/app');
    });
    afterEach(() => jest.resetModules());

    describe('GET /', () => {
        each([['client is on localhost', true], ['client is NOT on localhost', false]]).it('should return 200 in case %s', async (_, casevalue) => {
            // arrange
            const networkHelper = require('../../../helpers/networkHelper');
            networkHelper.isFromLocalhost = jest.fn().mockReturnValue(casevalue);

            // act
            const res = await request(app).get('/');

            // assert
            expect(res.status).toBe(200);
        })

        each([['client is on localhost', true], ['client is NOT on localhost', false]]).it('should render adminDashboardView correctly in case %s', async (_, casevalue) => {
            // arrange
            const serverIpAddr = '192.168.5.1';
            const serverPort = 3000;
            const networkHelper = require('../../../helpers/networkHelper');
            networkHelper.getServerIpAddress = jest.fn().mockReturnValue(serverIpAddr);
            networkHelper.getServerPort = jest.fn().mockReturnValue(serverPort);
            networkHelper.isFromLocalhost = jest.fn().mockReturnValue(casevalue);

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
})
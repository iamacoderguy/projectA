const each = require('jest-each').default;
const db_Clients = require('../../../models/db_Clients');
const Client = require('../../../models/client');

describe('db_Clients', () => {
    afterEach(() => {
        db_Clients.reset();
    })

    each([['::ffff:192.168.1.169'], ['::1'], ['::ffff:127.0.0.1']])
        .describe('getOrNewClientIfNotExisted', (ipAddr) => {
            it(`should create a new client in DB if the client is not existed in case ipAddr = ${ipAddr}`, () => {
                // arrange
                db_Clients.reset();

                // act
                db_Clients.getOrNewClientIfNotExisted(ipAddr);

                // assert
                const expectedClient = db_Clients.getClient(ipAddr);
                expect(expectedClient).toBeTruthy();
            })

            it(`should return a new client from DB if the client is not existed in case ipAddr = ${ipAddr}`, () => {
                // act
                const returnClient = db_Clients.getOrNewClientIfNotExisted(ipAddr);

                // assert
                const dbClient = db_Clients.getClient(ipAddr);
                expect(returnClient).toBeTruthy();
                expect(returnClient).toBe(dbClient);
            })

            it(`should return the client from DB if it is existed in case ipAddr = ${ipAddr}`, () => {
                // arrange
                const client = new Client(ipAddr);
                const clients = [];
                clients[client.id] = client;
                db_Clients.initialize(clients);

                const beforeClient = db_Clients.getClient(ipAddr);

                // act
                const returnClient = db_Clients.getOrNewClientIfNotExisted(ipAddr);

                // assert
                const afterClient = db_Clients.getClient(ipAddr);
                expect(beforeClient).toBe(client);

                expect(beforeClient).toBe(returnClient);
                expect(returnClient).toBe(afterClient);
            })
        })
})
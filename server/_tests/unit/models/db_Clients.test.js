const each = require('jest-each').default;
const db_Clients = require('../../../models/db_Clients');

describe('db_Clients', () => {
    afterEach(() => {
        db_Clients.reset();
    })

    each([['::ffff:192.168.1.169'], ['::1'], ['::ffff:127.0.0.1']]).describe('newClient', (ipAddr) => {
        it(`should create a new client and return it in case ipAddr = ${ipAddr}`, () => {
            // act
            const client = db_Clients.newClient(ipAddr);
    
            // assert
            expect(client).toBeTruthy();
        })
    
        it(`should store the client in case ipAddr = ${ipAddr}`, () => {
            // act
            db_Clients.newClient(ipAddr);
    
            // assert
            const client = db_Clients.getClient(ipAddr);
            expect(client).toBeTruthy();
        })
    })

    each([['::ffff:192.168.1.169'], ['::1'], ['::ffff:127.0.0.1']]).describe('getOrNewClientIfNotExisted', (ipAddr) => {
        it(`should return the client if it is existed in case ipAddr = ${ipAddr}`, () => {
            // arrange
            db_Clients.newClient(ipAddr);

            // act
            const client = db_Clients.getOrNewClientIfNotExisted(ipAddr);

            // assert
            expect(client).toBeTruthy();
        })

        it(`should create a new client and return it if the client is not existed in case ipAddr = ${ipAddr}`, () => {
            // act
            const client = db_Clients.getOrNewClientIfNotExisted(ipAddr);

            // assert
            const getClient = db_Clients.getClient(ipAddr);
            expect(client).toBeTruthy();
            expect(getClient).toBeTruthy();
        })
    })
})
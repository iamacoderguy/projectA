const os = require('os');
const { getIpAddress } = require('../../../helpers/networkHelper');

describe('getIpAddress', () => {
    it('should return the first external IPv4 address', () => {
        // arrange
        const expectedAddress = '192.168.6.244';
        os.networkInterfaces = jest.fn(() => {
            return { 'Wi-Fi 3':
            [ { address: 'fe80::3cb8:d8da:db0c:8294',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: 'd4:6e:0e:03:00:58',
                scopeid: 12,
                internal: false,
                cidr: 'fe80::3cb8:d8da:db0c:8294/64' },
              { address: expectedAddress,
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: 'd4:6e:0e:03:00:58',
                internal: false,
                cidr: '192.168.6.244/24' } ],
           Ethernet:
            [ { address: 'fe80::e1c6:cdd:79a7:ba49',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: '18:03:73:5f:ac:40',
                scopeid: 4,
                internal: false,
                cidr: 'fe80::e1c6:cdd:79a7:ba49/64' },
              { address: '192.168.6.176',
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: '18:03:73:5f:ac:40',
                internal: false,
                cidr: '192.168.6.176/24' } ],
           'Loopback Pseudo-Interface 1':
            [ { address: '::1',
                netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
                family: 'IPv6',
                mac: '00:00:00:00:00:00',
                scopeid: 0,
                internal: true,
                cidr: '::1/128' },
              { address: '127.0.0.1',
                netmask: '255.0.0.0',
                family: 'IPv4',
                mac: '00:00:00:00:00:00',
                internal: true,
                cidr: '127.0.0.1/8' } ] };
        });

        // act
        const actualAddress = getIpAddress();

        // assert
        expect(actualAddress).toBe(expectedAddress);
    })
})
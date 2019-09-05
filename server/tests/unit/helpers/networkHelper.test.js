const each = require('jest-each').default;
const os = require('os');
const { getServerIpAddress, isFromLocalhost } = require('../../../helpers/networkHelper');

describe('getIpAddress', () => {
    it('should return the first external IPv4 address if there is no Ethernet', () => {
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
                cidr: expectedAddress + '/24' } ],
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
        const actualAddress = getServerIpAddress();

        // assert
        expect(actualAddress).toBe(expectedAddress);
    })

    it('should return the first external Ethernet IPv4 address if any', () => {
        // arrange
        const expectedAddress = '192.168.6.244';
        os.networkInterfaces = jest.fn(() => {
            return { 'vEthernet (nat)': 
            [ { address: 'fe80::2c84:5c8a:d309:fcd8',  
                netmask: 'ffff:ffff:ffff:ffff::',      
                family: 'IPv6',
                mac: '00:15:5d:99:54:01',
                scopeid: 33,
                internal: false,
                cidr: 'fe80::2c84:5c8a:d309:fcd8/64' },
              { address: '172.27.0.1',
                netmask: '255.255.240.0',
                family: 'IPv4',
                mac: '00:15:5d:99:54:01',
                internal: false,
                cidr: '172.27.0.1/20' } ],
           Ethernet:
            [ { address: 'fe80::88d8:4c89:84a3:7b85',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: 'd8:9e:f3:38:8e:a5',
                scopeid: 16,
                internal: false,
                cidr: 'fe80::88d8:4c89:84a3:7b85/64' },
              { address: expectedAddress,
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: 'd8:9e:f3:38:8e:a5',
                internal: false,
                cidr: expectedAddress + '/24' } ],
           'VMware Network Adapter VMnet1':
            [ { address: 'fe80::f5c3:2971:1e2c:b2c9',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: '00:50:56:c0:00:01',
                scopeid: 18,
                internal: false,
                cidr: 'fe80::f5c3:2971:1e2c:b2c9/64' },
              { address: '192.168.146.1',
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: '00:50:56:c0:00:01',
                internal: false,
                cidr: '192.168.146.1/24' } ],
           'VMware Network Adapter VMnet8':
            [ { address: 'fe80::5142:c41c:6427:ae84',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: '00:50:56:c0:00:08',
                scopeid: 31,
                internal: false,
                cidr: 'fe80::5142:c41c:6427:ae84/64' },
              { address: '192.168.228.1',
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: '00:50:56:c0:00:08',
                internal: false,
                cidr: '192.168.228.1/24' } ],
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
        const actualAddress = getServerIpAddress();

        // assert
        expect(actualAddress).toBe(expectedAddress);
    })
})

describe('isFromLocalhost', () => {
    each([['127.0.0.1'], ['::1'], ['::127.0.0.1'], ['::ffff:127.0.0.1']]).it('should return true when ipAddr = %s', (ipAddr) => {
        // act
        const result = isFromLocalhost(ipAddr);

        // assert
        expect(result).toBe(true);
    })

    each([['192.168.7.2'], [''], [':192:125.0.0.1'], ['::ffff:157.0.0.1']]).it('should return false when ipAddr = %s', (ipAddr) => {
        // act
        const result = isFromLocalhost(ipAddr);

        // assert
        expect(result).toBe(false);
    })
})
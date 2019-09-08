
const each = require('jest-each').default;
const pug = require('pug');
const renderPug = (view, data) => pug.renderFile(view, data);
const Client = require('../../../models/client');

describe('adminDashboardView', () => {
    const client1 = {};
    client1.getIpAddr = () => '111.222.333.444';
    client1.getStatus = () => 'status1';

    const client2 = {};
    client2.getIpAddr = () => '111.222.333.555';
    client2.getStatus = () => 'status2';

    const client3 = {};
    client3.getIpAddr = () => '111.222.333.666';
    client3.getStatus = () => 'status3';

    each([
        [[client1, client2, client3]],
        [[]]
    ]).it('should render adminDashboardView correctly in case %o', (clients) => {
        expect(renderPug('views/adminDashboardView.pug', {
            path: 'path-to-files',
            dashboardName: 'Dashboard',
            ipAddress: '192.168.1.1',
            port: 5000,
            clients: clients,
            pin: 123456
          })).toMatchSnapshot();
    })
})
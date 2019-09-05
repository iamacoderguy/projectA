
const each = require('jest-each').default;
const pug = require('pug');
const renderPug = (view, data) => pug.renderFile(view, data);
const Client = require('../../../models/client');

describe('adminDashboardView', () => {
    const client1 = new Client('111.222.333.444');
    const client2 = new Client('111.222.333.555');
    const client3 = new Client('111.222.333.666');
    client1.expCode = 0; client2.expCode = NaN; client3.expCode = 2;

    each([
        [[client1, client2, client3]],
        [[]]
    ]).it('should render adminDashboardView correctly in case %o', (clients) => {
        expect(renderPug('views/adminDashboardView.pug', {
            path: 'path-to-files',
            dashboardName: 'dashboard-name',
            ipAddress: 'ip-address',
            port: 5000,
            clients: clients
          })).toMatchSnapshot();
    })
})
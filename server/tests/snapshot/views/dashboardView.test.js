
const each = require('jest-each').default;
const pug = require('pug');
const renderPug = (view, data) => pug.renderFile(view, data);
const Client = require('../../../models/client');
const db_ExpCodes = require('../models/db_ExpCodes');

describe('views/dashboardView', () => {
    const client1 = new Client('111.222.333.444');
    const client2 = new Client('111.222.333.555');
    const client3 = new Client('111.222.333.666');

    db_ExpCodes.setExpCode(client1);

    each([
        [[client1, client2, client3]],
        [[]]
    ]).it('should render dashboardView correctly in case %o', (clients) => {
        expect(renderPug('views/dashboardView.pug', {
            path: 'path-to-files',
            dashboardName: 'dashboard-name',
            ipAddress: 'ip-address',
            port: 5000,
            clients: clients
          })).toMatchSnapshot();
    })
})

describe('views/apiDashboardView', () => {
    it('should render apiDashboardView correctly', () => {
        expect(renderPug('views/apiDashboardView.pug', {
            path: 'path-to-files',
            dashboardName: 'dashboard-name',
            ipAddress: 'ip-address',
            port: 5000
          })).toMatchSnapshot();
    })
})
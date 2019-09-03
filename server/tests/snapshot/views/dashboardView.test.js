
const each = require('jest-each').default;
const pug = require('pug');
const renderPug = (view, data) => pug.renderFile(view, data);

describe('views/dashboardView', () => {
    each([
        [[
            { ip: '111.222.333.444', status: 'connected' },
            { ip: '111.222.333.555', status: 'expired' },
            { ip: '111.222.333.666', status: 'disconnected' }
        ]],
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
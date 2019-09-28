const pug = require('pug');
const renderPug = (view, data) => pug.renderFile(view, data);

describe('apiDashboardView', () => {
    it('should render apiDashboardView correctly', () => {
        expect(renderPug('views/apiDashboardView.pug', {
            path: 'path-to-files',
            dashboardName: 'Dashboard',
            ipAddress: '127.3.2.1',
            port: 5000
          })).toMatchSnapshot();
    })
})
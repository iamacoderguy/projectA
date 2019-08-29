
const pug = require('pug');
const renderPug = data => pug.renderFile('views/dashboardView.pug', data);

describe('views/dashboardView', () => {
    it('should render dashboardView correctly', () => {
        expect(renderPug({
            path: 'path-to-files',
            dashboardName: 'dashboard-name'
          })).toMatchSnapshot();
    });
});
const render = require('../../../controllers/render');
const sharedPathHelper = require('../../../helpers/sharedPathHelper');
const networkHelper = require('../../../helpers/networkHelper');
const clientHelper = require('../../../helpers/clientHelper');

describe('controllers/render', () => {
    describe('renderDashboard', () => {
        it('should render dashboardView with correct parameters', () => {
            // arrage
            const req = null;
            const res = {};
            res.render = jest.fn().mockReturnValue(res);
            sharedPathHelper.getSharedPath = jest.fn().mockReturnValue('path-to-files');
            networkHelper.getIpAddress = jest.fn().mockReturnValue('ip-address');
            networkHelper.getPort = jest.fn().mockReturnValue(7554);
            clientHelper.getClients = jest.fn().mockReturnValue([
                { ip: '111.222.333.444', status: 'connected' },
                { ip: '111.222.333.555', status: 'expired' },
                { ip: '111.222.333.666', status: 'disconnected' }
            ]);

            // act
            render.renderDashboard(req, res);

            // assert
            expect(res.render).toHaveBeenCalledWith(
                'dashboardView',
                expect.objectContaining({
                    path: 'path-to-files',
                    dashboardName: expect.stringMatching(/dashboard/i),
                    ipAddress: 'ip-address',
                    port: 7554,
                    clients: [
                        { ip: '111.222.333.444', status: 'connected' },
                        { ip: '111.222.333.555', status: 'expired' },
                        { ip: '111.222.333.666', status: 'disconnected' }
                    ]
                }));
        })
    })

    describe('renderAPIDashboard', () => {
        it('should render apiDashboardView with correct parameters', () => {
            // arrage
            const req = null;
            const res = {};
            res.render = jest.fn().mockReturnValue(res);
            sharedPathHelper.getSharedPath = jest.fn().mockReturnValue('path-to-files');
            networkHelper.getIpAddress = jest.fn().mockReturnValue('ip-address');
            networkHelper.getPort = jest.fn().mockReturnValue(7554);

            // act
            render.renderAPIDashboard(req, res);

            // assert
            expect(res.render).toHaveBeenCalledWith(
                'apiDashboardView',
                expect.objectContaining({
                    path: 'path-to-files',
                    dashboardName: expect.stringMatching(/dashboard/i),
                    ipAddress: 'ip-address',
                    port: 7554
                }));
        })
    })
})
const request = require('supertest');
const app = require('../../../startup/app');

const render = require('../../../controllers/render');
const renderDashboardOri = render.renderDashboard;
const pug = require('pug');

const { getSharedPath } = require('../../../helpers/sharedPathHelper');
const { getIpAddress, getPort } = require('../../../helpers/networkHelper');

describe('/', () => {
    beforeEach(() => {
        render.renderDashboard = renderDashboardOri;
    });

    describe('GET /', () => {
        it('should return 200', async () => {
            // act
            const res = await request(app).get('/');

            // assert
            expect(res.status).toBe(200);
        });

        it('should trigger renderDashboard', async () => {
            // arrange
            render.renderDashboard = jest.fn((req, res) => {
                res.send();
            })

            // act
            await request(app).get('/');

            // assert
            expect(render.renderDashboard).toHaveBeenCalled();
        });

        it('should render dashboardView correctly', async () => {
            // arrange
            const renderPug = data => pug.renderFile('views/dashboardView.pug', data);
            const expectedDashboardView = renderPug({
                path: "",
                dashboardName: 'Server-A Dashboard',
                ipAddress: getIpAddress(),
                port: getPort()
            });

            // act
            const res = await request(app).get('/');

            // assert
            expect(res.text).toBe(expectedDashboardView);
        });
    });
});
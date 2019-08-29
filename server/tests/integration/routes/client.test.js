const request = require('supertest');
const app = require('../../../startup/app');

const render = require('../../../controllers/render');
const renderDashboardOri = render.renderDashboard;

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
                console.log('faking renderDashboard...');
                res.send();
            })

            // act
            await request(app).get('/');

            // assert
            expect(render.renderDashboard).toHaveBeenCalled();
        });
    });
});
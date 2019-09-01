const render = require('../../../controllers/render');
const sharedPathHelper = require('../../../helpers/sharedPathHelper');

describe('controllers/render', () => {
    describe('renderDashboard', () => {
        it('should render dashboardView with correct parameters', () => {
            // arrage
            const req = null;
            const res = {};
            res.render = jest.fn().mockReturnValue(res);
            sharedPathHelper.getSharedPath = jest.fn().mockReturnValue('path-to-files');

            // act
            render.renderDashboard(req, res);

            // assert
            expect(res.render).toHaveBeenCalledWith(
                expect.stringContaining('dashboard'),
                expect.objectContaining({
                    path: 'path-to-files',
                    dashboardName: expect.stringMatching(/dashboard/i)
                }));
        })
    })
})
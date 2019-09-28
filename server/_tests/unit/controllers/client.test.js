const clientController = require('../../../controllers/client');
const networkHelper = require('../../../helpers/networkHelper');
const db_Clients = require('../../../models/db_Clients');
const render = require('../../../controllers/render');

describe('gotoDashboard', () => {
    it('should ask Express res to redirect to apidoc/index.html when the client is not admin', () => {
        // arrange
        const req = {};
        const res = {};
        res.redirect = jest.fn();

        networkHelper.getIpAddressFromReq = jest.fn();

        const client = {}; client.isAdmin = false;
        db_Clients.getOrNewClientIfNotExisted = jest.fn().mockReturnValue(client);

        // act
        clientController.gotoDashboard(req, res);

        // assert
        expect(res.redirect).toHaveBeenCalledWith("apidoc/index.html");
    })

    it('should ask render controller to render admin dashboard when the client is admin', () => {
        // arrange
        const req = {};
        const res = {};
        render.renderAdminDashboard = jest.fn();

        networkHelper.getIpAddressFromReq = jest.fn();

        const client = {}; client.isAdmin = true;
        db_Clients.getOrNewClientIfNotExisted = jest.fn().mockReturnValue(client);

        // act
        clientController.gotoDashboard(req, res);

        // assert
        expect(render.renderAdminDashboard).toHaveBeenCalled();
    })
})
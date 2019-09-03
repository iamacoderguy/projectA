const request = require('supertest');
let app, render;

describe('/', () => {
    beforeEach(() => {
        app = require('../../../startup/app');
        render = require('../../../controllers/render');
    });
    afterEach(() => jest.resetModules());

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
            const sharedPathHelper = require('../../../helpers/sharedPathHelper');
            const networkHelper = require('../../../helpers/networkHelper');
            const db_Clients = require('../../../models/db_Clients');
            sharedPathHelper.getSharedPath = jest.fn().mockReturnValue('path-to-files');
            networkHelper.getIpAddress = jest.fn().mockReturnValue('192.168.5.1');
            networkHelper.getPort = jest.fn().mockReturnValue(3000);

            const Client = require('../../../models/client');
            const client1 = new Client('111.222.333.444');
            const client2 = new Client('111.222.333.555');
            const client3 = new Client('111.222.333.666');
            client1.expCode = 0; client2.expCode = NaN; client3.expCode = 2;
            db_Clients.getClients = jest.fn().mockReturnValue([client1, client2, client3]);

            const expectedDashboardView = '<!DOCTYPE html><html lang="en-US"><head><title>Server-A Dashboard</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="Server-A Dashboard"><link rel="stylesheet" href="w3.css"></head><body><div class="w3-container"><div class="w3-container w3-dark-teal"><h2>Server-A Dashboard - 192.168.5.1:3000</h2></div><p><iframe width="100%" height="200vw" title="Result box" srcdoc="&lt;i&gt;Result...&lt;/i&gt;" name="iframe_result"></iframe></p><form class="w3-container" method="POST" action="/api/files/path?_method=PUT" target="iframe_result"><p><label class="w3-text-dark-teal" for="sharedPathInput"><b>Set a new shared path (/api/files/path)</b></label><input class="w3-input w3-border w3-round" id="sharedPathInput" name="path" type="text" placeholder="path-to-files" value="path-to-files"></p><p><button class="w3-btn w3-dark-teal" type="submit">PUT</button></p></form><ul class="w3-ul"><li><h2>List of clients:</h2></li><li class="w3-bar"><div class="w3-bar-item">111.222.333.444: connected</div></li><li class="w3-bar"><div class="w3-bar-item">111.222.333.555: disconnected</div></li><li class="w3-bar"><div class="w3-bar-item">111.222.333.666: connected</div></li></ul></div></body></html>';

            // act
            const res = await request(app).get('/');

            // assert
            expect(res.text).toBe(expectedDashboardView);
        });
    });
});
// this module one can be replaced by a db
const Client = require('./client');
let clients = [];

module.exports.getOrNewClientIfNotExisted = function(ipAddr) {
    var client = new Client(ipAddr);

    if (!clients[client.id]) {
        clients[client.id] = client;
    }

    return clients[client.id];
}

module.exports.getClient = function (ipAddr) {
    var client = new Client(ipAddr);

    return clients[client.id];
}

module.exports.getClients = function () {
    return Object.values(clients);
}

module.exports.reset = function () {
    clients = [];
}

module.exports.initialize = function (initClients) {
    clients = initClients;
}
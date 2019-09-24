// this module one can be replaced by a db
const Client = require('./client');
let clients = [];

module.exports.getOrNewClientIfNotExisted = function(ipAddr) {
    var client = this.getClient(ipAddr);

    if (!client) {
        client = this.newClient(ipAddr);
    }

    return client;
}

module.exports.getClient = function (ipAddr) {
    var client = new Client(ipAddr);

    return clients[client.id];
}

module.exports.newClient = function (ipAddr) {
    var client = new Client(ipAddr);

    clients[client.id] = client;

    return clients[client.id];
}

module.exports.getClients = function () {
    return Object.values(clients);
}

module.exports.reset = function () {
    clients = [];
}
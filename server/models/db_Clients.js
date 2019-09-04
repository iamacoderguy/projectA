// this module one can be replaced by a db
const Client = require('./client');
const clients = [];

module.exports.getClient = function(ipAddr) {
    const client = new Client(ipAddr);
    
    if (!clients[client.id]) {
        clients[client.id] = client;
    }

    return clients[client.id];
}

module.exports.getClients = function() {
    return Object.values(clients);
}
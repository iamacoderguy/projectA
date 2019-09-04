const db_Clients = require('../models/db_Clients');

module.exports.verify = function(ipAddr, token) {
    const client = db_Clients.getClient(ipAddr);
    const err = client.verifyToken(token);
    
    return err;
}
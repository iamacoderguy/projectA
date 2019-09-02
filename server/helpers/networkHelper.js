const os = require('os');

module.exports.getIpAddress = function() {
    let interfaces = os.networkInterfaces();
    let addresses = [];

    for (var k in interfaces) {
        let network = interfaces[k];
        network.forEach(ip => {
            if (ip.family === 'IPv4' && !ip.internal) {
                addresses.push(ip.address);
            }
        })
    }

    return addresses[0];
}

module.exports.getPort = function() {
    return process.env.PORT || 3000;
}
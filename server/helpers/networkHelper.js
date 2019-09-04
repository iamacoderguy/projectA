const os = require('os');

module.exports.getServerIpAddress = function () {
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

module.exports.getServerPort = function () {
    return process.env.PORT || 3000;
}

module.exports.isFromLocalhost = function (ipAddr) {
    return ipAddr.indexOf('127.0.0.1') !== -1 || ipAddr.indexOf('::1') !== -1;
}

module.exports.getIpAddressFromReq = function (req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
module.exports.getClients = function() {
    return [
        { ip: '111.222.333.444', status: 'connected' },
        { ip: '111.222.333.555', status: 'expired' },
        { ip: '111.222.333.666', status: 'disconnected' }
    ]
}
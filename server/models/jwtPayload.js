function JWTPayload(client, expCode) {
    this.client = client;
    this.expCode = expCode;
}

module.exports = JWTPayload;
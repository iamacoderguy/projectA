let pin = 0;

module.exports.getPin = function () {
    return pin;
}

module.exports.setPin = function (newPin) {
    pin = newPin;
}

module.exports.initializeARandomPin = function () {
    pin = Math.floor(1000 + Math.random() * 9000);
}
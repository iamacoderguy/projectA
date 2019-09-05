let pin = '';

module.exports.getPin = function () {
    return pin;
}

module.exports.setPin = function (newPin) {
    pin = newPin;
}
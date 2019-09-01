let sharedPath = '';

module.exports.setSharedPath = (path) => {
    sharedPath = path;
}

module.exports.getSharedPath = () => {
    return sharedPath;
}
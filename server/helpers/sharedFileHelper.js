const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const statPromise = promisify(fs.stat);

async function isAvailable(fname, dpath) {
    const fpath = path.join(dpath, fname);

    try {
        await statPromise(fpath);
        return Promise.reject( {code: 'Existed'} );
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return Promise.resolve(fname);
        }
        return Promise.reject(err);
    }
}

module.exports.getAvailableName = async function(fname, dpath) {
    let count = 0;
    const ename = path.extname(fname);
    const bname = path.basename(fname, ename);

    while (true) {
        try {
            await isAvailable(fname, dpath);
            return Promise.resolve(fname);
        }
        catch (err) {
            if (err.code === 'Existed') {
                count = count + 1;
                fname = bname + '_' + count + ename;
                continue;
            }
            return Promise.reject(err);
        }
    }
}

module.exports.tmpDirName = '_tmp';
module.exports.tmpDirPath = path.join(__dirname, '../_tmp');
const crypto = require('crypto');

const createHash = (...inputValues) => {
    const hash = crypto.createHash("sha256");
    hash.update(inputValues.sort().join(''));
    return hash.digest('hex');
}
module.exports = { createHash };
const bcrypt = require("bcrypt");

const verifyHash = async (unhashed, hash) => {
    const result = bcrypt.compare(unhashed, hash);
    return result;
}

module.exports = verifyHash;
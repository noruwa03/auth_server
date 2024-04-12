const bcrypt = require("bcrypt");

const createHash = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const result = await bcrypt.hash(password, salt);
  return result;
};

module.exports = createHash;

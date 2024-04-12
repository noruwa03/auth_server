const jwt = require("jsonwebtoken");
require("dotenv").config();

const { TOKEN, EXPIRESIN } = process.env;

const createToken = async (data, token = TOKEN, expiresIn = EXPIRESIN) => {
  const result = jwt.sign(data, token, { expiresIn });
  return result;
};

module.exports = createToken;

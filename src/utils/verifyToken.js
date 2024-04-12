const jwt = require("jsonwebtoken");
require("dotenv").config();

const { TOKEN } = process.env;

const verifyToken = async (token) => {
  const check = jwt.verify(token, TOKEN, (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return "Token has expired";
      } else {
        return "Invalid Token";
      }
    } else {
      return decode;
    }
  });

  return check;
};

module.exports = verifyToken;

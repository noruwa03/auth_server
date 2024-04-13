const pool = require("../db");
const verifyToken = require("../utils/verifyToken");

const getUsers = async (req, res) => {
  try {
    const cookieObject = req.cookies;
    if (
      cookieObject !== null &&
      typeof cookieObject === "object" &&
      Object.keys(cookieObject).length > 0
    ) {
      const token = cookieObject.userData.token;
      const check = await verifyToken(token);

      if (check === "Token has expired") {
        return res.status(400).json({ error: check });
      } else if (check === "Invalid Token") {
        return res.status(400).json({ error: check });
      } else {
        const users = await pool.query("SELECT * FROM users");
        return res.status(200).json({ data: users.rows });
      }
    } else {
      // Nothing in cookie object

      return res.status(400).json({ error: "Invalid Token" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = getUsers;

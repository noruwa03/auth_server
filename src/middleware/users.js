const pool = require("../db");
const verifyToken = require("../utils/verifyToken");

const getUsers = async (req, res) => {
  try {
    const token = req.headers.cookie?.split("=")[1];
    const check = await verifyToken(token);
    console.log(token);

    if (check === "Token has expired") {
      return res.status(400).json({ error: check });
    } else if (check === "Invalid Token") {
      return res.status(400).json({ error: check });
    } else {
      const users = await pool.query("SELECT * FROM users");
      return res.status(200).json({ data: users.rows });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = getUsers;

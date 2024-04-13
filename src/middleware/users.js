const pool = require("../db");
const verifyToken = require("../utils/verifyToken");

const getUsers = async (req, res) => {
  try {
    const userData = JSON.parse(req.cookies.userData);

    // Extract the token property from the userData object
    const token = userData.token;
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

const pool = require("../db");
const createHash = require("../utils/createHash");

const resetController = async (req, res) => {
  try {
    const token =
      req.query.token ||
      req.body.token ||
      req.headers.authorization?.split(" ")[1];
    const email = req.query.target || req.body.target;

    const { password } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: "Credentials not present" });
    } else {
      if (!password) {
        return res.status(400).json({ message: "Password field is required" });
      } else {
        const hashPassword = await createHash(password);
        const updatePassword = await pool.query(
          "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
          [hashPassword, email]
        );
        return res.status(200).json({ data: updatePassword.rows[0] });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = resetController;

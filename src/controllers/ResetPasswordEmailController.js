const { validationResult } = require("express-validator");
const pool = require("../db");
const createToken = require("../utils/createToken");
const sendResendPasswordEmail = require("../utils/sendResetPasswordEmail");
require("dotenv").config();

const { EXPIRESIN } = process.env;

const resetPasswordEmailController = async (req, res) => {
  try {
    const errors = validationResult(req);
    const { email } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const emailCheck = await pool.query(
        "SELECT email, password FROM users WHERE email = $1",
        [email]
      );
      if (!emailCheck.rows[0]) {
        return res.status(400).json({ message: "User does not exist" });
      } else {
        const token = await createToken(emailCheck.rows[0]);
        const expiresIn = EXPIRESIN;
        await sendResendPasswordEmail(token, email, expiresIn);
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = resetPasswordEmailController;

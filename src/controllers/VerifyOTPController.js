const { validationResult, check } = require("express-validator");
const pool = require("../db");
const verifyHash = require("../utils/verifyHash");
const createToken = require("../utils/createToken");

const verifyOTPController = async (req, res) => {
  try {
    const errors = validationResult(req);
    const { otp, email } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const checkOTP = await pool.query(
        "SELECT otp, email, expires_in FROM otp WHERE email = $1",
        [email]
      );

      const checkHashOTP = await verifyHash(otp, checkOTP.rows[0].otp);
      if (!checkHashOTP) {
        return res.status(400).json({ message: "OTP is invalid" });
      } else {
        if (checkOTP.rows[0].expires_in < Date.now()) {
          await pool.query("DELETE FROM otp WHERE email = $1", [email]);
          return res.status(200).json({ message: "OTP has expired" });
        } else {
          const token = await createToken(checkOTP.rows[0]);
          const updateVerifiedStatus = await pool.query(
            "UPDATE users SET verified = $1, token = $2 RETURNING *",
            [true, token]
          );
          await pool.query("DELETE FROM otp WHERE email = $1", [email]);
          return res.status(200).json({ data: updateVerifiedStatus.rows[0] });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyOTPController;

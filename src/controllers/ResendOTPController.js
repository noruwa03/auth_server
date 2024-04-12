const pool = require("../db");
const generateOTP = require("../utils/generateOTP");
const createHash = require("../utils/createHash");
const sendEmail = require("../utils/sendEmail");

const resendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    } else {
      const hr = 1;
      const otp = await generateOTP();
      const hashOTP = await createHash(otp);
      const expiresIn = Date.now() + 3600000 * hr;
      const checkForOTP = await pool.query(
        "SELECT otp, email, expires_in FROM otp WHERE email = $1",
        [email]
      );

      if (checkForOTP.rows[0]) {
        await pool.query("DELETE FROM otp WHERE email = $1", [email]);
        await pool.query(
          "INSERT INTO otp(otp, email, expires_in) VALUES($1, $2, $3)",
          [hashOTP, email, expiresIn]
        );
        await sendEmail(email, otp, hr);
        return res.status(201).json({
          message: "OTP sent to your email",
        });
      } else {
        await pool.query(
          "INSERT INTO otp(otp, email, expires_in) VALUES($1, $2, $3)",
          [hashOTP, email, expiresIn]
        );
        await sendEmail(email, otp, hr);
        return res.status(201).json({
          message: "OTP sent to your email",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = resendOTPController;

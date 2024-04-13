const { validationResult } = require("express-validator");
const pool = require("../db");
const createHash = require("../utils/createHash");
const createToken = require("../utils/createToken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const signupController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const { email, password } = req.body;
      const hashPassword = await createHash(password);
      const checkEmail = await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );
      if (checkEmail.rows[0]) {
        return res.status(400).json({
          message: `Email: ${email} already exist in our database`,
        });
      } else {
        const data = { email, password };
        const token = await createToken(data);

        const Otp = await generateOTP();
        const hashOTP = await createHash(Otp);
        const hr = 1;
        const expiresIn = Date.now() + 3600000 * hr;
        await pool.query(
          "INSERT INTO otp(otp, email, expires_in) VALUES($1, $2, $3)",
          [hashOTP, email, expiresIn]
        );

        await sendEmail(email, Otp, hr);

        const result = await pool.query(
          "INSERT INTO users(email, password, provider, token) VALUES($1, $2, $3, $4) RETURNING *",
          [email, hashPassword, "Local", token]
        );

        const userInfo = result.rows[0];
        const userDataWithToken = { userInfo, token };
        res.cookie("userData", userDataWithToken, {
          httpOnly: false,
          sameSite: "lax",
          secure: false,
          maxAge: 1000 * 60 * 60 * 24,
        });

        return res
          .status(201)
          .json({ message: "OTP sent to your email", data: result.rows[0] });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = signupController;

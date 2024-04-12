const { validationResult } = require("express-validator");
const pool = require("../db");
const verifyHash = require("../utils/verifyHash");
const createToken = require("../utils/createToken");

const SigninController = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const checkDB = await pool.query(
        "SELECT email, password, verified FROM users WHERE email = $1",
        [email]
      );
      if (!checkDB.rows[0]) {
        return res.status(404).json({ message: "User does not exists" });
      } else {
        const passwordCheck = await verifyHash(
          password,
          checkDB.rows[0].password
        );
        if (!passwordCheck) {
          return res.status(400).json({ message: "Invalid credentials" });
        } else {
          const checkVerifiedStatus = checkDB.rows[0].verified;

          if (!checkVerifiedStatus) {
            return res.status(200).json({ message: checkVerifiedStatus });
          } else {
            const token = await createToken(checkDB.rows[0]);
            const updateUserToken = await pool.query(
              "UPDATE users SET token = $1, updated_at = NOW() WHERE email = $2 RETURNING *",
              [token, email]
            );

            const userInfo = updateUserToken.rows[0];

            const userDataWithToken = { userInfo, token };
            res.cookie("userData", userDataWithToken, {
              httpOnly: false,
              sameSite: "lax",
              secure: false,
              maxAge: 1000 * 60 * 60 * 24,
            });

            return res.status(200).json({ data: updateUserToken.rows[0] });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = SigninController;

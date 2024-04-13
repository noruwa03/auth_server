const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const pool = require("../db");
const createToken = require("../utils/createToken");
const { CLIENT_ID, CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

const getUserDetailController = async (req, res) => {
  const access_token = req.query.code;
  try {
    const redirectURL = GOOGLE_CALLBACK_URL;
    const oAuth2Client = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      redirectURL
    );

    const responseToken = await oAuth2Client.getToken(access_token);
    await oAuth2Client.setCredentials(responseToken.tokens);
    console.log("Token acquired");

    const user = oAuth2Client.credentials;
    console.log("Credentials", user);

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${user.access_token}`
    );

    // const ticket = await oAuth2Client.verifyIdToken({
    //   idToken: user.id_token,
    //   audience: CLIENT_ID,
    // });

    // const payloadData = ticket.getPayload();
    // const userId = payloadData["sub"];
    // const name = payloadData["name"];
    // const email = payloadData["email"];
    // const picture = payloadData["picture"];

    // const userProfile = {
    //   userId,
    //   name,
    //   email,
    //   picture,
    // };

    const data = await response.json();

    const checkDB = await pool.query(
      "SELECT email, verified FROM users WHERE email = $1",
      [data.email]
    );

    let userData = {};
    if (!checkDB.rows[0]) {
      const token = await createToken(data);
      userData = await pool.query(
        "INSERT INTO users(email, verified, password, provider, token) VALUES($1, $2, $3, $4, $5) RETURNING *",
        [data.email, data.email_verified, "Google", "Google", token]
      );
    } else {
      const token = await createToken(data);
      userData = await pool.query(
        "UPDATE users SET token = $1, updated_at = NOW() WHERE email = $2 RETURNING *",
        [token, data.email]
      );
    }

    const userInfo = userData.rows[0];

    const token = userData.rows[0].token;

    const userDataWithToken = { userInfo, token };
    res.cookie("userData", userDataWithToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect("/");
    // console.log("data", data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = getUserDetailController;

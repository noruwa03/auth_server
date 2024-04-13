require("dotenv").config();
const { X_CLIENT_ID, X_CLIENT_SECRET } = process.env;
const axios = require("axios");
const createToken = require("../utils/createToken");
const pool = require("../db");

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(
  `${X_CLIENT_ID}:${X_CLIENT_SECRET}`,
  "utf8"
).toString("base64");

const getTwitterUser = async (req, res) => {
  const code = req.query.code;
  //   the url where we get the twitter access token from
  const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";

  const twitterOauthTokenParams = {
    client_id: X_CLIENT_ID,
    code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
    redirect_uri:
      "https://auth-server-3u34.onrender.com/api/v1/oauth/twitter/callback",
    grant_type: "authorization_code",
  };

  try {
    // POST request to the token url to get the access token
    const response = await axios.post(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`,
        },
      }
    );

    const accessToken = response.data.access_token;
    const userData = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "v2GetUserJS",
      },
    });

    const checkDB = await pool.query(
      "SELECT provider_id, verified FROM users WHERE provider_id = $1",
      [userData.data.data.id]
    );

    let userInfoData = {};
    let token = {};

    if (!checkDB.rows[0]) {
      token = await createToken(userData.data.data);
      userInfoData = await pool.query(
        "INSERT INTO users(name, username, verified, provider, provider_id, password, token) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          userData.data.data.name,
          userData.data.data.username,
          true,
          "Twitter",
          userData.data.data.id,
          "Twitter",
          token,
        ]
      );
    } else {
      token = await createToken(userData.data.data);
      userInfoData = await pool.query(
        "UPDATE users SET token = $1, updated_at = NOW() WHERE provider_id = $2 RETURNING *",
        [token, userData.data.data.id]
      );
    }

    const userInfo = userInfoData.rows[0];
    const userDataWithToken = { userInfo, token };
    // console.log(userDataWithToken);

    await res.cookie("userData", userDataWithToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports = getTwitterUser;

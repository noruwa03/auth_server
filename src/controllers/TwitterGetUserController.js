require("dotenv").config();
const { X_CLIENT_ID, X_CLIENT_SECRET } = process.env;
const axios = require("axios");
const createToken = require("../utils/createToken");

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
    redirect_uri: "http://www.localhost:8000/api/v1/oauth/twitter/callback",
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

    const userInfo = await userData.data.data;
    const token = await createToken(userInfo);

    const userDataWithToken = { userInfo, token };
    // console.log(userDataWithToken);

    await res.cookie("userData", userDataWithToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect("http://www.localhost:5173");
  } catch (error) {
    console.log(error);
  }
};

module.exports = getTwitterUser;

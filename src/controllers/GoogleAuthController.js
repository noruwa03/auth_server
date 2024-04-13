const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRET, APP_URL } = process.env;

const googleAuthController = async (_, res) => {
  res.header(
    "Access-Controller-Allow-Origin",
    APP_URL
  );
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURL = GOOGLE_CALLBACK_URL;
  const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectURL);

  const authorizedURL = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.email openid",
    prompt: "consent",
  });

  res.json({ url: authorizedURL });
};

module.exports = googleAuthController;

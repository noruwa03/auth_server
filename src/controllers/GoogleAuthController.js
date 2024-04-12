const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRET } = process.env;

const googleAuthController = async (_, res) => {
  res.header("Access-Controller-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURL = "http://localhost:8000/api/v1/oauth";
  const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectURL);

  const authorizedURL = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.email openid",
    prompt: "consent",
  });

  res.json({ url: authorizedURL });
};

module.exports = googleAuthController;

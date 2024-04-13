require("dotenv").config();
const { X_CLIENT_ID } = process.env;

const twitterAuthController = async (_, res) => {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri:
      "https://auth-server-3u34.onrender.com/api/v1/oauth/twitter/callback",
    client_id: X_CLIENT_ID,
    state: "state",
    response_type: "code",
    code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
    code_challenge_method: "S256",
    scope: ["users.read", "tweet.read", "follows.read", "follows.write"].join(
      " "
    ), // add/remove scopes as needed
  };

  // Note: Hard coding code_challenge and code_verifier for simplicity. You can randomly generate it.
  const qs = new URLSearchParams(options).toString();

  res.json({ url: `${rootUrl}?${qs}` });
};

module.exports = twitterAuthController;

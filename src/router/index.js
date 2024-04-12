const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const SignupController = require("../controllers/SignupController");
const ResendOTPController = require("../controllers/ResendOTPController");
const SigninController = require("../controllers/SigninController");
const SignoutController = require("../controllers/SignoutController");
const verifyOTPController = require("../controllers/VerifyOTPController");
const ResetPasswordEmailController = require("../controllers/ResetPasswordEmailController");
const ResetController = require("../controllers/ResetController");
const GoogleAuthController = require("../controllers/GoogleAuthController");
const OAuthGetUserController = require("../controllers/OAuthGetUserController");
const UsersMiddleware = require("../middleware/users");
const TwitterAuthController = require("../controllers/TwitterAuthController");
const OAuthGetTwitterUserController = require("../controllers/TwitterGetUserController");

// Test
router.get("/", (_, res) => {
  return res.status(200).json({
    message: "Hello!",
  });
});

// Google Auth
router.post("/google", GoogleAuthController);
router.get("/oauth", OAuthGetUserController);

// Twitter Auth
router.post("/twitter", TwitterAuthController);
router.get("/oauth/twitter/callback", OAuthGetTwitterUserController);

// Signup
router.post(
  "/signup",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password must be greater than 6 characters").isLength({
      min: 6,
    }),
    check("password", "Password must be less than 12 characters").isLength({
      max: 12,
    }),
  ],
  SignupController
);

// Signin
router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  SigninController
);

// Signout
router.post("/signout", SignoutController);

// Verify OTP
router.post(
  "/verify-otp",
  [
    check("otp", "OTP is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
  ],
  verifyOTPController
);

// Resend OTP
router.post("/resend-otp", ResendOTPController);

// Reset Password Email
router.post(
  "/reset-password",
  [check("email", "Email is required").notEmpty()],
  ResetPasswordEmailController
);

// Reset Password
router.post("/reset", ResetController);

// Get Users
router.get("/users", UsersMiddleware);

module.exports = router;

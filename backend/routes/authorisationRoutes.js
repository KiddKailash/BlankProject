const express = require("express");
const router = express.Router();

// Import the controller methods
const {
  registerUser,
  loginUser,
  googleAuth,
  microsoftAuth,
} = require("../controllers/authorisationController");

const authMiddleware = require("../middleware/authMiddleware");

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);
router.post("/microsoft-auth", microsoftAuth);

/**
 * GET /authorisation/verify
 * Checks if the JWT is valid. The authMiddleware ensures a valid token is required.
 */
router.get("/verify", authMiddleware, (req, res) => {
  // If authMiddleware did not throw, the token is valid.
  // We can respond with user data or just a success message.
  res.status(200).json({ valid: true, userId: req.userId });
});

module.exports = router;

module.exports = router;

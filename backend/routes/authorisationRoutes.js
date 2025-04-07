const express = require("express");
const router = express.Router();

// Import the controller methods
const {
  registerUser,
  loginUser,
  googleAuth,
  microsoftAuth,
} = require("../controllers/authorisationController");

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);
router.post("/microsoft-auth", microsoftAuth);

module.exports = router;

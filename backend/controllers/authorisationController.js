/**
 * Authentication Controller
 *
 * This module provides controller functions for user authentication including registration,
 * email/password login, and OAuth-based authentication with Google and Microsoft.
 *
 * It includes functionality to:
 * - Hash and store user passwords.
 * - Generate and sign JWT tokens with the user's id.
 * - Verify Google ID tokens and upsert users based on Google credentials.
 * - Decode Microsoft tokens (for demo purposes) and upsert users based on Microsoft credentials.
 *
 * Dependencies:
 * - bcrypt: For hashing passwords.
 * - jsonwebtoken (jwt/msJwt): For signing and verifying tokens.
 * - google-auth-library: For verifying Google ID tokens.
 * - A MongoDB connection module providing `getDB`.
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const msJwt = require("jsonwebtoken");
const { getDB } = require("../database/db");

// Initialize Google OAuth2 client with the Google Client ID from environment variables.
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Creates a JWT token containing the user's ID.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {string} A JWT token that expires in 1 day.
 */
function createToken(userId) {
  // Use a secret from environment variables if available; otherwise default to "mysecret".
  return jwt.sign({ userId }, process.env.JWT_SECRET || "mysecret", {
    expiresIn: "1d",
  });
}

/**
 * Registers a new user using name, email, and password.
 *
 * Expects the following in req.body:
 *   { name, email, password }
 *
 * Validates that all fields are provided, checks that the user doesn't already exist,
 * hashes the password, inserts the new user into the database, and returns a signed JWT.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Check if a user with the specified email already exists.
    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }

    // Hash the password with bcrypt using 10 rounds.
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user document.
    const newUser = {
      name,
      email,
      passwordHash,
      googleId: null,
      microsoftId: null,
      createdAt: new Date(),
    };

    // Insert the new user into the database.
    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId.toString();

    // Generate and return a JWT with the user's id.
    const token = createToken(userId);
    return res.json({ access: token });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Logs in a user with email and password.
 *
 * Expects the following in req.body:
 *   { email, password }
 *
 * Checks that the provided credentials match a stored user, then returns a signed JWT.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Look for the user by email.
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password stored.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token using the user's id.
    const token = createToken(user._id.toString());
    return res.json({ access: token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Authenticates a user with a Google ID token.
 *
 * Expects the following in req.body:
 *   { token }
 *
 * Verifies the token with Google, upserts the user in the database (creating one if needed or
 * updating an existing record), and returns a JWT.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function googleAuth(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token not provided" });
    }

    // Verify the Google token and extract the payload.
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    if (!sub) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Look for a user with the provided Google ID or email.
    let user = await usersCollection.findOne({
      $or: [{ googleId: sub }, { email }],
    });

    if (!user) {
      // If user is not found, create a new record.
      const doc = {
        name: name || "No Name",
        email,
        passwordHash: null,
        googleId: sub,
        microsoftId: null,
        createdAt: new Date(),
      };
      const result = await usersCollection.insertOne(doc);
      user = { _id: result.insertedId, ...doc };
    } else {
      // If the user is found by email but without a googleId, update the record.
      if (!user.googleId) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { googleId: sub } }
        );
        // Reflect the change in the local variable.
        user.googleId = sub;
      }
    }

    // Issue and return a JWT for the user.
    const jwtToken = createToken(user._id.toString());
    return res.json({ access: jwtToken });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Authenticates a user using a Microsoft authentication token.
 *
 * Expects the following in req.body:
 *   { token }
 *
 * This function decodes the token (for demonstration purposes only; production usage would require
 * token signature verification or a call to the Microsoft Graph API), upserts the user in the database,
 * and returns a JWT.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function microsoftAuth(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Microsoft token not provided" });
    }

    // Decode the token without verifying the signature (demo only).
    const decoded = msJwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid MS token" });
    }

    // Extract the user's email from one of the token fields.
    const email = decoded.preferred_username || decoded.upn || decoded.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Token missing user email. Cannot proceed." });
    }

    // Extract the unique Microsoft id from the token.
    const msId = decoded.oid || decoded.sub;
    if (!msId) {
      return res
        .status(400)
        .json({ message: "Token missing oid/sub. Cannot proceed." });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Look for a user by microsoftId or by email.
    let user = await usersCollection.findOne({
      $or: [{ microsoftId: msId }, { email }],
    });
    if (!user) {
      // If no user is found, create a new record.
      const doc = {
        name: "Microsoft User",
        email,
        passwordHash: null,
        googleId: null,
        microsoftId: msId,
        createdAt: new Date(),
      };
      const result = await usersCollection.insertOne(doc);
      user = { _id: result.insertedId, ...doc };
    } else {
      // If user is found by email but is missing the microsoftId, update the record.
      if (!user.microsoftId) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { microsoftId: msId } }
        );
        user.microsoftId = msId;
      }
    }

    // Generate a JWT using the user's ID and return it.
    const jwtToken = createToken(user._id.toString());
    return res.json({ access: jwtToken });
  } catch (error) {
    console.error("Microsoft auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Export all authentication controller methods.
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  microsoftAuth,
};

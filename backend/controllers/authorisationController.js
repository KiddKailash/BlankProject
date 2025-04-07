const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const msJwt = require("jsonwebtoken");
const { getDB } = require("../database/db");

// Google client (for verifying Google ID tokens)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Helper function to create JWT with the user's ID.
 * @param {string} userId - The _id of the user (as a string).
 */
function createToken(userId) {
  // In production, always use a secure secret from env
  return jwt.sign({ userId }, process.env.JWT_SECRET || "mysecret", {
    expiresIn: "1d",
  });
}

/**
 * Registers a new user with name/email/password.
 * Expects req.body: { name, email, password }
 */
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user doc
    const newUser = {
      name,
      email,
      passwordHash,
      googleId: null,
      microsoftId: null,
      createdAt: new Date(),
    };

    // Insert into MongoDB
    const result = await usersCollection.insertOne(newUser);
    // The newly created user’s _id
    const userId = result.insertedId.toString();

    // Issue JWT
    const token = createToken(userId);
    return res.json({ access: token });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Logs in a user with email/password.
 * Expects req.body: { email, password }
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT
    const token = createToken(user._id.toString());
    return res.json({ access: token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Verifies a Google ID token, upserts user, returns JWT.
 * Expects req.body: { token }
 */
async function googleAuth(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token not provided" });
    }

    // Verify Google token
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

    // Find user by googleId or email
    let user = await usersCollection.findOne({
      $or: [{ googleId: sub }, { email }],
    });

    if (!user) {
      // Create user if not found
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
      // If user found by email but missing googleId, attach it
      if (!user.googleId) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { googleId: sub } }
        );
        user.googleId = sub; // update local variable
      }
    }

    // Return JWT
    const jwtToken = createToken(user._id.toString());
    return res.json({ access: jwtToken });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Decodes an MSAL token from the frontend, upserts user, returns JWT.
 * Expects req.body: { token }
 * Production usage would validate this token signature or call MS Graph.
 */
async function microsoftAuth(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Microsoft token not provided" });
    }

    // Decode the token (demo only)
    const decoded = msJwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid MS token" });
    }

    // Typically found in 'preferred_username', 'upn', or 'email'
    const email = decoded.preferred_username || decoded.upn || decoded.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Token missing user email. Cannot proceed." });
    }

    // Usually found in 'oid' or 'sub'
    const msId = decoded.oid || decoded.sub;
    if (!msId) {
      return res
        .status(400)
        .json({ message: "Token missing oid/sub. Cannot proceed." });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // Find user by microsoftId or email
    let user = await usersCollection.findOne({
      $or: [{ microsoftId: msId }, { email }],
    });
    if (!user) {
      // Create if not found
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
      // If found by email but missing msId, attach it
      if (!user.microsoftId) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { microsoftId: msId } }
        );
        user.microsoftId = msId;
      }
    }

    // Return your own JWT
    const jwtToken = createToken(user._id.toString());
    return res.json({ access: jwtToken });
  } catch (error) {
    console.error("Microsoft auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Export all controller methods as an object
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  microsoftAuth,
};

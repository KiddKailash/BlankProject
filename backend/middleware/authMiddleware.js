const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to verify our own JWT tokens.
 * Looks for "Authorization: Bearer <token>" in the request headers.
 * If valid, attaches user ID to req.userId.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No auth token provided." });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid auth header format." });
    }

    const token = parts[1];
    // Verify with the same secret used in createToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No auth token provided." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid auth header format." });
  }

  const token = parts[1];

  try {
    // Verify with the same secret used to sign
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecret");
    req.userId = decoded.userId; // attach the user ID from the token
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

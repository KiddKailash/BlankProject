/**
 * JWT Authentication Middleware
 *
 * This middleware function verifies the existence and validity of a JSON Web Token (JWT)
 * provided in the HTTP Authorization header. The token is expected to have the following format:
 * 
 *   Authorization: Bearer <token>
 * 
 * If the token is valid, the decoded payload is attached to the request object (e.g., `req.userId`),
 * and the request is passed to the next middleware or route handler.
 *
 * @param {object} req - The HTTP request object containing headers and other request data.
 * @param {object} res - The HTTP response object used to return error messages and status codes.
 * @param {function} next - The callback function to pass control to the next middleware.
 *
 * @returns {object|undefined} - Returns an error response if the JWT is missing, malformatted, or invalid.
 */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Retrieve the Authorization header from the incoming request.
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists.
  if (!authHeader) {
    return res.status(401).json({ message: "No auth token provided." });
  }

  // Split the header into its parts. It should be in the format "Bearer <token>".
  const parts = authHeader.split(" ");

  // Ensure that the header is properly formatted with two parts, and that the prefix is "Bearer".
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid auth header format." });
  }

  // Extract the token from the header.
  const token = parts[1];

  try {
    // Verify the token using the secret key. The secret key is taken from the env variable JWT_SECRET.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user ID to the request object for use in subsequent middleware/routes.
    req.userId = decoded.userId;

    // Pass control to the next middleware function.
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

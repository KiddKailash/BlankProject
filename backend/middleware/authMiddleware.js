const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Authentication middleware to verify JWT tokens.
 * Fetches user details from the database and adds it to req.user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, res, next) => {
 
};

module.exports = authMiddleware;

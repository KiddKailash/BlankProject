/**
 * Main Application File
 *
 * This file configures and starts the Express server, including:
 * - Environment variable configuration.
 * - Connecting to MongoDB.
 * - Setting up middlewares like CORS, rate limiting, and body parsing.
 * - Defining API routes, such as authorisation routes, a Stripe webhook,
 *   a users endpoint for example purposes, and a default root route.
 * - Global error handling.
 *
 * Dependencies:
 * - dotenv: Loads environment variables from .env file.
 * - express: Web framework for Node.js.
 * - cors: Middleware to enable Cross-Origin Resource Sharing.
 * - express-rate-limit: Rate limiter middleware to protect against abuse.
 * - body-parser: Middleware to parse incoming request bodies.
 * - Custom database module for MongoDB connection.
 * - Custom authorisation routes.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const { connectDB, getDB } = require("./database/db");

// Import custom routes for authorisation logic
const authorisationRoutes = require("./routes/authorisationRoutes");

const app = express();

// Trust the first proxy in front of the application (important for rate limiting and IP based restrictions)
app.set("trust proxy", 1);

// Define the port to listen on; fallback to 8080 if not specified in environment
const PORT = process.env.PORT || 8080;

/**
 * Example webhook handler for Stripe or similar services.
 * This example uses raw body parsing.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const webhookHandler = (req, res) => {
  res.status(200).send("Webhook received!");
};

// Connect to the MongoDB database using connectDB from the custom db module.
connectDB()
  .then(() => {
    // Setup CORS with a whitelist of allowed origins.
    // Inline callback checks if the request origin is allowed.
    const allowedOrigins = ["http://localhost:5173", "https://vellum-iota.vercel.app/"];
    app.use(
      cors({
        origin: function (origin, callback) {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          // For disallowed origins, return an error.
          return callback(new Error("Not allowed by CORS"));
        },
      })
    );

    // Setup rate limiter middleware.
    // Limit each IP to 500 requests per 15 minutes.
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      message: "Too many requests from this IP, please try again later.",
    });
    app.use(limiter);

    // 1) Stripe webhook endpoint with raw body parser
    // This endpoint expects a raw body for correct webhook signature validation.
    app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), webhookHandler);

    // 2) Global body parsing middleware for JSON and URL-encoded data
    // Increase the limit to support large payloads.
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ limit: "20mb", extended: true }));

    // Mount authorisation routes under the '/authorisation' path.
    app.use("/authorisation", authorisationRoutes);

    /**
     * Example API endpoint for fetching users.
     * Demonstrates usage of getDB() to interact with the MongoDB database.
     */
    app.get("/api/users", async (req, res) => {
      try {
        const db = getDB();
        const users = await db.collection("users").find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
      }
    });

    // Simple root route to verify the server is running.
    app.get("/", (req, res) => {
      res.send("Hello from the Node.js server with MongoDB!");
    });

    /**
     * Global error handler middleware.
     * Catches errors throughout the application, including CORS errors.
     */
    app.use((err, req, res, next) => {
      if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ error: "CORS Error: Access denied." });
      }
      console.error("Global Error Handler:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    // Start the Express server.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    // Exit process if the database connection fails.
    process.exit(1);
  });

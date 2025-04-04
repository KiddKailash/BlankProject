require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const { connectDB, getDB } = require("./database/db");

const app = express();

// Allows DigitalOcean Load Balancing (or other proxies)
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8080;

// For your Stripe webhook. If you don't have this yet, just keep the placeholder:
const webhookHandler = (req, res) => {
  res.status(200).send("Webhook received!");
};

connectDB()
  .then(() => {
    // Setup CORS
    const allowedOrigins = ["http://localhost:5173", "https://vellum.netlify.app"];
    app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) return callback(null, true); // server-to-server or CLI
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(new Error("Not allowed by CORS"));
        },
      })
    );

    // Rate Limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // requests per window
      message: "Too many requests from this IP, please try again later.",
    });
    app.use(limiter);

    // 1) Stripe webhook endpoint (raw body).
    app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), webhookHandler);

    // 2) Global JSON parsing
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ limit: "20mb", extended: true }));

    // Example route to show how to use the DB connection
    app.get("/api/users", async (req, res) => {
      try {
        const db = getDB();
        // Suppose you have a 'users' collection in your 'vellum' DB
        const users = await db.collection("users").find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
      }
    });

    // A simple "Hello" route to confirm the server is running
    app.get("/", (req, res) => {
      res.send("Hello from the Node.js server with MongoDB!");
    });

    // Global error handler
    app.use((err, req, res, next) => {
      if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ error: "CORS Error: Access denied." });
      }
      console.error("Global Error Handler:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

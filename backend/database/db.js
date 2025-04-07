/**
 * MongoDB Connection Module
 *
 * This module handles the connection to a MongoDB database using the official MongoDB Node.js driver.
 * It uses environment variables to determine the connection URI and database name, with fallback defaults
 * for local development. It exports two main functions:
 * - connectDB: Establishes a connection to MongoDB and returns the database instance.
 * - getDB: Returns the already initialized database instance or throws an error if not connected.
 */

// Load environment variables from a .env file into process.env
require("dotenv").config();
const { MongoClient } = require("mongodb");

// Provide fallback defaults for local development if environment variables are not provided.
const DEFAULT_URI = "mongodb://localhost:27017";
const DEFAULT_DB_NAME = "myDatabase";

// Use environment variables with fallback to defaults.
const uri = process.env.DATABASE_URL || DEFAULT_URI;
const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

/**
 * Create a new MongoClient instance.
 *
 * Note: TLS configuration is commented out. Uncomment and adjust the TLS options if TLS is required.
 */
const client = new MongoClient(uri /*, {
  tls: true,
  tlsAllowInvalidCertificates: false,
}*/);

// Declare a variable to hold the database instance once connected.
let db = null;

/**
 * Connect to MongoDB and retrieve the database instance.
 *
 * This asynchronous function connects to the MongoDB server using the MongoClient. If already connected,
 * it returns the existing instance.
 *
 * @async
 * @function connectDB
 * @returns {Promise<object>} The MongoDB database instance.
 * @throws Will throw an error if the connection to the database fails.
 */
const connectDB = async () => {
  // If the database is already connected, return it.
  if (db) return db;

  try {
    // Establish a connection to the MongoDB server.
    await client.connect();

    // Select the database by name.
    db = client.db(dbName);

    // Log confirmation to the console.
    console.log("Connected to MongoDB using database:", db.databaseName);

    // Return the connected database instance.
    return db;
  } catch (error) {
    // Log the error and rethrow it to be handled by the caller.
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

/**
 * Retrieve the connected database instance.
 *
 * This function returns the database instance if the connection has been established by connectDB.
 * Otherwise, it throws an error to indicate that the connection has not been initialized.
 *
 * @function getDB
 * @returns {object} The MongoDB database instance.
 * @throws Will throw an error if the database connection has not been initialized.
 */
const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };

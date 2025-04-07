require("dotenv").config();
const { MongoClient } = require("mongodb");

// Provide fallback defaults for local development
const DEFAULT_URI = "mongodb://localhost:27017";
const DEFAULT_DB_NAME = "myLocalDatabase";

const uri = process.env.DATABASE_URL || DEFAULT_URI;
const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

// Remove tls config here:
const client = new MongoClient(uri /*, {
  tls: true,
  tlsAllowInvalidCertificates: false,
}*/);

let db = null;

const connectDB = async () => {
  if (db) return db;

  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB using database:", db.databaseName);
    return db;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };

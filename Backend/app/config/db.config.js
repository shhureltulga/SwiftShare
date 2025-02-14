const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uri = "mongodb://localhost:27017/filess";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(uri,clientOptions);
    console.log("MongoDB connected 123");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

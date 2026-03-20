const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

/**
 * Establish a MongoDB connection using Mongoose.
 * The function throws if the URI is missing so misconfiguration is caught early.
 */
async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(MONGODB_URI);
  return mongoose.connection;
}

module.exports = { connectDB };

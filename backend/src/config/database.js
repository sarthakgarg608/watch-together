// ------------------------------------------------------
// MongoDB connection
// ------------------------------------------------------

import mongoose from "mongoose";
import env from "./env.js";

async function connectDatabase() {
  try {
    const connection = await mongoose.connect(env.mongodbUri);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);

    process.exit(1);
  }
}

export default connectDatabase;
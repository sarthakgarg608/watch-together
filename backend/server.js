// ------------------------------------------------------
// Server entry point
//
// This file is responsible for:
// 1. Loading the application
// 2. Connecting to MongoDB
// 3. Starting the HTTP server
// ------------------------------------------------------

import app from "./src/app.js";
import connectDatabase from "./src/config/database.js";
import env from "./src/config/env.js";

async function startServer() {
  try {
    // Connect to MongoDB before accepting requests.
    await connectDatabase();

    app.listen(env.port, () => {
      console.log("------------------------------------------");
      console.log("Watch Together API");
      console.log("------------------------------------------");
      console.log(`Environment: ${env.nodeEnv}`);
      console.log(`Port: ${env.port}`);
      console.log(`API: http://localhost:${env.port}/api/v1`);
      console.log(`Health: http://localhost:${env.port}/health`);
      console.log("------------------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();
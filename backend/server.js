import http from "http";

import app from "./src/app.js";
import connectDatabase from "./src/config/database.js";
import env from "./src/config/env.js";
import initializeSocket from "./src/socket/index.js";

async function startServer() {
  try {
    await connectDatabase();

    const httpServer = http.createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(env.port, () => {
      console.log("------------------------------------------");
      console.log("Watch Together API");
      console.log("------------------------------------------");
      console.log(`Environment: ${env.nodeEnv}`);
      console.log(`Port: ${env.port}`);
      console.log(
        `API: http://localhost:${env.port}/api/v1`
      );
      console.log(
        `Health: http://localhost:${env.port}/api/v1/health`
      );
      console.log("------------------------------------------");
      console.log("Socket.IO enabled");
      console.log("------------------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();
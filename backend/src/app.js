// ------------------------------------------------------
// Express application
//
// This file creates and configures the Express app.
// Server startup is handled separately by server.js.
// ------------------------------------------------------

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import env from "./config/env.js";

import apiRoutes from "./routes/index.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// ------------------------------------------------------
// Security
// ------------------------------------------------------

app.use(helmet());

// ------------------------------------------------------
// CORS
// ------------------------------------------------------

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// ------------------------------------------------------
// Request parsing
// ------------------------------------------------------

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

// ------------------------------------------------------
// Global rate limiter
//
// Sensitive endpoints will later have stricter limits.
// ------------------------------------------------------

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(globalRateLimiter);

// ------------------------------------------------------
// Health check
//
// Used by monitoring systems and deployment platforms.
// ------------------------------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Watch Together API is running.",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------
// API v1
// ------------------------------------------------------

app.use("/api/v1", apiRoutes);

// ------------------------------------------------------
// 404 handler
//
// Must be registered after all valid routes.
// ------------------------------------------------------

app.use(notFoundMiddleware);

// ------------------------------------------------------
// Global error handler
//
// Must be registered LAST.
// ------------------------------------------------------

app.use(errorMiddleware);

export default app;
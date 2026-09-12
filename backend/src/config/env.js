// ------------------------------------------------------
// Environment configuration
//
// Loads environment variables and validates the values
// required by the application.
// ------------------------------------------------------

import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongodbUri: process.env.MONGODB_URI,

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,

  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT) || 465,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
};

export default env;
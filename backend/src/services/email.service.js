import nodemailer from "nodemailer";

import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,

  auth: {
    user: env.smtpUser,
    pass: env.smtpPassword,
  },
});

async function sendOtpEmail({
  email,
  otp,
  purpose,
}) {
  let subject;
  let heading;

  if (purpose === "registration") {
  subject = "Complete your Watch Together registration";
  heading = "Verify your email to create your account";
} else if (purpose === "email-verification") {
  subject = "Verify your Watch Together account";
  heading = "Verify your email";
} else {
  subject = "Reset your Watch Together password";
  heading = "Reset your password";
}

  await transporter.sendMail({
    from: `"Watch Together" <${env.smtpUser}>`,
    to: email,
    subject,

    text: `Your OTP is ${otp}. It expires in 5 minutes.`,

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>${heading}</h2>

        <p>
          Your OTP is:
        </p>

        <h1>${otp}</h1>

        <p>
          This OTP will expire in 5 minutes.
        </p>

        <p>
          If you did not request this, you can safely ignore
          this email.
        </p>
      </div>
    `,
  });
}

export {
  sendOtpEmail,
};
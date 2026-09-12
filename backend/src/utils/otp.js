import crypto from "crypto";

function generateOtp() {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export default generateOtp;
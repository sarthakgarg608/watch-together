// VerifyEmail.jsx
// ------------------------------------------------------
// Email verification page.
//
// Current:
// - Frontend-only OTP interface.
// - Backend OTP verification will be connected later.
// ------------------------------------------------------

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    // Backend email verification API will be connected later.
    setVerified(true);
  };

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter the 6-digit verification code sent to your email address.
          </p>

          {verified ? (
            <div className="mt-8 space-y-5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300">
                  Your email has been verified successfully.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
              >
                Continue to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verify Email
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;

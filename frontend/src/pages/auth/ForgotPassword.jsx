// ForgotPassword.jsx
// ------------------------------------------------------
// Password recovery screen.
//
// Flow:
// 1. Enter email
// 2. Send password-reset OTP
// 3. Enter OTP
// 4. Verify OTP
// 5. Continue to password reset screen
// ------------------------------------------------------

import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import authService from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("email");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  /*
   * Send password-reset OTP.
   */
  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await authService.forgotPassword(
          normalizedEmail
        );

      /*
       * The backend intentionally returns the same
       * message whether the account exists or not.
       */
      setMessage(
        response.message ||
          "If an account exists with this email, a password reset OTP has been sent."
      );

      setStep("otp");
    } catch (error) {
      setError(
        error.message ||
          "Unable to send the OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Verify the OTP.
   */
  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await authService.verifyResetOtp(
          email.trim().toLowerCase(),
          otp
        );

      const resetToken =
        response.data?.resetToken;

      if (!resetToken) {
        throw new Error(
          "Password reset session could not be created."
        );
      }

      /*
       * Do not put the reset token in the URL.
       *
       * React Router state keeps it out of the
       * browser address bar.
       */
      navigate("/reset-password", {
        replace: true,
        state: {
          resetToken,
        },
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to verify the OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Allow the user to request another OTP.
   */
  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040611] text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute right-[-15%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-8 text-center">

            <Link
              to="/"
              className="text-xl font-black"
            >
              Watch
              <span className="text-violet-400">
                Together
              </span>
            </Link>

          </div>

          {/* Card */}
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-white/[0.035]
              p-6
              shadow-2xl
              shadow-black/30
              backdrop-blur-2xl
              sm:p-8
            "
          >

            {step === "email" ? (

              <>
                {/* Icon */}
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-violet-500/10
                    text-xl
                  "
                >
                  ✦
                </div>

                <h1 className="mt-5 text-2xl font-black">
                  Forgot your password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your email and we'll send
                  you a secure password reset OTP.
                </p>

                {error && (
                  <div
                    className="
                      mt-5 rounded-xl
                      border border-red-400/20
                      bg-red-500/10
                      px-4 py-3
                      text-sm text-red-300
                    "
                  >
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSendOtp}
                  className="mt-6"
                >

                  <label
                    htmlFor="forgot-email"
                    className="
                      mb-2 block
                      text-sm font-semibold
                      text-slate-300
                    "
                  >
                    Email address
                  </label>

                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-black/20
                      px-4 py-3.5
                      text-sm text-white
                      outline-none
                      transition-all duration-300
                      placeholder:text-slate-700
                      focus:border-violet-400/40
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      mt-5 w-full rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-fuchsia-600
                      py-3.5
                      text-sm font-bold
                      shadow-lg
                      shadow-violet-900/30
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </button>

                </form>
              </>

            ) : (

              <>
                {/* OTP Icon */}
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-violet-500/10
                    text-xl
                  "
                >
                  #
                </div>

                <h1 className="mt-5 text-2xl font-black">
                  Verify your OTP
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter the 6-digit code sent to
                  <span className="text-slate-300">
                    {" "}{email}
                  </span>
                </p>

                {message && (
                  <div
                    className="
                      mt-5 rounded-xl
                      border border-emerald-400/20
                      bg-emerald-500/10
                      px-4 py-3
                      text-sm leading-5
                      text-emerald-300
                    "
                  >
                    {message}
                  </div>
                )}

                {error && (
                  <div
                    className="
                      mt-5 rounded-xl
                      border border-red-400/20
                      bg-red-500/10
                      px-4 py-3
                      text-sm text-red-300
                    "
                  >
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleVerifyOtp}
                  className="mt-6"
                >

                  <label
                    htmlFor="reset-otp"
                    className="
                      mb-2 block
                      text-sm font-semibold
                      text-slate-300
                    "
                  >
                    Verification code
                  </label>

                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                    }}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    disabled={loading}
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-black/20
                      px-4 py-3.5
                      text-center
                      text-lg font-bold
                      tracking-[0.45em]
                      text-white
                      outline-none
                      transition-all duration-300
                      placeholder:text-slate-700
                      placeholder:tracking-[0.45em]
                      focus:border-violet-400/40
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    className="
                      mt-5 w-full rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-fuchsia-600
                      py-3.5
                      text-sm font-bold
                      shadow-lg
                      shadow-violet-900/30
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </button>

                </form>

                <button
                  type="button"
                  onClick={handleChangeEmail}
                  disabled={loading}
                  className="
                    mt-4 w-full
                    text-sm font-semibold
                    text-slate-500
                    transition-colors
                    hover:text-violet-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Use a different email
                </button>

              </>
            )}

          </div>

          {/* Bottom navigation */}
          <p className="mt-6 text-center text-sm text-slate-600">

            Remember your password?

            {" "}

            <Link
              to="/login"
              className="
                text-violet-400
                transition-colors
                hover:text-violet-300
              "
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}

export default ForgotPassword;


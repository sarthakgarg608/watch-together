import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import authService from "../../services/authService";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // The reset token is passed through React Router state
  // after successful OTP verification.
  const resetToken = location.state?.resetToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] =
    useState(false);

  function validatePassword(value) {
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!resetToken) {
      setError(
        "Your password reset session is invalid or has expired."
      );
      return;
    }

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await authService.resetPassword(
          resetToken,
          password
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to reset password."
        );
      }

      setIsSubmitted(true);
      setMessage(
        response.message ||
          "Password reset successfully."
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    navigate("/login", {
      replace: true,
    });
  }

  if (!resetToken && !isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl">
              !
            </div>

            <h1 className="text-2xl font-bold">
              Reset session expired
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Your password reset session is invalid
              or has expired. Please request a new
              password reset OTP.
            </p>

            <Link
              to="/forgot-password"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Request New OTP
            </Link>

            <Link
              to="/login"
              className="mt-4 inline-flex text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isSubmitted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[75vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-400">
              ✓
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Password Updated
            </h1>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {message ||
                "Your password has been reset successfully."}
            </p>

            <button
              type="button"
              onClick={handleGoToLogin}
              className="mt-8 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 active:scale-[0.98]"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[75vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
              🔐
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Create New Password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Choose a strong password for your
              Watch Together account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* New password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    // Eye with slash
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A10.6 10.6 0 0112 4c5 0 8.5 4 9.5 8a10.7 10.7 0 01-4.08 5.43M6.61 6.61C4.64 7.86 3.4 9.85 2.5 12c.67 1.92 2.16 4.05 4.5 5.4"
                      />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password requirements
              </p>

              <div className="grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-2">
                <p>
                  {password.length >= 8
                    ? "✓"
                    : "○"}{" "}
                  8+ characters
                </p>

                <p>
                  {/[A-Z]/.test(password)
                    ? "✓"
                    : "○"}{" "}
                  Uppercase letter
                </p>

                <p>
                  {/[a-z]/.test(password)
                    ? "✓"
                    : "○"}{" "}
                  Lowercase letter
                </p>

                <p>
                  {/[0-9]/.test(password)
                    ? "✓"
                    : "○"}{" "}
                  Number
                </p>

                <p>
                  {/[^A-Za-z0-9]/.test(password)
                    ? "✓"
                    : "○"}{" "}
                  Special character
                </p>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A10.6 10.6 0 0112 4c5 0 8.5 4 9.5 8a10.7 10.7 0 01-4.08 5.43M6.61 6.61C4.64 7.86 3.4 9.85 2.5 12c.67 1.92 2.16 4.05 4.5 5.4"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating Password..."
                : "Update Password"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;


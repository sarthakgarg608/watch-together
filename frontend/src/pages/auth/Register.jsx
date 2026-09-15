import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const OTP_COOLDOWN_SECONDS = 60;

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = {
    firstUppercase: /^[A-Z]/.test(formData.password),
    minLength: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;

    /*
     * Once OTP has been sent, don't allow the email to change.
     * The OTP is associated with the original email address.
     */
    if (name === "email" && otpSent) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateRegistrationDetails = () => {
    if (!formData.name.trim()) {
      return "Please enter your name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!passwordIsValid) {
      return "Please satisfy all password requirements.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  /*
   * Send the first registration OTP.
   */
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    const validationError = validateRegistrationDetails();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await authService.sendRegistrationOtp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setOtpSent(true);
      setCooldown(OTP_COOLDOWN_SECONDS);
      setSuccess(
        `OTP sent to ${formData.email.trim()}. Please check your inbox.`
      );

      /*
       * Start the resend cooldown.
       */
      startCooldown();
    } catch (err) {
      setError(
        err.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Resend registration OTP.
   */
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) {
      return;
    }

    setError("");
    setSuccess("");

    const validationError = validateRegistrationDetails();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setResending(true);

      await authService.sendRegistrationOtp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setCooldown(OTP_COOLDOWN_SECONDS);
      setOtp("");

      setSuccess("A new OTP has been sent to your email.");

      startCooldown();
    } catch (err) {
      setError(
        err.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  /*
   * Simple client-side countdown.
   *
   * The backend rate limiter remains the real security
   * control. This timer only improves the user experience.
   */
  const startCooldown = () => {
    let remaining = OTP_COOLDOWN_SECONDS;

    const interval = setInterval(() => {
      remaining -= 1;

      setCooldown(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  /*
   * Verify OTP and create the actual User account.
   */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await authService.verifyRegistrationOtp(
        formData.email.trim(),
        otp.trim()
      );

      /*
       * Registration is complete.
       * The backend has now created the verified account.
       */
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please login to continue.",
          email: formData.email.trim(),
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ valid, children }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
        valid ? "text-emerald-400" : "text-slate-400"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
          valid
            ? "bg-emerald-400/20 text-emerald-400"
            : "bg-slate-700 text-slate-500"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      <span>{children}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Back to Home */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>

        {/* Main Card */}
        <div className="glass-strong rounded-2xl border border-white/10 p-6 shadow-2xl sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {otpSent ? "Verify Your Email" : "Create Account"}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {otpSent
                ? "Enter the OTP sent to your email"
                : "Create your Watch Together account"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          {!otpSent ? (
            /* =====================================================
               STEP 1 — REGISTRATION DETAILS
               ===================================================== */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/10"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="xyz001@gmail.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/10"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Password requirements
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Requirement
                      valid={passwordRules.minLength}
                    >
                      At least 8 characters
                    </Requirement>

                    <Requirement
                      valid={passwordRules.firstUppercase}
                    >
                      Starts with a capital letter
                    </Requirement>

                    <Requirement
                      valid={passwordRules.lowercase}
                    >
                      Contains a lowercase letter
                    </Requirement>

                    <Requirement
                      valid={passwordRules.number}
                    >
                      Contains a number
                    </Requirement>

                    <Requirement
                      valid={passwordRules.special}
                    >
                      Contains a special character
                    </Requirement>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
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
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* Send OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:scale-[1.01] hover:from-violet-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>
          ) : (
            /* =====================================================
               STEP 2 — OTP VERIFICATION
               ===================================================== */
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              {/* Verified email display */}
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Verification email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-white">
                  {formData.email}
                </p>
              </div>

              {/* OTP */}
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Enter OTP
                </label>

                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);

                    setOtp(value);
                    setError("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-500 placeholder:tracking-normal focus:border-violet-400/50 focus:bg-white/10"
                />
              </div>

              {/* Verify OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:scale-[1.01] hover:from-violet-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Didn't receive the OTP?
                </p>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={
                    cooldown > 0 || resending
                  }
                  className="mt-2 text-sm font-medium text-violet-400 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:text-slate-600"
                >
                  {resending
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"}
                </button>
              </div>

              {/* Change email */}
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setCooldown(0);
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-sm text-slate-500 transition hover:text-slate-300"
              >
                ← Change email or registration details
              </button>
            </form>
          )}

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-violet-400 transition hover:text-violet-300"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
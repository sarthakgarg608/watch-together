import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /*
     * Backend integration will happen later.
     *
     * For now we only demonstrate the complete UI flow.
     */
    console.log("Reset token:", token);
    console.log("New password submitted.");

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040611] px-4 py-10 text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="relative z-10 w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-400">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-black">
              Password updated
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Your password has been updated successfully. You can now sign
              in with your new password.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01]"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040611] px-4 py-10 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="mx-auto flex w-fit items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-black shadow-lg shadow-violet-500/20">
            ▶
          </div>

          <span className="text-lg font-black">
            Watch Together
          </span>
        </Link>

        {/* Card */}
        <div className="glass-strong mt-8 rounded-3xl p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-300">
              🔐
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Create a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your new password"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01] hover:shadow-violet-500/30"
            >
              Update Password
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
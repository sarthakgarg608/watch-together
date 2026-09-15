import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /*
   * Registration redirects here with:
   *
   * state: {
   *   message: "...",
   *   email: "..."
   * }
   *
   * Pre-fill the email and show the success message.
   */
  useEffect(() => {
    const registrationMessage = location.state?.message;
    const registrationEmail = location.state?.email;

    if (registrationMessage) {
      setSuccess(registrationMessage);
    }

    if (registrationEmail) {
      setFormData((previous) => ({
        ...previous,
        email: registrationEmail,
      }));
    }

    /*
     * Remove the temporary navigation state from the URL/history.
     *
     * This prevents the registration success message from appearing
     * again if the user refreshes or navigates back to this page.
     */
    if (registrationMessage || registrationEmail) {
      navigate(location.pathname, {
        replace: true,
        state: {
          from: location.state?.from,
        },
      });
    }
  }, [location, navigate]);

  const from = location.state?.from?.pathname || "/dashboard";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await login(formData);

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue to Watch Together.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
            >
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

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
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-violet-400/50 focus:bg-white/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-violet-400/50 focus:bg-white/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:scale-[1.01] hover:from-violet-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-violet-400 transition hover:text-violet-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
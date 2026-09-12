// Login.jsx
// ------------------------------------------------------
// Premium login screen.
//
// Current phase:
// - Frontend authentication flow
// - Uses existing AuthContext
// - Backend-independent UI
//
// Later:
// - Real JWT authentication
// ------------------------------------------------------

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  // ----------------------------------------------------
  // Login
  // ----------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });

      const destination =
        location.state?.from?.pathname ||
        "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error?.message ||
          "Unable to sign in. Please check your credentials."
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040611] text-white">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[-15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute right-[-15%] top-[20%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

        <div className="absolute bottom-[-20%] left-[30%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />

      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

          {/* Brand */}

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <span
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-violet-500
                  to-fuchsia-600
                  text-lg font-black
                  shadow-lg
                  shadow-violet-900/30
                "
              >
                ▶
              </span>

              <span className="text-xl font-black tracking-tight">
                Watch
                <span className="text-violet-400">
                  Together
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm text-slate-500">
              Your friends are waiting.
            </p>

          </div>

          {/* ==================================================
              CARD
          ================================================== */}

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

            <div className="mb-7">

              <h1 className="text-2xl font-black">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue your watch parties.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div
                className="
                  mb-5 rounded-xl
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
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
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
                    focus:bg-white/[0.04]
                    focus:ring-4
                    focus:ring-violet-500/10
                  "
                />
              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-xs font-semibold
                      text-violet-400
                      transition-colors
                      hover:text-violet-300
                    "
                  >
                    Forgot password?
                  </Link>

                </div>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                    focus:bg-white/[0.04]
                    focus:ring-4
                    focus:ring-violet-500/10
                  "
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isLoading}
                className="
                  group relative w-full
                  overflow-hidden rounded-xl
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
                  hover:shadow-violet-900/40
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span className="relative z-10">
                  {isLoading
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                <span
                  className="
                    absolute inset-0
                    -translate-x-full
                    bg-white/10
                    transition-transform
                    duration-500
                    group-hover:translate-x-0
                  "
                />
              </button>

            </form>

            {/* Register */}

            <div className="mt-7 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?
                {" "}

                <Link
                  to="/register"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  Create one
                </Link>
              </p>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-700">
            Watch together. Stay connected.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;
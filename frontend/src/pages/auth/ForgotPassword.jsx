// ForgotPassword.jsx
// ------------------------------------------------------
// Password recovery request screen.
//
// Current phase:
// - UI and navigation
//
// Backend integration will be connected later.
// ------------------------------------------------------

import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Temporary frontend behaviour.
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040611] text-white">

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute right-[-15%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

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

            {!submitted ? (
              <>
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
                  Enter your email and we'll help you
                  get back into your account.
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
                  onSubmit={handleSubmit}
                  className="mt-6"
                >

                  <label
                    htmlFor="forgot-email"
                    className="mb-2 block text-sm font-semibold text-slate-300"
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
                    "
                  />

                  <button
                    type="submit"
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
                    "
                  >
                    Send reset instructions
                  </button>

                </form>
              </>
            ) : (

              <div className="text-center">

                <div
                  className="
                    mx-auto flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    bg-emerald-500/10
                    text-2xl text-emerald-400
                  "
                >
                  ✓
                </div>

                <h1 className="mt-5 text-2xl font-black">
                  Check your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  If an account exists for
                  <span className="text-slate-300">
                    {" "}{email}
                  </span>
                  , you'll receive password reset
                  instructions.
                </p>

                <Link
                  to="/login"
                  className="
                    mt-6 inline-flex
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-5 py-3
                    text-sm font-semibold
                    text-slate-300
                    transition-all duration-300
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  Back to sign in
                </Link>

              </div>
            )}

          </div>

          {!submitted && (
            <p className="mt-6 text-center text-sm text-slate-600">
              Remember your password?
              {" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>
          )}

        </div>

      </div>

    </main>
  );
}

export default ForgotPassword;
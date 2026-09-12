// VerifyEmail.jsx
// ------------------------------------------------------
// Email verification screen.
//
// Current phase:
// - Frontend UI
// - OTP input
//
// Backend OTP verification will be connected later.
// ------------------------------------------------------

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    "your email address";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    // Temporary frontend behaviour.
    navigate("/login");
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
              text-center
              shadow-2xl
              shadow-black/30
              backdrop-blur-2xl
              sm:p-8
            "
          >

            <div
              className="
                mx-auto flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-violet-500/10
                text-2xl
              "
            >
              ✉
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Verify your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We've sent a 6-digit verification code
              to
              <br />
              <span className="font-semibold text-slate-300">
                {email}
              </span>
            </p>

            {error && (
              <div
                className="
                  mt-5 rounded-xl
                  border border-red-400/20
                  bg-red-500/10
                  px-4 py-3
                  text-left text-sm text-red-300
                "
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleChange}
                placeholder="000000"
                className="
                  w-full rounded-2xl
                  border border-white/10
                  bg-black/20
                  px-4 py-5
                  text-center
                  font-mono text-3xl
                  font-black
                  tracking-[0.35em]
                  text-white
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
                "
              >
                Verify email
              </button>

            </form>

            <button
              type="button"
              className="
                mt-5 text-xs font-semibold
                text-violet-400
                transition-colors
                hover:text-violet-300
              "
            >
              Didn't receive the code? Resend
            </button>

          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300"
            >
              Back to sign in
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}

export default VerifyEmail;
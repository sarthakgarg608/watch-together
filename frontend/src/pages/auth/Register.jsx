// Register.jsx
// ------------------------------------------------------
// Premium registration screen.
// ------------------------------------------------------

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await authService.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

      if (!response?.success) {
        throw new Error(
          "Unable to create your account."
        );
      }

      navigate("/verify-email", {
        state: {
          email: form.email.trim(),
        },
      });
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      setError(
        error?.message ||
          "Unable to create your account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040611] text-white">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[150px]" />

        <div className="absolute right-[-15%] top-[25%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />

      </div>

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

              <span className="text-xl font-black">
                Watch
                <span className="text-violet-400">
                  Together
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm text-slate-500">
              Start your next movie night.
            </p>

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

            <h1 className="text-2xl font-black">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join Watch Together and start watching
              with your friends.
            </p>

            {/* Error */}

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
              className="mt-6 space-y-4"
            >

              <AuthField
                label="Full name"
                name="name"
                type="text"
                placeholder="Sarthak Garg"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />

              <AuthField
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />

              <AuthField
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <AuthField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="
                  group relative mt-2 w-full
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
                    ? "Creating account..."
                    : "Create account"}
                </span>

                <span
                  className="
                    absolute inset-0
                    -translate-x-full
                    bg-white/10
                    transition-transform duration-500
                    group-hover:translate-x-0
                  "
                />
              </button>

            </form>

            <div className="mt-6 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Already have an account?
                {" "}

                <Link
                  to="/login"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  Sign in
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

// ------------------------------------------------------
// Reusable field
// ------------------------------------------------------

function AuthField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
  );
}

export default Register;
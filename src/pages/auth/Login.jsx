// Login.jsx
// ------------------------------------------------------
// Login page.
//
// Authentication is handled by AuthContext.
// ------------------------------------------------------

import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isLoading,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const from =
    location.state?.from ||
    "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Email is required."
      );
      return;
    }

    if (!password) {
      setError(
        "Password is required."
      );
      return;
    }

    try {
      await login({
        email: cleanEmail,
        password,
      });

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setError(
        error.message ||
          "Unable to login."
      );
    }
  };

  return (
    <main className="login-page">

      <h1>Login</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          placeholder="Enter email"
          autoComplete="email"
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          placeholder="Enter password"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>

      <Link to="/forgot-password">
        Forgot Password?
      </Link>

    </main>
  );
}

export default Login;
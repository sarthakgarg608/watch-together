import { useState } from "react";
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
  const [submitting, setSubmitting] = useState(false);

  const from =
    location.state?.from?.pathname ||
    "/dashboard";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
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
    <div>
      <h1>Welcome back</h1>

      <p>
        Sign in to continue to Watch Together.
      </p>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Signing in..."
            : "Sign In"}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">
          Forgot your password?
        </Link>
      </p>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default Login;
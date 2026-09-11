// Register.jsx
// ------------------------------------------------------
// Registration page.
//
// Backend abhi available nahi hai.
// Currently frontend form structure and state
// management implement kar rahe hain.
// ------------------------------------------------------

import { useState } from "react";
import AuthInput from "../../components/auth/AuthInput";
import authService from "../../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await authService.register(formData);

      console.log(response);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <main>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        <button type="submit">
          Create Account
        </button>
      </form>
    </main>
  );
}

export default Register;
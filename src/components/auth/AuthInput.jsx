// AuthInput.jsx
// ------------------------------------------------------
// Reusable input component for authentication forms.
// Login, Register, Forgot Password etc. mein isi
// component ko reuse karenge.
// ------------------------------------------------------

function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="auth-input-group">
      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default AuthInput;
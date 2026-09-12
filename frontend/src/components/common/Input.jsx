// Input.jsx
// ------------------------------------------------------
// Reusable input component.
// ------------------------------------------------------

function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  maxLength,
  autoComplete,
}) {
  return (
    <div className="form-field">

      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : undefined
        }
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}

    </div>
  );
}

export default Input;
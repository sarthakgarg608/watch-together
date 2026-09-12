// AuthInput.jsx
// ------------------------------------------------------
// Reusable input component for authentication forms.
//
// Used by:
// - Login
// - Register
// - Forgot Password
// - Reset Password
// - Email Verification
//
// UI:
// - Premium dark input
// - Glassmorphism
// - Smooth hover/focus transitions
// - Responsive
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
    <div className="group space-y-2">

      {/* Label */}

      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-200 transition-colors duration-200 group-focus-within:text-violet-300"
      >
        {label}

        {required && (
          <span className="ml-1 text-violet-400">
            *
          </span>
        )}
      </label>


      {/* Input */}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 hover:bg-slate-900 focus:border-violet-500 focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
      />

    </div>
  );
}

export default AuthInput;
// Button.jsx
// ------------------------------------------------------
// Reusable button component.
//
// Instead of writing the same button structure
// throughout the application, we use this component.
//
// Later Tailwind styling will be added here.
// ------------------------------------------------------

function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      data-variant={variant}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
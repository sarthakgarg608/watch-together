// ErrorMessage.jsx
// ------------------------------------------------------
// Reusable error message.
// ------------------------------------------------------

function ErrorMessage({
  message,
  onRetry,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="error-message"
      role="alert"
    >
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
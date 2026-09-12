// Toast.jsx
// ------------------------------------------------------
// Reusable notification component.
// Later it can be connected to a global notification system.
// ------------------------------------------------------

function Toast({ message, type = "info", onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
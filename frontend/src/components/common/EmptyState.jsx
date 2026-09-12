// EmptyState.jsx
// ------------------------------------------------------
// Used when there is no data to display.
// ------------------------------------------------------

function EmptyState({
  title = "Nothing here yet",
  message = "",
  actionLabel = "",
  onAction,
}) {
  return (
    <section className="empty-state">

      <h2>{title}</h2>

      {message && (
        <p>{message}</p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}

    </section>
  );
}

export default EmptyState;
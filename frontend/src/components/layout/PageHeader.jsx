// PageHeader.jsx
// ------------------------------------------------------
// Reusable page heading.
// ------------------------------------------------------

function PageHeader({
  title,
  description = "",
  action = null,
}) {
  return (
    <header className="page-header">

      <div>

        <h1>
          {title}
        </h1>

        {description && (
          <p>
            {description}
          </p>
        )}

      </div>

      {action && (
        <div className="page-header-action">
          {action}
        </div>
      )}

    </header>
  );
}

export default PageHeader;
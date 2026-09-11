// PageHeader.jsx
// ------------------------------------------------------
// Reusable page heading component.
//
// Used by:
// - Dashboard
// - Create Room
// - Join Room
// - Other application pages
// ------------------------------------------------------

function PageHeader({
  title,
  description,
  action = null,
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
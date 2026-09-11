// PageContainer.jsx
// ------------------------------------------------------
// Common wrapper for application pages.
// ------------------------------------------------------

function PageContainer({
  children,
  className = "",
}) {
  return (
    <main
      className={`page-container ${className}`}
    >
      {children}
    </main>
  );
}

export default PageContainer;
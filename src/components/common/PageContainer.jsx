// PageContainer.jsx
// ------------------------------------------------------
// Shared page wrapper.
//
// Provides consistent:
// - Width
// - Horizontal padding
// - Vertical spacing
// - Dark cinematic background
// ------------------------------------------------------

function PageContainer({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative min-h-[calc(100vh-64px)]
        overflow-hidden
        bg-[#040611]
        px-4 py-8
        text-white
        sm:px-6
        lg:px-8 lg:py-12
        ${className}
      `}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
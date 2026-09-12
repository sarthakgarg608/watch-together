import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040611] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

          <p className="mt-4 text-xs text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Logged-in users should not see login/register pages.
   */
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
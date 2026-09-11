import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isHome = pathname === "/";

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isRoomPage = pathname.startsWith("/rooms/");

  /*
   * Home has its own cinematic navigation.
   *
   * Auth pages have their own centered layout.
   *
   * Room pages use their own room header.
   */
  const hideNavbar = isHome || isAuthPage || isRoomPage;

  const hideFooter = isHome || isAuthPage || isRoomPage;

  return (
    <div className="min-h-screen bg-[#040611] text-white">
      {!hideNavbar && <Navbar />}

      <main className="min-h-screen">
        {children}
      </main>

      {!hideFooter && (
        <footer className="border-t border-white/[0.06] bg-[#03040b]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold text-white">
                Watch Together
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Watch. Chat. Connect.
              </p>
            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Watch Together
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default AppLayout;
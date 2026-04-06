import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/navigation/Navbar";
import { isGuestOnlyLayoutPath } from "../helpers/routeHelpers";

export default function AppLayout() {
  const { pathname } = useLocation();
  const minimalChrome = isGuestOnlyLayoutPath(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {!minimalChrome ? <Navbar /> : null}
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      {!minimalChrome ? <Footer /> : null}
    </div>
  );
}

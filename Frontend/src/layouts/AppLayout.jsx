import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/navigation/Navbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

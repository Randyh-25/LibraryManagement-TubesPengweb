import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const mainClass = isAuthPage ? "content auth-content" : "content";

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <NavBar />
      <main className={mainClass}>{children}</main>
    </div>
  );
}

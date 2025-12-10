import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="content">{children}</main>
    </div>
  );
}

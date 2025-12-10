import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import BooksPage from "./pages/BooksPage";
import BorrowingsPage from "./pages/BorrowingsPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrowings" element={<BorrowingsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="card">
      <h1>Library Management</h1>
      <p>Kelola buku, pinjam, dan kembalikan dengan cepat.</p>
      <ul className="bullets">
        <li>Browse dan cari buku.</li>
        <li>Pinjam buku (maks 3) dan pantau status.</li>
        <li>Pengembalian dengan hitung denda otomatis.</li>
        <li>Riwayat transaksi untuk Member dan Librarian.</li>
      </ul>
      {!user ? (
        <div className="actions">
          <Link className="btn" to="/login">
            Login
          </Link>
          <Link className="btn ghost" to="/register">
            Register
          </Link>
        </div>
      ) : (
        <div className="actions">
          <Link className="btn" to="/books">
            Buka Buku
          </Link>
          <Link className="btn ghost" to="/borrowings">
            Lihat Peminjaman
          </Link>
        </div>
      )}
    </div>
  );
}

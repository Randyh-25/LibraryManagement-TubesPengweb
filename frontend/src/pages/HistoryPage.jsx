import { useEffect, useState } from "react";
import { borrowApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function HistoryPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await borrowApi.history(token, {
        member_id: user.role === "librarian" && memberId ? memberId : undefined,
      });
      setItems(res.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card">
      <h2>History</h2>
      <div className="filters">
        {user.role === "librarian" && (
          <input
            placeholder="Member ID (optional)"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        )}
        <button className="btn ghost" onClick={fetchData}>
          Refresh
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="list">
          {items.map((b) => (
            <div key={b.id} className="item">
              <div>
                <strong>{b.book.title}</strong> by {b.book.author}
                <div className="muted">
                  Borrow: {b.borrow_date} · Due: {b.due_date}
                </div>
                <div className="muted">Returned: {b.return_date || "Not yet"}</div>
                {b.fine > 0 && <div className="error">Fine: {b.fine}</div>}
              </div>
              <div className="muted">Member ID: {b.member_id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

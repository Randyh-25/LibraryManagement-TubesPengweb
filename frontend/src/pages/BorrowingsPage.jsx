import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { borrowApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BorrowingsPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const [activeOnly, setActiveOnly] = useState(true);
  const [memberId, setMemberId] = useState("");

  const queryParams = {
    active: activeOnly,
    member_id: user.role === "librarian" && memberId ? memberId : undefined,
  };

  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["borrowings", queryParams],
    queryFn: () => borrowApi.listBorrowings(token, queryParams),
    initialData: { items: [] },
  });

  const returnMutation = useMutation({
    mutationFn: (id) => borrowApi.returnBook(token, id),
    onSuccess: () => {
      toast.success("Book returned successfully");
      queryClient.invalidateQueries(["borrowings"]);
      queryClient.invalidateQueries(["books"]); // Also invalidate books query
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="card">
      <h2>Borrowings</h2>
      <div className="filters">
        <label className="inline">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active only
        </label>
        {user.role === "librarian" && (
          <input
            placeholder="Member ID (optional)"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        )}
        <button className="btn ghost" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="error">{error.message}</div>
      ) : (
        <div className="list">
          {items.items.map((b) => (
            <div key={b.id} className="item">
              <div>
                <strong>{b.book.title}</strong> by {b.book.author}
                <div className="muted">
                  Borrowed: {b.borrow_date} · Due: {b.due_date}
                </div>
                <div className="muted">Borrowing ID: {b.id}</div>
                {b.return_date && <div className="muted">Returned: {b.return_date}</div>}
                {b.fine > 0 && <div className="error">Fine: {b.fine}</div>}
              </div>
              <div className="actions">
                {!b.return_date && (
                  <button
                    className="btn ghost"
                    onClick={() => returnMutation.mutate(b.id)}
                    disabled={returnMutation.isPending}
                  >
                    Mark Returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

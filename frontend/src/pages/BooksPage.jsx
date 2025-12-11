import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi, borrowApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import BookForm from "../components/BookForm";

export default function BooksPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState(null);

  const isLibrarian = user?.role === "librarian";

  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["books", { search, category }],
    queryFn: () => bookApi.list({ search, category }),
    initialData: { items: [] },
  });

  const createMutation = useMutation({
    mutationFn: (newData) => bookApi.create(token, newData),
    onSuccess: () => {
      toast.success("Book created successfully");
      setEditing(null);
      queryClient.invalidateQueries(["books"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => bookApi.update(token, id, data),
    onSuccess: () => {
      toast.success("Book updated successfully");
      setEditing(null);
      queryClient.invalidateQueries(["books"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bookApi.remove(token, id),
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries(["books"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const borrowMutation = useMutation({
    mutationFn: (id) => borrowApi.borrow(token, id),
    onSuccess: () => {
      toast.success("Book borrowed successfully");
      queryClient.invalidateQueries(["books"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete book?")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = useMemo(() => items?.items || [], [items]);

  return (
    <div className="stack">
      <div className="card">
        <h2>Books</h2>
        <div className="filters">
          <input
            placeholder="Search title/author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button className="btn ghost" onClick={() => refetch()}>
            Apply
          </button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div className="error">{error.message}</div>
        ) : (
          <div className="list">
            {filtered.map((b) => (
              <div key={b.id} className="item">
                <div>
                  <strong>{b.title}</strong>
                  <div className="muted">
                    {b.author} · {b.category} · ISBN {b.isbn}
                  </div>
                  <div className="muted">
                    Available {b.copies_available}/{b.copies_total}
                  </div>
                </div>
                <div className="actions">
                  {isLibrarian && (
                    <>
                      <button className="ghost" onClick={() => setEditing(b)}>
                        Edit
                      </button>
                      <button
                        className="ghost"
                        onClick={() => handleDelete(b.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user && user.role === "member" && b.copies_available > 0 && (
                    <button
                      className="btn"
                      onClick={() => borrowMutation.mutate(b.id)}
                      disabled={borrowMutation.isPending}
                    >
                      Borrow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLibrarian && (
        <div className="card">
          <h3>{editing ? "Edit Book" : "Add Book"}</h3>
          <BookForm
            initial={editing || undefined}
            onSubmit={(data) =>
              editing
                ? updateMutation.mutate({ id: editing.id, data })
                : createMutation.mutate(data)
            }
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
    </div>
  );
}

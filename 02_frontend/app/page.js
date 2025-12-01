"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getTodos() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/todos`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getTodos();
  }, []);

  if (loading) return <div className="empty">Loading...</div>;
  if (error) return <div className="empty">Error: {error}</div>;

  const today = new Date();

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">My To-Do List</h1>
        <p className="subtitle">Track your tasks and deadlines</p>
      </header>

      {!todos || todos.length === 0 ? (
        <div className="empty">No tasks found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {todos.map((x) => {
            const deadlineDate = new Date(x.deadline);
            const isOverdue = x.status !== "finish" && deadlineDate < today;
            const cardClass = x.status === "finish" ? "finish" : isOverdue ? "overdue" : "";

            return (
              <article key={x.id} className={`card ${cardClass}`} tabIndex={0}>
                <div className="body">
                  <h3 className="card-title">{x.title}</h3>
                  {x.description && <p className="detail">{x.description}</p>}
                  <div className="meta">
                    <small>
                      Status: <span className="code">{x.status}</span> ·
                      Deadline: <span className="code">{deadlineDate.toLocaleDateString()}</span>
                    </small>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

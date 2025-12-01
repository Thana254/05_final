"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [editingId, setEditingId] = useState(null);

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  // Fetch todos from database
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiHost}/todos`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async () => {
  if (!form.title || !form.deadline) return alert("Title and deadline required");

  try {
    const newTodo = { ...form, status: "pending" }; // กำหนดค่า status
    const res = await fetch(`${apiHost}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    setForm({ title: "", description: "", deadline: "" });
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
};


  const handleEditTodo = (todo) => {
    setEditingId(todo.id);
    
    // แปลงวันที่เป็น YYYY-MM-DD เพื่อให้แสดงใน input type="date" ได้
    let formattedDeadline = "";
    if (todo.deadline) {
      const dateObj = new Date(todo.deadline);
      if (!isNaN(dateObj)) {
        formattedDeadline = dateObj.toISOString().split("T")[0];
      }
    }

    setForm({
      title: todo.title,
      description: todo.description || "",
      deadline: formattedDeadline,
      status: todo.status, // <--- เพิ่มบรรทัดนี้ เพื่อจำค่า Status เดิมไว้
    });
  };

  const handleUpdateTodo = async () => {
    if (!form.title || !form.deadline) return alert("Title and deadline required");

    try {
      // ใช้ค่าจาก form ทั้งหมดรวมถึง status ที่เราเพิ่มไปใน handleEditTodo แล้ว
      const updatedTodo = { ...form }; 
      
      const res = await fetch(`${apiHost}/todos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });

      if (!res.ok) throw new Error("Failed to update todo");
      
      setEditingId(null);
      setForm({ title: "", description: "", deadline: "" }); // Reset form
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!confirm("Are you sure to delete this todo?")) return;
    try {
      const res = await fetch(`${apiHost}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (todo) => {
    try {
      const updatedStatus = todo.status === "finish" ? "pending" : "finish";
      const res = await fetch(`${apiHost}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, status: updatedStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="empty">Loading...</div>;
  if (error) return <div className="empty">Error: {error}</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">My To-Do List</h1>
        <p className="subtitle">Track your tasks and deadlines</p>
      </header>

      {/* Form */}
      <section className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleInputChange}
        />
        {editingId ? (
          <button onClick={handleUpdateTodo}>Update Todo</button>
        ) : (
          <button onClick={handleAddTodo}>Add Todo</button>
        )}
      </section>

      {/* Todo List */}
      {!todos || todos.length === 0 ? (
        <div className="empty">No tasks found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {todos.map((x) => {
            const deadlineDate = x.deadline ? new Date(x.deadline) : null;
            const isValidDate = deadlineDate && !isNaN(deadlineDate.getTime());
            if (isValidDate) deadlineDate.setHours(0, 0, 0, 0);

            const isOverdue = x.status !== "finish" && isValidDate && deadlineDate < today;
            const cardClass = x.status === "finish" ? "finish" : isOverdue ? "overdue" : "";

            return (
              <article key={x.id} className={`card ${cardClass}`} tabIndex={0}>
                <div className="body">
                  <h3 className="card-title">
                    {x.title}{" "}
                    <input
                      type="checkbox"
                      checked={x.status === "finish"}
                      onChange={() => handleToggleStatus(x)}
                      title="Mark as finished"
                    />
                  </h3>
                  {x.description && <p className="detail">{x.description}</p>}
                  <div className="meta">
                    <small>
                      Status: <span className="code">{x.status}</span> ·
                      Deadline:{" "}
                      <span className="code">
                        {isValidDate ? deadlineDate.toISOString().split("T")[0] : "–"}
                      </span>
                    </small>
                  </div>
                  <div className="actions">
                    <button onClick={() => handleEditTodo(x)}>Edit</button>
                    <button onClick={() => handleDeleteTodo(x.id)}>Delete</button>
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

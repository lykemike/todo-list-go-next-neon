"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

interface Todo {
  ID: number;
  title: string;
  completed: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
TimeAgo.addDefaultLocale(en);
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      console.log(data);
      setTodos(data.todo || []);
      setError("");
    } catch (err) {
      setError("Failed to load todos. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });
      if (!response.ok) throw new Error("Failed to create todo");
      const data = await response.json();
      setTodos([data.todo, ...todos]);
      setNewTodo("");
      setError("");
    } catch (err) {
      setError("Failed to add todo");
      console.error(err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      const data = await response.json();
      setTodos(todos.map((t) => (t.ID === todo.ID ? data.todo : t)));
      setError("");
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter((t) => t.ID !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-base text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-pretty">
            GoNe To-Do (Go + Next.js)
          </h1>
          <p className="text-muted-foreground text-base">
            Organize and track your daily tasks
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-2 mb-8">
          {todos.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-muted-foreground mb-2">No tasks yet</div>
              <p className="text-sm text-muted-foreground">
                Add your first task above to get started
              </p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-border/80 transition-all hover:shadow-sm group"
              >
                <button
                  onClick={() => handleToggleTodo(todo)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    todo.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {todo.completed ? (
                    <CheckCircle2 size={24} className="text-primary" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>

                <div className="flex flex-col">
                  <span
                    className={`flex-1 text-base transition-all ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <ReactTimeAgo
                      date={new Date(todo.CreatedAt)}
                      locale="en-US"
                    />
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.ID)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Completed</span>
                <p className="text-2xl font-semibold text-foreground">
                  {completedCount}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining</span>
                <p className="text-2xl font-semibold text-foreground">
                  {remainingCount}
                </p>
              </div>
            </div>
            {todos.length > 0 && (
              <div className="h-8 w-full max-w-xs bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${(completedCount / todos.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

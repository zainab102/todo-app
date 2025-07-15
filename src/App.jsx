import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

function TodoInput({ addTodo }) {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(input);
    setInput("");
  };
  return (
    <form onSubmit={handleSubmit} className="input-container">
      <input
        type="text"
        placeholder="Add a new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="New todo input"
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList({ todos, selectedTab, toggleComplete, deleteTodo, restoreTodo, deleteForever }) {
  const filteredTodos = todos.filter((todo) => {
    if (selectedTab === "All") return !todo.deleted;
    if (selectedTab === "Open") return !todo.complete && !todo.deleted;
    if (selectedTab === "Completed") return todo.complete && !todo.deleted;
    if (selectedTab === "Deleted") return todo.deleted;
    return true;
  });

  if (filteredTodos.length === 0) return <p>No tasks here.</p>;

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <li
          key={todo.id}
          className={`todo-item ${todo.complete ? "todo-complete" : ""}`}
        >
          <input
            type="checkbox"
            checked={todo.complete}
            disabled={todo.deleted}
            onChange={() => toggleComplete(todo.id)}
            aria-label={`Mark task "${todo.input}" as complete`}
          />
          <p>{todo.input}</p>

          <div className="todo-buttons">
            {!todo.deleted ? (
              <button onClick={() => deleteTodo(todo.id)} aria-label="Delete task">
                Delete
              </button>
            ) : (
              <>
                <button onClick={() => restoreTodo(todo.id)} aria-label="Restore task">
                  Restore
                </button>
                <button onClick={() => deleteForever(todo.id)} aria-label="Delete task forever">
                  Delete Forever
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

const TABS = ["All", "Open", "Completed", "Deleted"];

export default function App() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedTab, setSelectedTab] = useState("All");
  const [history, setHistory] = useState([todos]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));

    if (JSON.stringify(history[historyIndex]) !== JSON.stringify(todos)) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(todos);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [todos, history, historyIndex]);

  const addTodo = useCallback(
    (input) => {
      if (!input.trim()) return;
      setTodos((prev) => [
        ...prev,
        { id: uuidv4(), input: input.trim(), complete: false, deleted: false },
      ]);
    },
    []
  );

  const toggleComplete = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, complete: !todo.complete } : todo
        )
      );
    },
    []
  );

  const deleteTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, deleted: true } : todo
        )
      );
    },
    []
  );

  const restoreTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, deleted: false } : todo
        )
      );
    },
    []
  );

  const deleteForever = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    []
  );

  const clearAll = useCallback(() => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (
          selectedTab === "Deleted" ||
          (selectedTab !== "Deleted" && !todo.deleted)
        ) {
          return { ...todo, deleted: true };
        }
        return todo;
      })
    );
  }, [selectedTab]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setTodos(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setTodos(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  return (
    <main>
      <h1>React To-Do List</h1>

      <nav className="tab-container" aria-label="Filter tasks by status">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${tab === selectedTab ? "tab-selected" : ""}`}
            onClick={() => setSelectedTab(tab)}
            aria-pressed={tab === selectedTab}
          >
            {tab}
          </button>
        ))}
      </nav>

      <TodoInput addTodo={addTodo} />

      <TodoList
        todos={todos}
        selectedTab={selectedTab}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        restoreTodo={restoreTodo}
        deleteForever={deleteForever}
      />

      <div className="main-buttons">
        <button onClick={clearAll} disabled={todos.length === 0}>
          Clear All Tasks
        </button>
        <button onClick={undo} disabled={historyIndex === 0}>
          Undo
        </button>
        <button onClick={redo} disabled={historyIndex === history.length - 1}>
          Redo
        </button>
      </div>
    </main>
  );
}

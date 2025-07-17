import React from "react";

export function TodoCard({
  todo,
  todoIndex,
  toggleComplete,
  deleteTodo,
  restoreTodo,
  deleteForever,
}) {
  const { id, text, complete, deleted } = todo;

  return (
    <article
      aria-label={`Todo item ${todoIndex + 1}: ${text}`}
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "0.75rem",
        backgroundColor: deleted ? "#fef2f2" : "#f9fafb",
        opacity: deleted ? 0.6 : 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <input
          type="checkbox"
          checked={complete}
          disabled={deleted}
          onChange={() => toggleComplete(id)}
          aria-label={`Mark todo ${text} as complete`}
          style={{ marginRight: "0.75rem", transform: "scale(1.2)" }}
        />
        <span
          style={{
            textDecoration: complete ? "line-through" : "none",
            color: complete ? "#6b7280" : "#111827",
            fontSize: "1rem",
          }}
        >
          {text}
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {!deleted ? (
          <button
            type="button"
            onClick={() => deleteTodo(id)}
            aria-label={`Delete todo ${text}`}
            style={buttonStyle}
          >
            🗑️
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => restoreTodo(id)}
              aria-label={`Restore todo ${text}`}
              style={buttonStyle}
            >
              ♻️
            </button>
            <button
              type="button"
              onClick={() => deleteForever(id)}
              aria-label={`Permanently delete todo ${text}`}
              style={{ ...buttonStyle, color: "red" }}
            >
              ❌
            </button>
          </>
        )}
      </div>
    </article>
  );
}

const buttonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.2rem",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  transition: "background-color 0.2s ease",
};
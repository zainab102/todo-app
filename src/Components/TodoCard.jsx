import React from "react";

export function TodoCard({
  todo,
  todoIndex,
  toggleComplete,
  deleteTodo,
  restoreTodo,
  deleteForever,
}) {
  const { input, complete, deleted } = todo;

  return (
    <div
      className={todo-card ${deleted ? "deleted" : complete ? "completed" : ""}}
      role="listitem"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: deleted ? "#f8d7da" : "#e7f5ff",
        marginBottom: 10,
      }}
    >
      <p
        className="todo-text"
        onClick={() => !deleted && toggleComplete(todoIndex)}
        style={{
          flex: 1,
          marginRight: 15,
          textDecoration: complete ? "line-through" : "none",
          cursor: deleted ? "default" : "pointer",
          userSelect: "none",
        }}
        title={deleted ? "This task is deleted" : "Click to toggle complete"}
      >
        {input}
      </p>

      <div className="todo-actions" style={{ display: "flex", gap: 8 }}>
        {!deleted ? (
          <>
            <button
              className="btn"
              onClick={() => toggleComplete(todoIndex)}
              title={complete ? "Mark as Incomplete" : "Mark as Done"}
            >
              {complete ? "Undo" : "Done"}
            </button>
            <button
              className="btn"
              onClick={() => deleteTodo(todoIndex)}
              title="Delete Task"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              className="btn"
              onClick={() => restoreTodo(todoIndex)}
              title="Restore Task"
            >
              Restore
            </button>
            <button
              className="btn danger"
              onClick={() => deleteForever(todoIndex)}
              title="Permanently Delete"
            >
              Delete Forever
            </button>
          </>
        )}
      </div>
    </div>
  );
}
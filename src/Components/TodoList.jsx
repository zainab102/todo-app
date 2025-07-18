import React, { useMemo } from "react";
import { TodoCard } from "./TodoCard";

export const TodoList = React.memo(function TodoList({
  todos,
  selectedTab,
  toggleComplete,
  deleteTodo,
  restoreTodo,
  deleteForever,
}) {
  // Filter todos based on selected tab
  const visibleTodos = useMemo(() => {
    switch (selectedTab) {
      case "All":
        return todos.filter((todo) => !todo.deleted);
      case "Completed":
        return todos.filter((todo) => todo.complete && !todo.deleted);
      case "Deleted":
        return todos.filter((todo) => todo.deleted);
      case "Open":
      default:
        return todos.filter((todo) => !todo.complete && !todo.deleted);
    }
  }, [todos, selectedTab]);

  if (visibleTodos.length === 0) {
    return (
      <p
        style={{
          fontStyle: "italic",
          color: "#6b7280",
          marginTop: "1rem",
          textAlign: "center",
        }}
        aria-live="polite"
      >
        No tasks to display in "{selectedTab}" tab.
      </p>
    );
  }

  return (
    <section aria-label={`${selectedTab} tasks list`}>
      {visibleTodos.map((todo) => {
        const todoIndex = todos.findIndex((t) => t.id === todo.id);
        return (
          <TodoCard
            key={todo.id}
            todoIndex={todoIndex}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            restoreTodo={restoreTodo}
            deleteForever={deleteForever}
          />
        );
      })}
    </section>
  );
});

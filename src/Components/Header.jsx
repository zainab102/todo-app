import React from 'react';

export function Header({ todos }) {
  // Counts
  const openTasksCount = todos.filter(todo => !todo.complete && !todo.deleted).length;
  const completedCount = todos.filter(todo => todo.complete && !todo.deleted).length;
  const deletedCount = todos.filter(todo => todo.deleted).length;

  // Pluralization
  const taskText = openTasksCount === 1 ? 'task' : 'tasks';

  return (
    <header style={{ marginBottom: '1.5rem' }}>
      <h1
        className="text-gradient"
        aria-live="polite"
        style={{ fontSize: '1.5rem', fontWeight: '600' }}
      >
        You have {openTasksCount} open {taskText}.
      </h1>

      {/* Optional: Show completed and deleted task counts */}
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        ✅ {completedCount} completed, 🗑️ {deletedCount} deleted
      </p>
    </header>
  );
}
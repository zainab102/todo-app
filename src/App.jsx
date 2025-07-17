import React, { useReducer, useEffect, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TodoInput from "./TodoInput";  // We'll update these next
import TodoList from "./TodoList";

const TABS = ["All", "Open", "Completed", "Deleted"];

const initialState = {
  todos: [],
  history: [],
  historyIndex: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT_TODOS": {
      const todos = action.payload;
      return {
        todos,
        history: [todos],
        historyIndex: 0,
      };
    }
    case "ADD_TODO": {
      const newTodo = {
        id: uuidv4(),
        input: action.payload.trim(),
        complete: false,
        deleted: false,
      };
      const newTodos = [...state.todos, newTodo];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "TOGGLE_COMPLETE": {
      const newTodos = state.todos.map(todo =>
        todo.id === action.payload ? { ...todo, complete: !todo.complete } : todo
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "DELETE_TODO": {
      const newTodos = state.todos.map(todo =>
        todo.id === action.payload ? { ...todo, deleted: true } : todo
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "RESTORE_TODO": {
      const newTodos = state.todos.map(todo =>
        todo.id === action.payload ? { ...todo, deleted: false } : todo
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "DELETE_FOREVER": {
      const newTodos = state.todos.filter(todo => todo.id !== action.payload);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "CLEAR_ALL": {
      const newTodos = state.todos.map(todo => {
        if (
          action.payload === "Deleted" ||
          (action.payload !== "Deleted" && !todo.deleted)
        ) {
          return { ...todo, deleted: true };
        }
        return todo;
      });
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newTodos);
      return {
        todos: newTodos,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        todos: state.history[newIndex],
        historyIndex: newIndex,
      };
    }
    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        todos: state.history[newIndex],
        historyIndex: newIndex,
      };
    }
    default:
      return state;
  }
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState("All");
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      dispatch({ type: "INIT_TODOS", payload: JSON.parse(stored) });
    }
  }, []);

  // Save todos to localStorage on change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  const addTodo = useCallback(
    (input) => {
      if (!input.trim()) return;
      dispatch({ type: "ADD_TODO", payload: input });
    },
    []
  );

  const toggleComplete = useCallback(
    (id) => dispatch({ type: "TOGGLE_COMPLETE", payload: id }),
    []
  );

  const deleteTodo = useCallback(
    (id) => dispatch({ type: "DELETE_TODO", payload: id }),
    []
  );

  const restoreTodo = useCallback(
    (id) => dispatch({ type: "RESTORE_TODO", payload: id }),
    []
  );

  const deleteForever = useCallback(
    (id) => {
      if (
        window.confirm("Are you sure you want to permanently delete this task?")
      ) {
        dispatch({ type: "DELETE_FOREVER", payload: id });
      }
    },
    []
  );

  const clearAll = useCallback(() => {
    if (
      window.confirm(
        selectedTab === "Deleted"
          ? "Delete all tasks permanently?"
          : "Delete all tasks in this tab?"
      )
    ) {
      dispatch({ type: "CLEAR_ALL", payload: selectedTab });
    }
  }, [selectedTab]);

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);

  return (
    <main>
      <h1>Plan & Conquer My To-Do List</h1>

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
        todos={state.todos}
        selectedTab={selectedTab}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        restoreTodo={restoreTodo}
        deleteForever={deleteForever}
      />

      <div className="main-buttons">
        <button onClick={clearAll} disabled={state.todos.length === 0}>
          Clear All Tasks
        </button>
        <button onClick={undo} disabled={state.historyIndex <= 0}>
          Undo
        </button>
        <button onClick={redo} disabled={state.historyIndex >= state.history.length - 1}>
          Redo
        </button>
      </div>
    </main>
  );
}

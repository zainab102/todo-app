import React, { useReducer, useEffect, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import TodoInput from "./Components/TodoInput";
import TodoList from "./Components/TodoList";

const TABS = ["All", "Open", "Completed", "Deleted"];

const initialTodos = JSON.parse(localStorage.getItem("todos")) || [];

function todosReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: uuidv4(),
          text: action.payload,
          complete: false,
          deleted: false,
          createdAt: Date.now(),
        },
      ];
    case "TOGGLE_COMPLETE":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, complete: !todo.complete } : todo
      );
    case "DELETE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, deleted: true } : todo
      );
    case "RESTORE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, deleted: false } : todo
      );
    case "DELETE_FOREVER":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);
  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(
    (text) => {
      if (text.trim() !== "") {
        dispatch({ type: "ADD_TODO", payload: text });
      }
    },
    [dispatch]
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
    (id) => dispatch({ type: "DELETE_FOREVER", payload: id }),
    []
  );

  return (
    <main>
      <header>
        <h1>My Todo App</h1>
        <nav>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              aria-pressed={selectedTab === tab}
              style={{
                marginRight: 8,
                fontWeight: selectedTab === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <TodoInput addTodo={addTodo} />

      <TodoList
        todos={todos}
        selectedTab={selectedTab}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        restoreTodo={restoreTodo}
        deleteForever={deleteForever}
      />
    </main>
  );
}
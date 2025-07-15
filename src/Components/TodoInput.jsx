import React, { useState } from "react";

export function TodoInput({ addTodo }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return; // Prevent empty todos
    addTodo(inputValue.trim());
    setInputValue(""); // Clear input after adding
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter new todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

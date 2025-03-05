import React from "react";

const TodoItem = ({ todo, onDragStart, deleteTodo }) => {
  return (
    <div
      className="todo-item"
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
    >
      <h3>{todo.todo}</h3>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
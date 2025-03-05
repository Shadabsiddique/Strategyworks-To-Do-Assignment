import React from "react";
import TodoItem from "./TodoItem";

const TodoLane = ({ status, todos, onDragStart, onDragOver, onDrop, deleteTodo }) => {
  return (
    <div
      className="todo-lane"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h2>{status}</h2>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDragStart={onDragStart}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoLane;
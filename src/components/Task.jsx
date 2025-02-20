import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { updateTodo, deleteTodo } from "../api";

const Task = ({ todo, index, setTodos, todos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleUpdate = async () => {
    const updatedTodo = { ...todo, todo: editText };
    await updateTodo(todo.id, updatedTodo);

    setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    setTodos(todos.filter((t) => t.id !== todo.id));
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided) => (
        <div className="task" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {isEditing ? (
            <>
              <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <h3>{todo.todo}</h3>
              <p>{todo.description || "No description"}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;

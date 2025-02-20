import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Lane = ({ status, todos, setTodos }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div className="lane" ref={provided.innerRef} {...provided.droppableProps}>
          <h2>{status}</h2>
          {todos.map((todo, index) => (
            <Task key={todo.id} todo={todo} index={index} setTodos={setTodos} todos={todos} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Lane;

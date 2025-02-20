import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { fetchTodos, updateTodo, addTodo } from "./api";
import Lane from "./components/Lane";
import "./style.css";

const lanes = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos().then((data) => setTodos(data));
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const updatedTodos = todos.map((todo) =>
      todo.id.toString() === draggableId ? { ...todo, status: destination.droppableId } : todo
    );

    setTodos([...updatedTodos]); // Ensure state updates
    await updateTodo(draggableId, { status: destination.droppableId });
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
  
    const newTask = { todo: newTodo, status: lanes.PENDING };
  
    const addedTodo = await addTodo(newTask);
  
    if (!addedTodo.id) {
      // Ensure the added todo has a valid id
      addedTodo.id = Date.now(); // Assign a temporary unique id
    }
  
    setTodos([...todos, addedTodo]);
    setNewTodo("");
  };
  

  const groupedTodos = todos.reduce((acc, todo) => {
    const status = todo.status || lanes.PENDING;
    if (!acc[status]) acc[status] = [];
    acc[status].push(todo);
    return acc;
  }, {});

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
          />
          <button onClick={handleAddTodo}>Add Todo</button>
        </div>
        <div className="board">
          {Object.keys(lanes).map((lane) => (
            <Lane key={lane} status={lanes[lane]} todos={groupedTodos[lanes[lane]] || []} setTodos={setTodos} />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;

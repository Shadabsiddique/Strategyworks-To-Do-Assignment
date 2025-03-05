import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTodoForm from "./components/AddTodoForm";
import TodoLane from "./components/TodoLane";
import "./App.css";

const API_URL = "https://dummyjson.com/todos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [draggedTodo, setDraggedTodo] = useState(null);

  // Fetch todos from the API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data); // Log the response
        setTodos(response.data.todos); // Set the todos array
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  // Handle drag start
  const handleDragStart = (e, todo) => {
    setDraggedTodo(todo);
    e.dataTransfer.setData("text/plain", todo.id);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTodo) {
      const updatedTodos = todos.map((todo) =>
        todo.id === draggedTodo.id
          ? { ...todo, completed: status === "Completed" }
          : todo
      );
      setTodos(updatedTodos);
      setDraggedTodo(null);
    }
  };

  // Create a new todo
  const addTodo = (title) => {
    const newTodo = {
      todo: title, // Use "todo" instead of "title"
      completed: false, // Default status is "Pending"
      userId: 1, // Default user ID
    };

    axios
      .post(`${API_URL}/add`, newTodo)
      .then((response) => {
        setTodos([...todos, response.data]); // Add the new todo to the list
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos); // Remove the deleted todo
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  // Group todos by status
  const groupedTodos = {
    Pending: todos.filter((todo) => !todo.completed), // "Pending" todos
    Completed: todos.filter((todo) => todo.completed), // "Completed" todos
  };

  return (
    <div className="app">
      <h1>StrategyWerks Todo Board</h1>
      <AddTodoForm addTodo={addTodo} />
      <div className="todo-board">
        {Object.entries(groupedTodos).map(([status, todos]) => (
          <TodoLane
            key={status}
            status={status}
            todos={todos}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            deleteTodo={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
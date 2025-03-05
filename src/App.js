import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTodoForm from "./components/AddTodoForm";
import TodoLane from "./components/TodoLane";
import "./App.css";

const API_URL = "https://dummyjson.com/todos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [draggedTodo, setDraggedTodo] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data);
        setTodos(response.data.todos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const handleDragStart = (e, todo) => {
    setDraggedTodo(todo);
    e.dataTransfer.setData("text/plain", todo.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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

  const addTodo = (title) => {
    const newTodo = {
      todo: title, 
      completed: false, 
      userId: 1, 
    };

    axios
      .post(`${API_URL}/add`, newTodo)
      .then((response) => {
        setTodos([...todos, response.data]); 
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos); 
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const groupedTodos = {
    Pending: todos.filter((todo) => !todo.completed), 
    Completed: todos.filter((todo) => todo.completed), 
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
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTodoForm from "./components/AddTodoForm";
import TodoLane from "./components/TodoLane";
import "./App.css";

const API_URL = "https://dummyjson.com/todos";

const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("API Response:", response.data);
        setTodos(response.data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  return [todos, setTodos];
};

const useDragAndDrop = (todos, setTodos) => {
  const [draggedTodo, setDraggedTodo] = useState(null);

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

  return { handleDragStart, handleDragOver, handleDrop };
};

const App = () => {
  const [todos, setTodos] = useTodos();
  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(todos, setTodos);

  const addTodo = async (title) => {
    const newTodo = {
      todo: title,
      completed: false,
      userId: 1,
    };

    try {
      const response = await axios.post(`${API_URL}/add`, newTodo);
      setTodos([response.data, ...todos]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
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
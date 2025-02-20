const API_BASE_URL = "https://dummyjson.com/todos";

// Fetch all todos
export const fetchTodos = async () => {
  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  return data.todos;
};

// Add a new todo
export const addTodo = async (todo) => {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const data = await response.json();
  
    return { ...todo, id: data.id || Date.now() }; // Assign a fallback id if missing
  };
  

// Update a todo
export const updateTodo = async (id, updatedTodo) => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  return updatedTodo;
};

// Delete a todo
export const deleteTodo = async (id) => {
  await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  return id;
};

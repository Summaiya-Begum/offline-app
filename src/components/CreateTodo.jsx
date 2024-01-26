import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTodo = () => {
  // State to manage form input values
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [id, setId] = useState("");
  const [todo, setTodo] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(); // Assuming userId is a constant value
  const [apiData, setApiData] = useState([]);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new todo object based on form input values
      const newTodo = {
        id,
        todo,
        completed,
        userId,
      };

      // Update local state immediately
      setApiData((prevData) =>
        Array.isArray(prevData) ? [...prevData, newTodo] : [newTodo]
      );

      if (!navigator.onLine) {
        // If offline, add the new todo to the cache with to_added: true
        const cache = await caches.open("app-cache");
        const cachedResponse = await cache.match("todos");
        console.log(cachedResponse);
        if (cachedResponse) {
          const cachedData = await cachedResponse.json();

          const updatedData = [...cachedData, { ...newTodo, to_added: true }];

          console.log(updatedData, "updated data");
          // Instead of using cache.put, remove the old entry and add a new one
          await cache.delete("todos");
          await cache.put("todos", new Response(JSON.stringify(updatedData)));
        }
        navigate("/todos");
        return;
      }

      // If online, send POST request to add the new todo
      const response = await fetch(
        "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }
      navigate("/todos");
      // After successful POST, perform a new GET request to update setApiData
      const getResponse = await fetch(
        "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos"
      );
      const newData = await getResponse.json();
      setApiData(newData);

      // Fetch the updated data from the server and update the cache
      const cache = await caches.open("app-cache");
      cache.put("todos", new Response(JSON.stringify(newData)));
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            ID:
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="todo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Todo:
          </label>
          <input
            id="todo"
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="completed"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Completed:
          </label>
          <input
            id="completed"
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted(!completed)}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            UserId:
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Todo
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;

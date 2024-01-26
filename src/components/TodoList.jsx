import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TodoList = () => {
  // State to hold online/offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // State for API data
  const [apiData, setApiData] = useState(null);

  // Effect to fetch data from API on mount
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos"
      );
      const data = await response.json();
      setApiData(data);

      // Update cache on API data retrieval
      const cache = await caches.open("app-cache");
      cache.put("todos", new Response(JSON.stringify(data)));
    } catch (error) {
      console.error("Error fetching data:", error);

      // If fetch fails, try to retrieve data from the cache
      const cache = await caches.open("app-cache");
      const cachedResponse = await cache.match("todos");
      // console.log(cachedResponse);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        setApiData(cachedData);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Effect to check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // Effect for online data synchronization
  useEffect(() => {
    const syncData = async () => {
      if (isOnline) {
        try {
          // Perform online data synchronization
          // You can fetch the latest data from the server and update the cache
          const response = await fetch(
            "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos"
          );
          const data = await response.json();

          const cache = await caches.open("app-cache");
          cache.put("todos", new Response(JSON.stringify(data)));
        } catch (error) {
          console.error("Error syncing data:", error);
        }
      }
    };

    syncData();
  }, [isOnline]);

  const handleStatusToggle = async (id) => {
    try {
      // Fetch the current todo details
      const currentTodo = apiData.find((todo) => todo._id === id);

      // Create a new object with all properties except '_id'
      const updatedTodo = { ...currentTodo, completed: !currentTodo.completed };
      delete updatedTodo._id;

      // Update local state immediately
      setApiData((prevData) =>
        prevData.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      if (!isOnline) {
        const cache = await caches.open("app-cache");
        const cachedResponse = await cache.match("todos");
        if (cachedResponse) {
          const cachedData = await cachedResponse.json();

          const updatedData = cachedData.map((todo) =>
            todo._id === id
              ? { ...todo, completed: !todo.completed, to_updated: true }
              : todo
          );

          // Instead of using cache.put, remove the old entry and add a new one
          await cache.delete("todos");
          await cache.put("todos", new Response(JSON.stringify(updatedData)));
        }
        return;
      }

      // If online, send PUT request to update status
      const response = await fetch(
        `https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // After successful PUT, perform a new GET request to update setApiData
      const getResponse = await fetch(
        "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos"
      );
      const newData = await getResponse.json();
      setApiData(newData);
      // Fetch the updated data from the server and update the cache
      const cache = await caches.open("app-cache");
      cache.put("todos", new Response(JSON.stringify(newData)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setApiData((prevData) =>
        prevData
          .map((todo) => {
            if (todo.to_added && todo._id === id) {
              // If to_added is true, remove the todo
              return null;
            } else if (todo._id === id) {
              // If todo._id matches the specified id, mark it for deletion
              return { ...todo, to_deleted: true };
            } else {
              // Otherwise, keep the todo as is 
              return todo;
            }
          })
          .filter(Boolean)
      );

      console.log(apiData, 'apiData');
      
      if (!isOnline) {
        const cache = await caches.open("app-cache");
        const cachedResponse = await cache.match("todos");

        if (cachedResponse) {
          const cachedData = await cachedResponse.json();

          // Modify the todos based on the condition
          const updatedData = cachedData
            .map((todo) => {
              if (todo.to_added && todo._id === id) {
                // If to_added is true, remove the todo
                return null;
              } else if (todo._id === id) {
                // If todo._id matches the specified id, mark it for deletion
                return { ...todo, to_deleted: true };
              } else {
                // Otherwise, keep the todo as is
                return todo;
              }
            })
            .filter(Boolean); // Filter out null values (todos to be removed)

          console.log(updatedData, "updatedData");
          // Instead of using cache.put, remove the old entry and add a new one
          await cache.delete("todos");
          await cache.put("todos", new Response(JSON.stringify(updatedData)));
        }
        return;
      }

      // If online, send DELETE request to remove the todo
      const response = await fetch(
        `https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // After successful DELETE, perform a new GET request to update setApiData
      const getResponse = await fetch(
        "https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos"
      );
      const newData = await getResponse.json();
      setApiData(newData);

      // Fetch the updated data from the server and update the cache
      const cache = await caches.open("app-cache");
      cache.put("todos", new Response(JSON.stringify(newData)));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    const getAllCachesData = async () => {
      try {
        const cache = await caches.open("app-cache");
        const keys = await cache.keys();
        const dataPromises = keys.map(async (request) => {
          const cachedResponse = await cache.match(request);
          const cachedData = await cachedResponse.json();
          return { request, data: cachedData };
        });
        const allData = await Promise.all(dataPromises);
        return allData;
      } catch (error) {
        console.error("Error getting data from cache:", error);
        return null;
      }
    };

    const onlinePutRequest = async () => {
      const allCachesData = await getAllCachesData();

      for (const { request, data } of allCachesData) {
        data.forEach(async (el) => {
          if (el.to_updated) {
            const newPayload = { ...el };
            delete newPayload.to_updated;
            delete newPayload._id;

            console.log(el, newPayload);
            // Send a PUT request to update the server
            try {
              const response = await fetch(
                `https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos/${el._id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newPayload),
                }
              );

              if (!response.ok) {
                throw new Error(`Failed to update data for ${request.url}`);
              }
            } catch (error) {
              console.error("Error updating data:", error);
            }
          }
        });
      }
      fetchData();
    };

    const onlinePostRequest = async () => {
      const allCachesData = await getAllCachesData();

      for (const { request, data } of allCachesData) {
        data.forEach(async (el) => {
          if (el.to_added) {
            const newPayload = { ...el };
            delete newPayload.to_added;
            // delete newPayload._id;

            console.log(el, newPayload);
            // Send a PUT request to update the server
            try {
              const response = await fetch(
                `https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newPayload),
                }
              );

              if (!response.ok) {
                throw new Error(`Failed to update data for ${request.url}`);
              }
            } catch (error) {
              console.error("Error updating data:", error);
            }
          }
        });
      }
      fetchData();
    };

    const onlineDeleteRequest = async () => {
      const allCachesData = await getAllCachesData();

      for (const { request, data } of allCachesData) {
        data.forEach(async (el) => {
          if (el.to_deleted) {
            const newPayload = { ...el };
            delete newPayload.to_deleted;
            delete newPayload._id;

            console.log(el, newPayload);

            // Send a DELETE request to update the server
            try {
              const response = await fetch(
                `https://crudcrud.com/api/041504df2d0f4ce3a001dba64ba2630f/todos/${el._id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error(`Failed to delete data for ${request.url}`);
              }
            } catch (error) {
              console.error("Error deleting data:", error);
            }
          }
        });
      }

      fetchData(); // Assuming fetchData is a function you've defined elsewhere
    };

    if (navigator.onLine) {
      onlinePutRequest();
      onlineDeleteRequest();
      onlinePostRequest();
    }
  }, [navigator.onLine]);

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="text-2xl font-bold">Todo List</h2>
        <Link to={"/create-todo"}>
          <button className="px-4 py-1.5 text-center text-[15px] font-bold font-mono rounded-md bg-amber-300">
            Create Todo
          </button>
        </Link>
      </div>
      <div className="py-6 font-bold m-auto flex justify-center items-center text-[20px]">
        <p>Online Status: {isOnline ? "Online" : "Offline"}</p>
      </div>
      <div className="">
        <table className="bg-white w-[100%] h-[100%]">
          <thead className="bg-white">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="h-full overflow-y-scroll">
            {apiData
              ?.filter((todo) => !todo?.to_deleted)
              ?.map((todo) => (
                <tr
                  key={todo._id}
                  className={`hover:bg-gray-100 text-center `}
                  style={{ cursor: "pointer" }}
                >
                  <td className="py-2 px-4 border-b">{todo.id}</td>
                  <td className="py-2 px-4 border-b">{todo.todo}</td>
                  <td
                    className={`py-2 px-4  border-b flex gap-3 justify-center items-center `}
                  >
                    <button
                      className={`px-3 py-1.5 text-center text-[14px] font-bold font-mono rounded-md ${
                        todo.completed
                          ? "bg-green-500 text-black"
                          : "bg-red-600 text-black"
                        }  `}
                        onClick={() => handleStatusToggle(todo._id)}
                    >
                      {todo.completed ? "Completed" : "Not Completed"}
                    </button>
                    <button
                      className="   bg-red-600 text-white px-3 py-1.5 text-center text-[14px] font-bold font-mono rounded-md"
                      onClick={() => handleDeleteTodo(todo._id)}
                    >
                      Delete Todo
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;

// 041504df2d0f4ce3a001dba64ba2630f

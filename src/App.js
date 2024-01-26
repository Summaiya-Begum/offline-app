import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import UpdateTodo from "./components/UpdateTodo";
import { useRecoilState } from "recoil";
import { isSidebarOpenState } from "./atom";
import TodoList from "./components/TodoList";
import CreateTodo from "./components/CreateTodo";
import Employees from "./components/Employees";
import EmployeeForm from "./components/EmployeesForm";
const NavbarRight = () => {
  const location = useLocation();
  const currentRoute = location.pathname.split("/").pop(); // Get the last part of the pathname
  const capitalizedRoute =
    currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1);

  return (
    <div className="flex items-center">
      <span className="text-black font-mono">
        CURRENT LOCATION: {capitalizedRoute}
      </span>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState);

  return (
    <>
      <Router>
        <div className="flex  h-[100%]">
          <Sidebar />
          <div
            className={`flex flex-col ${
              isSidebarOpen ? "w-[85%]" : "w-[95%]"
            } `}
          >
            <div className="bg-gray-300 p-4 w-full h-[8vh]">
              <NavbarRight />
            </div>
            <div className=" w-full h-[92vh] overflow-hidden overflow-y-scroll">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/todos" element={<TodoList />} />
                <Route path="/users" element={<Users />} />
                <Route path="/create-todo" element={<CreateTodo />} />
                {/* <Route path="/update-todo" element={<UpdateTodo />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employee/:id" element={<EmployeeForm />} /> */}
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;

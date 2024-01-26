// src/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isSidebarOpenState } from "../atom";
import { useRecoilState } from "recoil";
import todoIcon from "../assets/todosvg.svg";
const DashboardIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.4998 0.666748H1.49984C1.27882 0.666748 1.06686 0.754545 0.910582 0.910826C0.754301 1.06711 0.666504 1.27907 0.666504 1.50008V16.5001C0.666504 16.7211 0.754301 16.9331 0.910582 17.0893C1.06686 17.2456 1.27882 17.3334 1.49984 17.3334H16.4998C16.7208 17.3334 16.9328 17.2456 17.0891 17.0893C17.2454 16.9331 17.3332 16.7211 17.3332 16.5001V1.50008C17.3332 1.27907 17.2454 1.06711 17.0891 0.910826C16.9328 0.754545 16.7208 0.666748 16.4998 0.666748ZM5.6665 15.6667H2.33317V2.33341H5.6665V15.6667ZM15.6665 15.6667H7.33317V9.83341H15.6665V15.6667ZM15.6665 8.16675H7.33317V2.33341H15.6665V8.16675Z"
      fill="#F4F5F6"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0919 9.59169C12.9089 8.94891 13.5052 8.06746 13.7979 7.06997C14.0906 6.07249 14.0652 5.00858 13.7251 4.02625C13.385 3.04391 12.7471 2.19202 11.9003 1.58907C11.0535 0.986122 10.0398 0.662109 9.00024 0.662109C7.9607 0.662109 6.947 0.986122 6.10018 1.58907C5.25336 2.19202 4.61553 3.04391 4.27542 4.02625C3.93531 5.00858 3.90984 6.07249 4.20254 7.06997C4.49525 8.06746 5.09158 8.94891 5.90858 9.59169C4.50864 10.1526 3.28715 11.0828 2.37432 12.2833C1.46149 13.4838 0.891544 14.9094 0.725241 16.4084C0.713204 16.5178 0.722838 16.6285 0.753596 16.7342C0.784353 16.8399 0.835631 16.9386 0.904501 17.0245C1.04359 17.1979 1.24589 17.309 1.46691 17.3334C1.68792 17.3577 1.90954 17.2932 2.08301 17.1541C2.25648 17.015 2.3676 16.8127 2.39191 16.5917C2.5749 14.9627 3.35165 13.4582 4.57376 12.3657C5.79587 11.2732 7.37766 10.6692 9.01691 10.6692C10.6562 10.6692 12.2379 11.2732 13.4601 12.3657C14.6822 13.4582 15.4589 14.9627 15.6419 16.5917C15.6646 16.7965 15.7623 16.9856 15.9162 17.1225C16.0701 17.2595 16.2692 17.3346 16.4752 17.3334H16.5669C16.7854 17.3082 16.985 17.1978 17.1224 17.0261C17.2597 16.8544 17.3237 16.6353 17.3002 16.4167C17.1332 14.9135 16.5601 13.4842 15.6426 12.2819C14.7251 11.0795 13.4977 10.1496 12.0919 9.59169ZM9.00024 9.00002C8.34097 9.00002 7.69651 8.80453 7.14834 8.43825C6.60018 8.07198 6.17294 7.55139 5.92064 6.9423C5.66835 6.33321 5.60234 5.66299 5.73096 5.01639C5.85957 4.36979 6.17704 3.77584 6.64322 3.30967C7.10939 2.84349 7.70334 2.52602 8.34994 2.39741C8.99654 2.26879 9.66677 2.3348 10.2759 2.58709C10.8849 2.83938 11.4055 3.26662 11.7718 3.81479C12.1381 4.36295 12.3336 5.00742 12.3336 5.66669C12.3336 6.55074 11.9824 7.39859 11.3573 8.02371C10.7321 8.64883 9.8843 9.00002 9.00024 9.00002Z"
      fill="#F4F5F6"
    />
  </svg>
);

const TodoIcon = () => (
  <img
    src={todoIcon}
    alt="todosvg"
    style={{
      width: "18px",
      height: "18px",
    }}
  />
);

const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isLinkActive = (path) => {
    return path === activeLink;
  };

  const renderLinkContent = (path, icon, label) => {
    return (
      <Link
        to={path}
        className={`w-full flex items-center mb-2 p-2 rounded ${
          isLinkActive(path) ? "bg-[#5776d4] " : ""
        }`}
        onClick={() => handleLinkClick(path)}
      >
        {icon && (
          <span className={`${isSidebarOpen ? "mr-2" : ""}`}>{icon()}</span>
        )}
        {isSidebarOpen && (
          <span className="text-white no-underline">{label}</span>
        )}
      </Link>
    );
  };

  const variants = {
    open: { width: "15%", transition: { duration: 0.3 } },
    close: { width: "5%", transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`bg-gray-800 text-white h-screen w-[15%] p-4 flex flex-col items-center `}
        variants={variants}
        initial="open"
        animate={isSidebarOpen ? "open" : "close"}
      >
        <div className="mb-4 p-2 flex justify-center items-center">
          <motion.h1
            className="text-[14px] font-bold cursor-pointer"
            onClick={toggleSidebar}
            initial={{ x: -100, opacity: 0 }}
            animate={
              isSidebarOpen ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }
            }
            transition={{ duration: 0.3 }}
          >
            {isSidebarOpen ? <motion.p>PWA React App</motion.p> : "PRA"}
          </motion.h1>
        </div>
        <ul
          className={`list-none flex flex-col gap-1 font-normal text-[14px] ${
            !isSidebarOpen
              ? "items-center justify-center"
              : "p-1 items-start justify-start w-full"
          }`}
        >
          {renderLinkContent("/dashboard", DashboardIcon, "Dashboard")}
          {renderLinkContent("/todos", TodoIcon, "Todo List")}
          {renderLinkContent("/users", UserIcon, "Users")}
          {/* {renderLinkContent('/employees', UserIcon, 'Employees')} */}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;

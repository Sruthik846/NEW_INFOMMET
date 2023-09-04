import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";
import { Route, Routes, Link } from "react-router-dom";
import Logout from "../Logout/Logout";
import Home from "../Home/Home";
import Hall from "../Halls/Hall";
import Users from "../Users/Users";
import Meetings from "../Meetings/Meetings";
import { AuthContext } from "../Context/Context";
import { useContext } from "react";

function TopNav({ data, path }) {
  const { userTypeCooklie } = useContext(AuthContext);
  const restrictedLinks = {
    user: ["/users", "/hall"], // Restricted links for the "user" user type
    admin: [], // Empty array for unrestricted links of "admin" user type
  };

  const hasRestrictedLinks =
    userTypeCooklie && restrictedLinks[userTypeCooklie].length > 0;

  return (
    <nav className="bg-white lg:bg-gray-800 lg:text-gray-300 md:bg-gray-800 md:text-gray-300 shadow-lg font-sans fixed w-full">
      <div className=" mx-auto px-6">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="md:hidden py-3">
              {path === "/home" ? (
                <Link to="/home" className="flex gap-3 font-medium">
                  <FaArrowLeft></FaArrowLeft>
                  {data}
                  <Routes>
                    <Route path="/home" element={<Home></Home>} />
                  </Routes>
                </Link>
              ) : path === "/hall" ? (
                <Link to="/hall" className="flex gap-3 font-medium">
                  <FaArrowLeft></FaArrowLeft>
                  {data}
                  <Routes>
                    <Route path="/hall" element={<Hall></Hall>} />
                  </Routes>
                </Link>
              ) : path === "/users" ? (
                <Link to="/users" className="flex gap-3 font-medium">
                  <FaArrowLeft></FaArrowLeft>
                  {data}
                  <Routes>
                    <Route path="/users" element={<Users></Users>} />
                  </Routes>
                </Link>
              ) : (
                <Link to="/meeting" className="flex gap-3 font-medium">
                  <FaArrowLeft></FaArrowLeft>
                  {data}
                  <Routes>
                    <Route path="/meeting" element={<Meetings></Meetings>} />
                  </Routes>
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <div>
                <img
                  src="https://infolksgroup.com/images/logo/logo-white.svg"
                  alt="Logo"
                  className="h-10 mr-2"
                  // w-8
                />
              </div>

              <Link
                to="/home"
                className="py-4 px-6 text-sm text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
              >
                <div className="relative">
                  Home
                  <Routes>
                    <Route path="/home" element={<Home></Home>} />
                  </Routes>
                </div>
              </Link>
              {!hasRestrictedLinks && (
                <Link
                  to="/users"
                  className={
                    data === "Users" || path === "/users"
                      ? "py-4 px-6 mt-1 text-sm border-b-2 border-blue-800 lg:border-gray-100 lg:text-gray-100 md:border-gray-100 md:text-gray-100 text-blue-800 font-semibold hover:text-blue-600 transition duration-300"
                      : "py-4 px-6 text-sm text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
                  }
                >
                  <div className="relative">
                    Users
                    <Routes>
                      <Route path="/users" element={<Users></Users>} />
                    </Routes>
                  </div>
                </Link>
              )}

              <Link
                to="/meeting"
                className={
                  data === "Meetings" || path === "/meeting"
                    ? "py-4 px-4 mt-1 text-sm border-b-2 border-blue-800 lg:border-gray-100 lg:text-gray-100 md:border-gray-100 md:text-gray-100 text-blue-800 font-semibold hover:text-blue-600 transition duration-300"
                    : "py-4 px-4 text-sm text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
                }
              >
                <div className="relative">
                  Meetings
                  <Routes>
                    <Route path="/meeting" element={<Meetings></Meetings>} />
                  </Routes>
                </div>
              </Link>

              {!hasRestrictedLinks && (
                <Link
                  to="/hall"
                  className={
                    data === "Hall" || path === "/hall"
                      ? "py-4 px-6 mt-1 text-sm border-b-2 border-blue-800 lg:border-gray-100 lg:text-gray-100 md:border-gray-100 md:text-gray-100 text-blue-800 font-semibold hover:text-blue-600 transition duration-300 text-center"
                      : "py-4 px-6 text-sm text-gray-300 font-semibold hover:text-blue-500 transition duration-300 text-center"
                  }
                >
                  <div className="relative">
                    &nbsp; Hall &nbsp;
                    <Routes>
                      <Route path="/hall" element={<Hall></Hall>} />
                    </Routes>
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 ">
            <div className="py-2 px-2 font-medium rounded  transition duration-300">
              <Menu>
                {({ open }) => (
                  <div className="relative">
                    <Menu.Button>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </div>
                    </Menu.Button>
                    <Transition
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="absolute right-0 origin-top-right bg-white border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-800 text-white"
                                  : "text-gray-900"
                              } group rounded-md items-center px-4 py-3 text-sm `}
                            >
                              <Logout></Logout>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </div>
                )}
              </Menu>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <div className="outline-none mobile-menu-button hover:bg-blue hover:text-white">
              <Menu>
                {({ open }) => (
                  <div className="relative">
                    <Menu.Button>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </div>
                    </Menu.Button>
                    <Transition
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="absolute right-0 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-800 text-white"
                                  : "text-gray-900"
                              } group rounded-md items-center px-4 py-3 text-sm `}
                            >
                              <Logout></Logout>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </div>
                )}
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;

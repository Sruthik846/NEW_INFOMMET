import React from "react";
import { Menu, Transition } from "@headlessui/react";
import Logout from "../Logout/Logout";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const name = Cookies.get("name");
  return (
    <div>
      {/* NAVBAR */}
      <nav className=" dark:bg-gray-900 w-full z-20 top-0 left-0 border-gray-200 dark:border-gray-600 bg-gray-800 font-sans">
        <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex ml-2 text-gray-500">
            <FontAwesomeIcon
              icon={faUserCircle}
              color="white"
              className="p-1 text-xl"
            />
            <p className=" block text-md font-semibold text-white py-1">
              {name}
            </p>
          </div>

          {/* <div className='class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky"'>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-color dark:text-white">
              HOME
            </h3>
          </div> */}
          <div className=" grid grid-cols-2 gap-1 md:order-2 items-right">
            <Menu>
              {({ open }) => (
                <div className="relative">
                  <Menu.Button>
                    <div className="relative">
                      <FontAwesomeIcon icon={faEllipsisV} color="white" />
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
                      className="absolute right-0 origin-top-right bg-white  border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-blue-600 text-white"
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
      </nav>
    </div>
  );
}

export default Navbar;

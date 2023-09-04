import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { FaUsers, FaMeetup, FaHotel } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Users from "../Users/Users";
import Meetings from "../Meetings/Meetings";
import Hall from "../Halls/Hall";
import BottomNavigation from "../Navbar/BottomNavigation";
import { AuthContext } from "../Context/Context";
import { useContext } from "react";

function Home() {
  const { userTypeCooklie } = useContext(AuthContext);
  const restrictedLinks = {
    user: ["/users", "/hall"], // Restricted links for the "user" user type
    admin: [], // Empty array for unrestricted links of "admin" user type
  };

  const hasRestrictedLinks =
    userTypeCooklie && restrictedLinks[userTypeCooklie].length > 0;

  return (
    <div className="font-sans">
      <Navbar></Navbar>
      {/*<MOBILE> CONTENT */}
      <div className="container mx-auto md:hidden">
        <div className="p-6 md:p-8 lg:p-10 xl:p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 items-center justify-center">
          {!hasRestrictedLinks && (
            <Link to="/users">
              <div
                className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-gray-100 "
                style={{ borderRadius: "20px" }}
              >
                <div className="px-6 py-4 flex flex-col justify-center items-center hover:text-blue-500">
                  <FaUsers className="w-full h-10 mb-2 dark:text-white-400  "></FaUsers>
                  <div className="font-bold text-xl mb-2">
                    Users
                    <Routes>
                      <Route path="/users" element={<Users></Users>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className=" md:p-8 lg:p-10 xl:p-10 gap-2 items-center justify-center grid grid-cols-2 px-6">
          <Link to="/meeting">
            <div
              className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-gray-300"
              style={{ borderRadius: "20px" }}
            >
              <div className="px-6 py-4 flex flex-col justify-center items-center hover:text-blue-500">
                <FaMeetup className="w-full h-10 mb-2 dark:text-white-400"></FaMeetup>
                <div className="font-bold text-xl mb-2">
                  Meetings
                  <Routes>
                    <Route path="/meeting" element={<Meetings></Meetings>} />
                  </Routes>
                </div>
              </div>
            </div>
          </Link>

          {!hasRestrictedLinks && (
            <Link to="/hall">
              <div
                className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-blue-800"
                style={{ borderRadius: "20px" }}
              >
                <div className="px-6 py-4 flex flex-col justify-center items-center hover:text-blue-500">
                  <FaHotel className="w-full h-10 mb-2 dark:text-white-400 text-white"></FaHotel>
                  <div className="font-bold text-xl mb-2 text-white">
                    Halls
                    <Routes>
                      <Route path="/hall" element={<Hall></Hall>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <BottomNavigation></BottomNavigation>
      </div>

      {/* DESKTOP VIEW */}
      <div className="container mx-auto hidden md:grid">
        <div className=" md:p-8 lg:p-10 xl:p-10 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-center">
          {!hasRestrictedLinks && (
            <Link to="/users" className="py-10">
              <div
                className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-gray-100 "
                style={{ borderRadius: "20px" }}
              >
                <div className="px-6 py-4 flex flex-col justify-center items-center ">
                  <FaUsers className="w-full h-10 mb-2 dark:text-white-400  "></FaUsers>
                  <div className="font-bold text-xl mb-2">
                    Users
                    <Routes>
                      <Route path="/users" element={<Users></Users>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <Link to="/meeting" className="py-10">
            <div
              className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-gray-300"
              style={{ borderRadius: "20px" }}
            >
              <div className="px-6 py-4 flex flex-col justify-center items-center ">
                <FaMeetup className="w-full h-10 mb-2 dark:text-white-400"></FaMeetup>
                <div className="font-bold text-xl mb-2">
                  Meetings
                  <Routes>
                    <Route path="/meeting" element={<Meetings></Meetings>} />
                  </Routes>
                </div>
              </div>
            </div>
          </Link>

          {!hasRestrictedLinks && (
            <Link to="/hall" className="py-10">
              <div
                className="rounded overflow-hidden shadow-lg bg-opacity-100 p-4 color-black bg-blue-800"
                style={{ borderRadius: "20px" }}
              >
                <div className="px-6 py-4 flex flex-col justify-center items-center">
                  <FaHotel className="w-full h-10 mb-2 dark:text-white-400 text-white "></FaHotel>
                  <div className="font-bold text-xl mb-2 text-white">
                    Halls
                    <Routes>
                      <Route path="/hall" element={<Hall></Hall>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <BottomNavigation></BottomNavigation>
      </div>
    </div>
  );
}

export default Home;

import { Route, Routes, Link } from "react-router-dom";
import { FaMeetup, FaHotel, FaUser, FaHome } from "react-icons/fa";
import Home from "../Home/Home";
import Users from "../Users/Users";
import Meetings from "../Meetings/Meetings";
import Hall from "../Halls/Hall";
import { AuthContext } from "../Context/Context";
import { useContext } from "react";

function BottomNavigation() {
  const { nameCookie } = useContext(AuthContext);
  return (
    <div className="md:hidden font-sans">
      {nameCookie === "Admin" ? (
        <div className="bottom-navigation bg-white flex fixed justify-between shadow-lg text-center py-1">
          <Link to="/home" className="text-gray-700 px-6">
            <div className="relative">
              <FaHome className="w-6 h-10 mb-2 dark:text-white-400"></FaHome>
              <Routes>
                <Route path="/home" element={<Home></Home>} />
              </Routes>
            </div>
          </Link>
          <Link to="/users" className="text-gray-700 px-6">
            <div className="relative">
              <FaUser className="w-5 h-10 mb-2 dark:text-white-400"></FaUser>
              <Routes>
                <Route path="/users" element={<Users></Users>} />
              </Routes>
            </div>
          </Link>
          <Link to="/meeting" className="text-gray-700 px-6">
            <div className="relative">
              <FaMeetup className="w-6 h-10 mb-2 dark:text-white-400"></FaMeetup>
              <Routes>
                <Route path="/meeting" element={<Meetings></Meetings>} />
              </Routes>
            </div>
          </Link>

          <Link to="/hall" className="text-gray-700 px-6">
            <div className="relative">
              <FaHotel className="w-6 h-10 mb-2 dark:text-white-400"></FaHotel>
              <Routes>
                <Route path="/hall" element={<Hall></Hall>} />
              </Routes>
            </div>
          </Link>
        </div>
      ) : (
        <div className="bottom-navigation  bg-white flex fixed justify-between shadow-lg py-1">
          <Link to="/home" className="text-gray-700 px-6">
            <div className="relative">
              <FaHome className="w-6 h-10 mb-2 dark:text-white-400"></FaHome>
              <Routes>
                <Route path="/home" element={<Home></Home>} />
              </Routes>
            </div>
          </Link>

          <Link to="/meeting" className="text-gray-700 px-6">
            <div className="relative">
              <FaMeetup className="w-6 h-10 mb-2 dark:text-white-400"></FaMeetup>
              <Routes>
                <Route path="/meeting" element={<Meetings></Meetings>} />
              </Routes>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default BottomNavigation;

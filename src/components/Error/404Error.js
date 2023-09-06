import React from "react";
import Home from "../Home/Home";
import { Route, Routes, Link } from "react-router-dom";
import "./error.css";

function Accesdenied() {
  return (
    <div className="bg-gray-800 h-screen justify-center">
      <center className="mt-24 m-auto">
        <div className=" tracking-widest mt-4">
          <span className="text-gray-300 text-6xl block">
            <span>4 0 4</span>
          </span>
          <span className="text-gray-300 text-md py-6">
            Sorry, We couldn't find what you are looking for!
          </span>
        </div>
      </center>
      <center className="mt-6">
        <Link to="/home">
          <button className="text-gray-500 font-mono text-xl bg-gray-200 p-3 rounded-md hover:shadow-md hover:bg-gray-600 hover:text-gray-300">
            Go back
            <Routes>
              <Route path="/home" element={<Home></Home>} />
            </Routes>
          </button>
        </Link>
      </center>
    </div>
  );
}

export default Accesdenied;

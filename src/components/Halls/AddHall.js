import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import BottomNavigation from "../Navbar/BottomNavigation";
import TopNav from "../Navbar/TopNav";
import Hall from "./Hall";
import { AuthContext } from "../Context/Context";

function AddHall() {
  const { ContexToken } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";
  const navigate = useNavigate();
  const [showsuccessMessage, setshowsuccessMessage] = React.useState("");
  const [showerrorMessage, setshowerrorMessage] = React.useState([]);

  useEffect(() => {
    if (!ContexToken) {
      window.location.href = "/";
    }
  }, [ContexToken]);

  // Success message close
  const handleClose = () => {
    setshowsuccessMessage("");
    navigate("/hall");
  };

  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage([]);
  };

  // ----------------------- CREATE HALL ------------------------------------------------------------------
  const [formData, setFormData] = useState({
    hall: "",
    floor: "",
    building: "",
  });

  const { hall, floor, building } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      hall,
      floor,
      building,
    };

    try {
      axios
        .post(`${apiUrl}/api/hall`, newUser, {
          headers: {
            Authorization: `Bearer ${ContexToken}`,
          },
        })
        .then((response) => {
          setshowsuccessMessage(response.data["message"]);
        })
        .catch((error) => {
          setshowerrorMessage(error.response["data"]);
        });
    } catch (error) {
      // Handle the error gracefully
      navigate("/networkError");
    }
  };

  const title = "Add Hall";
  const path = "/hall";

  return (
    <div className="font-sans bg-white h-screen">
      <TopNav data={title} path={path}></TopNav>

      {showsuccessMessage ? (
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-6 text-center">
                <video
                  autoPlay
                  loop
                  muted
                  className="mx-auto"
                  style={{ width: "300px", height: "100px" }}
                >
                  <source src={imageUrl} type="video/mp4" />
                  {/* Add fallback content if video is not supported */}
                  Your browser does not support the video tag.
                </video>
                <h3 className="mb-5 font-medium text-sm text-gray-500 dark:text-gray-400">
                  {showsuccessMessage}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{ background: "#263997" }}
                  className="text-white bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-sm rounded inline-flex items-center px-5 py-1 text-center mr-2"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showerrorMessage.length !== 0 ? (
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-6 text-center">
                <video
                  autoPlay
                  loop
                  muted
                  className="mx-auto"
                  style={{ width: "300px", height: "100px" }}
                >
                  <source src={imageErrorUrl} type="video/mp4" />
                  {/* Add fallback content if video is not supported */}
                  Your browser does not support the video tag.
                </video>
                <h3 className="mb-5 font-medium text-sm text-gray-500 dark:text-gray-400">
                  {showerrorMessage}
                </h3>
                <button
                  type="button"
                  onClick={handleErrorClose}
                  style={{ background: "#263997" }}
                  className="text-white bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-sm rounded inline-flex items-center px-5 py-1 text-center mr-2"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* GET */}
      <div className="container mx-auto justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none md:p-8 lg:p-12 xl:p-16">
        <div className=" justify-center md:flex hidden">
          <Link to="/hall">
            <FontAwesomeIcon
              meIcon
              icon={faCircleArrowLeft}
              className="py-1 text-xl"
            />
            <Routes>
              <Route path="/hall" element={<Hall></Hall>}></Route>
            </Routes>
          </Link>

          <div className=" font-bold px-2">ADD HALL</div>
        </div>

        <form className="space-y-6 p-6 py-20" onSubmit={(e) => onSubmit(e)}>
          <center>
            <div className="flex w-full md:w-1/4 items-center bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
              <input
                type="text"
                name="hall"
                value={hall}
                id="name"
                onChange={(e) => onChange(e)}
                autoComplete="off"
                className="flex-grow block w-full px-4 py-2 text-sm border bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
                placeholder="Hall"
                required
              />
              <div className="ml-2 text-gray-500">
                <FontAwesomeIcon icon={faPencil} />
              </div>
            </div>
            <div className="flex w-full md:w-1/4 items-center bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
              <input
                type="text"
                name="floor"
                value={floor}
                id="floor"
                onChange={(e) => onChange(e)}
                autoComplete="off"
                className="flex-grow block w-full px-4 py-2 text-sm border bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
                placeholder="Floor"
                required
              />
              <div className="ml-2 text-gray-500">
                <FontAwesomeIcon icon={faPencil} />
              </div>
            </div>

            <div className="flex w-full md:w-1/4 items-center bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
              <input
                type="text"
                name="building"
                value={building}
                id="building"
                onChange={(e) => onChange(e)}
                autoComplete="off"
                className="flex-grow block w-full px-4 py-2 text-sm border bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
                placeholder="Building"
                required
              />
              <div className="ml-2 text-gray-500">
                <FontAwesomeIcon icon={faPencil} />
              </div>
            </div>

            <button className="flex gap-1 w-full md:w-1/4  bg-blue-800 p-6 text-sm items-center hover:bg-blue-600 hover:text-white text-white font-semibold py-2 px-4 rounded shadow justify-center">
              SAVE
            </button>
          </center>
        </form>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  );
}

export default AddHall;

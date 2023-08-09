import React, { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import AddHall from "./AddHall";
import EditHall from "./EditHall";
import BottomNavigation from "../Navbar/BottomNavigation";
import TopNav from "../Navbar/TopNav";
import { FaPlusCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

function Hall() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const imageDeleteUrl = process.env.PUBLIC_URL + "/animation_lkhxitqq.mp4";
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";
  const token = localStorage.getItem("token");

  const [showDeletemodal, setshowDeletemodal] = useState(false);
  const [hallList, setHallList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showsuccessMessage, setshowsuccessMessage] = useState("");
  const [showerrorMessage, setshowerrorMessage] = useState([]);
  const [showAddHall, setshowAddHall] = React.useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [showEditHall, setshowEditHall] = React.useState(false);

  // GET DATA
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/hall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setHallList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, apiUrl]);

  // --------------------------------- DELETE HALL -------------------------------------
  const deleteDictById = (id) => {
    setHallList((prevList) => {
      return prevList.filter((dict) => dict.id !== id);
    });
  };

  const openDeleteModal = (itemId) => {
    setSelectedItemId(itemId);
    setshowDeletemodal(true);
  };

  const handleDelete = async () => {
    // console.log(selectedItemId);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(
        `${apiUrl}/api/hall/${selectedItemId}`,
        config
      )
      .then((response) => {
        // console.log(response.data);
        deleteDictById(selectedItemId);
        // setshowsuccessMessage(response.data["message"]);
      })
      .catch((error) => {
        console.error("Error : ", error.response["data"]);
        setshowerrorMessage(error.response["data"]);
      });
    setshowDeletemodal(false);
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
    // console.log(newUser);
    axios
      .post(`${apiUrl}/api/hall`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        const updatedList = [...hallList, response.data["hall"]];
        setHallList(updatedList);
        setshowsuccessMessage(response.data["message"]);
      })
      .catch((error) => {
        console.error("Error : ", error.response["data"]);
        setshowerrorMessage(error.response["data"]);
      });
    setshowAddHall(false);
  };

  // ---------------------------------- EDIT HALL -------------------------------------------------
  const updateDictionary = (id, updatedData) => {
    setHallList((prevList) => {
      return prevList.map((dict) => {
        if (dict.id === id) {
          return { ...dict, ...updatedData };
        }
        return dict;
      });

    });
  };

  const openEditModal = (item) => {
    setSelectedEditItemId(item);
    setshowEditHall(true);
  };

  const handleSave = (event) => {
    const updatedItem = { ...selectedEditItemId };
    // console.log(updatedItem);
    axios
      .put(
        `${apiUrl}/api/hall/${updatedItem["id"]}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        updateDictionary(updatedItem["id"], updatedItem);
        setshowsuccessMessage(response.data["message"]);
      })
      .catch((error) => {
        console.error("Error : ", error);
        setshowerrorMessage(error.response["data"]["errors"]);
      });

    setshowEditHall(false);
  };

  // Success message close
  const handleClose = () => {
    setshowsuccessMessage("");
  };

  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage([]);
  };

  const title = "Hall";
  const path = "/home";

  return (
    <div className=" bg-white lg:bg-gray-800 md:bg-gray-800 h-screen font-sans">
      <div style={{ paddingBottom: "90px" }}>
        <TopNav data={title} path={path}></TopNav>

        {showsuccessMessage && (
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
        )}

        {showerrorMessage.length !== 0 && (
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
                    {Object.keys(showerrorMessage).map((key) => (
                      <p key={key}>
                        <strong>{key}:</strong> {showerrorMessage[key]}
                      </p>
                    ))}
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
        )}

        {/* GET */}

        <div className=" container px-6 mx-auto lg:py-4 md:py-10 py-20 ">
          <div className=" hidden md:flex mt-4">
            <button
              onClick={() => setshowAddHall(true)}
              className="flex gap-1 bg-blue-800 p-6 text-sm mt-20 items-center hover:bg-blue-600 lg:text-gray-300 md:text-gray-300 hover:text-white  text-white py-2 px-4 rounded shadow justify-center"
            >
              <FaPlusCircle></FaPlusCircle> &nbsp;Add Hall
            </button>
          </div>

          <div className="lg:py-4 md:py-4 sm:py-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {hallList.map((item) => (
              <div
                className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700 font-sans"
                key={item.id}
              >
                <div className=" grid grid-cols-1 lg:text-gray-300 md:text-gray-300 text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                  {item.hall}
                </div>

                <div className="grid grid-cols-2 lg:text-gray-300 md:text-gray-300 text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                  <div>Floor</div>
                  <div>{item.floor}</div>
                </div>

                <div className="grid grid-cols-2 lg:text-gray-300 md:text-gray-300 text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                  <div>Building</div>
                  <div>{item.building}</div>
                </div>
                <div className="flex px-6 text-center gap-2 text-sm justify-center py-2">
                  <Link to="/edithall" state={item} className="md:hidden">
                    <button className="flex gap-1 items-center text-sm lg:text-gray-300 bg-blue-800 hover:bg-blue-600 text-white px-3 py-1 rounded shadow justify-center">
                      Edit
                    </button>
                    <Routes>
                      <Route
                        path="/edithall"
                        element={<EditHall></EditHall>}
                      ></Route>
                    </Routes>
                  </Link>

                  <button
                    onClick={() => openEditModal(item)}
                    className="hidden md:flex  gap-1 items-center text-sm bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 px-3 py-1 rounded shadow justify-center"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(item.id)}
                    className="flex gap-1 items-center text-sm lg:text-gray-300 bg-blue-800 hover:text-white hover:bg-blue-600 text-white px-3 py-1 rounded shadow justify-center"
                  >
                    {/* <FaTrash></FaTrash> */}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed p-6 container mx-auto md:hidden" style={{ bottom: '76px'}}>
        <Link to="/addhall">
          <button className="flex gap-1 w-full bg-blue-800 p-6 text-sm items-center hover:bg-blue-600 hover:text-white text-white py-2 px-4 rounded shadow justify-center">
            <Routes>
              <Route path="/addhall" element={<AddHall></AddHall>} />
            </Routes>
            Add Hall
          </button>
        </Link>
      </div>

      <BottomNavigation></BottomNavigation>

      {/* ADD MODAL */}
      {showAddHall ? (
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setshowAddHall(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-blue-800 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className=" text-gray-300 font-bold pb-4">ADD HALL</h3>
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)}>
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="hall"
                      id="name"
                      value={hall}
                      onChange={(e) => onChange(e)}
                      autoComplete="off"
                      className="bg-gray-700 border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Name"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="floor"
                      id="floor"
                      value={floor}
                      onChange={(e) => onChange(e)}
                      className="bg-gray-700  border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Floor"
                      autoComplete="off"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="building"
                      id="building"
                      value={building}
                      onChange={(e) => onChange(e)}
                      className="bg-gray-700  border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Building"
                      autoComplete="off"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-gray-300 text-sm bg-blue-800 hover:bg-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg inline-flex items-center px-5 py-2 text-center mr-2"
                  >
                    SAVE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* EDIT MODAL */}
      {showEditHall ? (
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setshowEditHall(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className=" text-gray-300 pb-4 font-bold">EDIT HALL</h3>
                <form className="space-y-6" action="#">
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="hall"
                      id="name"
                      autoComplete="off"
                      value={selectedEditItemId.hall}
                      onChange={(e) =>
                        setSelectedEditItemId({
                          ...selectedEditItemId,
                          hall: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="floor"
                      id="floor"
                      autoComplete="off"
                      value={selectedEditItemId.floor}
                      onChange={(e) =>
                        setSelectedEditItemId({
                          ...selectedEditItemId,
                          floor: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      name="building"
                      id="building"
                      autoComplete="off"
                      value={selectedEditItemId.building}
                      onChange={(e) =>
                        setSelectedEditItemId({
                          ...selectedEditItemId,
                          building: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 outline-none text-gray-300 text-sm rounded-lg block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Building"
                      required
                    />
                    <div className="ml-2 p-2 text-gray-500">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave(selectedEditItemId)}
                    className="text-gray-300 bg-blue-800 text-sm hover:bg-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg inline-flex items-center px-5 py-2 text-center mr-2"
                  >
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirmation modal*/}
      {showDeletemodal && (
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
                  <source src={imageDeleteUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <h3 className="mb-5 font-medium text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this hall?
                </h3>
                <button
                  type="button"
                  onClick={() => setshowDeletemodal(false)}
                  style={{ background: "#263997" }}
                  className="text-white bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-sm rounded inline-flex items-center px-5 py-1 text-center mr-2"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-white bg-red-700 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 text-sm rounded inline-flex items-center px-5 py-1 text-center mr-2"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hall;

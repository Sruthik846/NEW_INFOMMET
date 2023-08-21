import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import EditUser from "./EditUser";
import BottomNavigation from "../Navbar/BottomNavigation";
import TopNav from "../Navbar/TopNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

function Users() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const imageDeleteUrl = process.env.PUBLIC_URL + "/animation_lkhxitqq.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";
  const token = Cookies.get("info_Authtoken");
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";

  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showDeletemodal, setshowDeletemodal] = useState(false);
  const [showerrorMessage, setshowerrorMessage] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [showEditmodal, setshowEditmodal] = React.useState(false);
  const [showsuccessMessage, setshowsuccessMessage] = React.useState("");
  const [showAddmodal, setshowAddmodal] = React.useState(false);

  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  useEffect(() => {
    // console.log(isAuthenticated);
    if (!isAuthenticated) {
      console.log("COOKIE DELETED");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredUsers = dataList.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .get(`${apiUrl}/api/user`, config)
        .then((response) => {
          setDataList(response.data);
        })
        .catch((error) => {
          console.error("Error : ", error.response["data"]);
          setshowerrorMessage(error.response["data"]);
        });
    } catch (error) {
      navigate("/networkError");
    }
  }, [token, apiUrl, navigate]);

  // ---------------------------------- DELETE USER --------------------------------------
  const deleteDictById = (id) => {
    setDataList((prevList) => {
      return prevList.filter((dict) => dict.id !== id);
    });
  };

  const openDeleteModal = (itemId) => {
    // console.log("Deleted itemId : ", itemId);
    setSelectedItemId(itemId);
    setshowDeletemodal(true);
  };
  const handleDelete = async () => {
    // console.log(selectedItemId);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .delete(`${apiUrl}/api/user/${selectedItemId}`, config)
        .then((response) => {
          // console.log(response.data);
          deleteDictById(selectedItemId);
        })
        .catch((error) => {
          console.error("Error : ", error.response["data"]);
          setshowerrorMessage(error.response["data"]);
        });
    } catch (error) {
      navigate("/networkError");
    }
    const updatedList = dataList.filter((item) => item.id !== selectedItemId);
    setDataList(updatedList);
    setshowDeletemodal(false);
  };

  // -------------------------------- UPDATE USER -------------------------------------------
  // update function
  const updateDictionary = (id, updatedData) => {
    setDataList((prevList) => {
      return prevList.map((dict) => {
        if (dict.id === id) {
          return { ...dict, ...updatedData };
        }
        return dict;
      });
    });
  };

  const openEditModal = (item) => {
    // console.log("Edited item : ", item);
    setSelectedEditItemId(item);
    setshowEditmodal(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const updatedItem = { ...selectedEditItemId };

    updatedItem.password = updatedItem.plain_password;
    try {
      axios
        .put(`${apiUrl}/api/user/${updatedItem["id"]}`, updatedItem)
        .then((response) => {
          // console.log(response.data);
          updateDictionary(updatedItem["id"], updatedItem);
          setshowsuccessMessage(response.data["message"]);
        })
        .catch((error) => {
          console.error("Error : ", error.response["data"]);
          setshowerrorMessage(error.response["data"]);
        });
    } catch (error) {
      navigate("/networkError");
    }

    // Close the modal after saving
    setshowEditmodal(false);
  };

  // ----------------- CREATE USER -----------------------------
  const [formData, setFormData] = useState({
    name: "",
    if_id: "",
    email: "",
    department: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);
    try {
      await axios
        .post(`${apiUrl}/api/user`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          const updatedList = [...dataList, response.data["user"]];
          setDataList(updatedList);
          setshowsuccessMessage(response.data["message"]);
        })
        .catch((error) => {
          console.error("Error : ", error.response["data"]);
          setshowerrorMessage(error.response["data"]);
        });
    } catch (error) {
      navigate("/networkError");
    }
    setshowAddmodal(false);
    setFormData({
      name: "",
      if_id: "",
      email: "",
      department: "",
      password: "",
    });
  };

  // Success message close
  const handleClose = () => {
    setshowsuccessMessage("");
    navigate("/users");
  };

  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage([]);
  };
  const title = "Users";
  const path = "/home";

  return (
    <div className="bg-white lg:bg-gray-800 md:bg-gray-800 h-screen font-sans overflow-y-auto">
      <div style={{ paddingBottom: "90px" }}>
        <TopNav data={title} path={path}></TopNav>

        <div className="container mx-auto">
          <div className="p-6  flex gap-4 pb-2 py-20">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="p-10 border lg:mt-6 md:mt-6 border-gray-300 lg:bg-gray-700 lg:border-gray-600 lg:text-gray-300 md:bg-gray-700 md:border-gray-600 md:text-gray-300 rounded-lg py-1 px-4 block w-full appearance-none leading-normal focus:outline-none"
              />
            </div>

            <Link to="/adduser" className="md:hidden">
              <button className="flex items-center text-sm bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 md:text-gray-300 px-4 py-2 rounded shadow justify-center">
                <Routes>
                  <Route path="/adduser" element={<addUser></addUser>} />
                </Routes>
                <FaUserPlus></FaUserPlus> &nbsp;User
              </button>
            </Link>

            <button
              onClick={() => setshowAddmodal(true)}
              className=" hidden mt-6 md:flex items-center text-sm bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 md:text-gray-300 px-4 py-1 rounded shadow justify-center"
            >
              <FaUserPlus></FaUserPlus> &nbsp;User
            </button>
          </div>

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
                      Your browser does not support the video tag.
                    </video>
                    <h3 className="mb-5 font-medium text-gray-500 dark:text-gray-400">
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

          <div className="p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {searchTerm
              ? searchResults.map((item) => (
                  <div
                    className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700"
                    key={item.id}
                  >
                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500  lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md md:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Name</div>
                      <div>{item.name}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md md:text-md xl:text-md text-left font-medium py-0.5">
                      <div>IFID</div>
                      <div>{item.if_id}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md md:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Email</div>
                      <div>{item.email}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md md:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Dept</div>
                      <div>{item.department}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md md:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Pw</div>
                      <div>{item.plain_password}</div>
                    </div>
                    <div className="flex px-6 text-center gap-2 text-sm justify-center py-2">
                      <Link to="/edituser" state={item} className="md:hidden">
                        <button className="flex gap-1 items-center bg-blue-800 hover:bg-blue-600 text-white lg:text-gray-300 md:text-gray-300 px-3 py-1 rounded shadow justify-center">
                          Edit
                          <Routes>
                            <Route
                              path="/edituser"
                              element={<EditUser></EditUser>}
                            ></Route>
                          </Routes>
                        </button>
                      </Link>

                      <button
                        onClick={() => openEditModal(item)}
                        className="hidden md:flex  gap-1 items-center text-sm bg-blue-800 hover:bg-blue-600 text-white lg:text-gray-300 md:text-gray-300 px-3 py-1 rounded shadow justify-center"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="flex gap-1 items-center bg-blue-800 hover:bg-blue-600 text-white lg:text-gray-300 md:text-gray-300 px-3 py-1 rounded shadow justify-center"
                      >
                        {/* <FaTrash></FaTrash> */}
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : dataList.map((item) => (
                  <div
                    className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700 font-sans"
                    key={item.id}
                  >
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Name</div>
                      <div>{item.name}</div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                      <div>IFID</div>
                      <div>{item.if_id}</div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Email</div>
                      <div>{item.email}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Dept</div>
                      <div>{item.department}</div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                      <div>Pw</div>
                      <div>{item.plain_password}</div>
                    </div>
                    <div className="flex px-6 text-center gap-2 text-sm justify-center py-2">
                      <Link to="/edituser" state={item} className="md:hidden">
                        <button className="flex gap-1 items-center text-sm bg-blue-800 hover:bg-blue-600 text-white lg:text-gray-300 md:text-gray-300 px-3 py-1 rounded shadow justify-center">
                          Edit
                          <Routes>
                            <Route
                              path="/edituser"
                              element={<EditUser></EditUser>}
                            ></Route>
                          </Routes>
                        </button>
                      </Link>
                      <button
                        onClick={() => openEditModal(item)}
                        className="hidden md:flex  gap-1 items-center text-sm bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 md:text-gray-300 px-3 py-1 rounded shadow justify-center"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="flex gap-1 items-center text-sm bg-blue-800 hover:bg-blue-600 hover:text-white lg:text-gray-300 md:text-gray-300 text-white px-3 py-1 rounded shadow justify-center"
                      >
                        {/* <FaTrash></FaTrash> */}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
          </div>

          {/* Add modal */}
          {showAddmodal ? (
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
              style={{ backdropFilter: "blur(5px)" }}
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setshowAddmodal(false)}
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
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="px-6 py-6 lg:px-8">
                    <h4 className=" text-gray-300 pb-4 font-bold">ADD USER</h4>
                    <form className="space-y-6" onSubmit={onSubmit}>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="name"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={onChange}
                          placeholder="Name"
                          autoComplete="off"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>

                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          id="if_id"
                          name="if_id"
                          value={formData.if_id}
                          onChange={onChange}
                          placeholder="IFID"
                          autoComplete="off"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>

                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={onChange}
                          placeholder="Infolks Email"
                          autoComplete="off"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                      </div>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={onChange}
                          placeholder="Department"
                          autoComplete="off"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>

                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={onChange}
                          autoComplete="off"
                          placeholder="Password"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="text-gray-300 text-sm bg-blue-800 hover:bg-blue-600 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg inline-flex items-center px-5 py-2 text-center mr-2"
                      >
                        SAVE
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Edit modal */}
          {showEditmodal ? (
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-6 md:p-8 lg:p-12 xl:p-16"
              style={{ backdropFilter: "blur(5px)" }}
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setshowEditmodal(false)}
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
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="px-6 py-6 lg:px-8">
                    {/* <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit User</h3> */}
                    <form className="space-y-6" onSubmit={handleSave}>
                      <h4 className="text-gray-300 font-bold">EDIT USER</h4>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="name"
                          name="name"
                          id="name"
                          autoComplete="off"
                          value={selectedEditItemId.name}
                          onChange={(e) =>
                            setSelectedEditItemId({
                              ...selectedEditItemId,
                              name: e.target.value,
                            })
                          }
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          name="if_id"
                          id="if_id"
                          autoComplete="off"
                          value={selectedEditItemId.if_id}
                          onChange={(e) =>
                            setSelectedEditItemId({
                              ...selectedEditItemId,
                              if_id: e.target.value,
                            })
                          }
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="off"
                          value={selectedEditItemId.email}
                          onChange={(e) =>
                            setSelectedEditItemId({
                              ...selectedEditItemId,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                      </div>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          name="department"
                          id="department"
                          autoComplete="off"
                          value={selectedEditItemId.department}
                          onChange={(e) =>
                            setSelectedEditItemId({
                              ...selectedEditItemId,
                              department: e.target.value,
                            })
                          }
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </div>
                      <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                        <input
                          type="password"
                          name="plain_password"
                          id="password"
                          autoComplete="off"
                          value={selectedEditItemId.plain_password}
                          onChange={(e) =>
                            setSelectedEditItemId({
                              ...selectedEditItemId,
                              plain_password: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="bg-gray-700 outline-none text-gray-300 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <div className="ml-2 p-2 text-gray-500">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="text-gray-300 text-sm bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg inline-flex items-center px-5 py-2 text-center mr-2"
                      >
                        UPDATE
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Delete confirmation */}
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
                    <h3 className="mb-5 font-medium text-gray-500 dark:text-gray-400 text-sm">
                      Are you sure you want to delete this user?
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

          <BottomNavigation></BottomNavigation>
        </div>
      </div>
    </div>
  );
}

export default Users;

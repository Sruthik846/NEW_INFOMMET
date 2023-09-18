import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../Navbar/BottomNavigation";
import AddMeeting from "./AddMeeting";
import TopNav from "../Navbar/TopNav";
import { FaPlusCircle } from "react-icons/fa";
import { AuthContext } from "../Context/Context";
import Cookies from "js-cookie";

function Meetings() {
  const { tokenVal } = useContext(AuthContext);
  const ContexToken = tokenVal;
  const navigate = useNavigate();

  const { nameVal } = useContext(AuthContext);
  const nameCookie = nameVal;
  const apiUrl = process.env.REACT_APP_API_URL;
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";
  const imageDeleteUrl = process.env.PUBLIC_URL + "/animation_lkhxitqq.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";

  const [completedData, setCompletedData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [updateData, setUpdateData] = useState([]);
  const [upcomingdata, setUpcomingData] = useState([]);
  const [showsuccessMessage, setshowsuccessMessage] = React.useState("");
  const [showerrorMessage, setshowerrorMessage] = React.useState("");
  const [showDeletemodal, setshowDeletemodal] = useState(false);

  // --------------------------- GET MEETING LIST --------------------------------

  useEffect(() => {
    if (!Cookies.get("infoToken")) {
      navigate("/");
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ContexToken}`,
      },
    };
    try {
      axios
        .get(`${apiUrl}/api/meeting-list`, config)
        .then((response) => {
          // convert date from datetime & save to updatedta
          const updatedList = response.data.map((item) => {
            const dateOnly = item.date.split("T")[0]; // dates only
            const timeList = item.time.join(", "); 
            return { ...item, date: dateOnly, timestr: timeList };
          });
          setUpdateData(updatedList);
           // Get current date for splitting all data to upcoming and completed
          const currentDate = new Date().toISOString().split("T")[0];

          const upcomingDates = [];
          const completedDates = [];

          updatedList.forEach((item) => {
            if (item.date < currentDate) {
              completedDates.push(item);
            } else {
              upcomingDates.push(item);
            }
          });
          setUpcomingData(upcomingDates);
          setCompletedData(completedDates);
        })
        .catch((error) => {
          // console.error(error);
        });
    } catch (error) {
      Navigate("/networkError");
    }
  }, [ContexToken, apiUrl, navigate]);


  // ---------------------------------------------------- DELETE DATA  ----------------------------------------

  const deleteDictById = (id) => {
    setUpcomingData((prevList) => {
      return prevList.filter((dict) => dict.id !== id);
    });
  };

  const openDeleteModal = (itemId) => {
    setSelectedItemId(itemId);
    setshowDeletemodal(true);
  };
  const handleDelete = async () => {
    if (!Cookies.get("infoToken")) {
      navigate("/");
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ContexToken}`,
        },
      };
      axios
        .delete(`${apiUrl}/api/meeting/delete/${selectedItemId}`, config)
        .then((response) => {
          deleteDictById(selectedItemId);
        })
        .catch((error) => {
          setshowerrorMessage(error.response["data"]);
        });

      const updatedListmeet = updateData.filter(
        (item) => item.id !== selectedItemId
      );
      setUpdateData(updatedListmeet);
      const updatedList = upcomingdata.filter(
        (item) => item.id !== selectedItemId
      );
      setUpcomingData(updatedList);

      const updatedList_completed = completedData.filter(
        (item) => item.id !== selectedItemId
      );
      setCompletedData(updatedList_completed);
      setshowDeletemodal(false);
    } catch (error) {
      Navigate("/networkError");
    }
  };

  // Success message close
  const handleClose = () => {
    setshowsuccessMessage("");
  };

  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage("");
  };

  const title = "Meetings";
  const path = "/home/*";

  const [selectedOption, setSelectedOption] = useState("");
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Create a list for upcoming list of the logged user
  const userUpcomingList = [];
  for (let i = 0; i < upcomingdata.length; i++) {
    if (upcomingdata[i].booked_by === nameCookie) {
      const item = upcomingdata[i];
      userUpcomingList.push(item);
    }
  }

  const getContent = () => {
    if (selectedOption === "completed") {
      return completedData.map((item) =>
        nameCookie === "Admin" ? (
          <div
            className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700"
            key={item.id}
          >
            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Agenda</div>
              <div>{item.agenda}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Hall</div>
              <div>{item.hall}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Date</div>
              <div>{item.date}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Time</div>
              <div> {item.timestr} </div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Booked By</div>
              <div>{item.booked_by}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Department</div>
              <div>{item.department}</div>
            </div>
          </div>
        ) : item.booked_by === nameCookie ? (
          <div
            className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700"
            key={item.id}
          >
            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Agenda</div>
              <div>{item.agenda}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Hall</div>
              <div>{item.hall}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Date</div>
              <div>{item.date}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Time</div>
              <div>{item.timestr}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Booked By</div>
              <div>{item.booked_by}</div>
            </div>

            <div className="grid grid-cols-2 text-gray-500 lg:text-gray-300 md:text-gray-300 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
              <div>Department</div>
              <div>{item.department}</div>
            </div>
          </div>
        ) : null
      );
    } else {
      return upcomingdata.length !== 0 ? (
        nameCookie === "Admin" ? (
          upcomingdata.map((item) => (
            <div
              className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700"
              key={item.id}
            >
              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Agenda</div>
                <div>{item.agenda}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Hall</div>
                <div>{item.hall}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300  md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Date</div>
                <div>{item.date}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Time</div>
                <div> {item.timestr} </div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Booked By</div>
                <div>{item.booked_by}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Department</div>
                <div>{item.department}</div>
              </div>

              <div className="flex px-6 text-center gap-2 text-sm justify-center p-4">
                {/* <Link to="/editmeeting" state={item}>
                  <button className="flex gap-1 py-1 text-sm items-center bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 px-3 rounded shadow justify-center">
                    Edit
                  </button>
                  <Routes>
                    <Route
                      path="/editmeeting"
                      element={<EditMeeting></EditMeeting>}
                    ></Route>
                  </Routes>
                </Link> */}
                <button
                  onClick={() => openDeleteModal(item.id)}
                  className="flex gap-1 py-1 text-sm items-center bg-blue-800 hover:text-white hover:bg-blue-600 text-white lg:text-gray-300 px-3 rounded shadow justify-center"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : userUpcomingList.length !== 0 ? (
          userUpcomingList.map((item) => (
            <div
              className=" overflow-hidden shadow-lg p-4 rounded-md bg-gray-200 lg:bg-gray-700 md:bg-gray-700"
              key={item.id}
            >
              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Agenda</div>
                <div>{item.agenda}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Hall</div>
                <div>{item.hall}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300  md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Date</div>
                <div>{item.date}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Time</div>
                <div> {item.timestr} </div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Booked By</div>
                <div>{item.booked_by}</div>
              </div>

              <div className="grid grid-cols-2 text-sm text-gray-500 lg:text-gray-300 md:text-gray-300 sm:text-sm md:text-sm lg:text-md xl:text-md text-left font-medium py-0.5">
                <div>Department</div>
                <div>{item.department}</div>
              </div>

              <div className="flex px-6 text-center gap-2 text-sm justify-center p-4">
                {/* <Link to="/editmeeting" state={item}>
                  <button className="flex gap-1 py-1 text-sm items-center bg-blue-800 hover:bg-blue-600 hover:text-white text-white lg:text-gray-300 px-3 rounded shadow justify-center">
                    Edit
                  </button>
                  <Routes>
                    <Route
                      path="/editmeeting"
                      element={<EditMeeting></EditMeeting>}
                    ></Route>
                  </Routes>
                </Link> */}
                <button
                  onClick={() => openDeleteModal(item.id)}
                  className="flex gap-1 py-1 text-sm items-center bg-blue-800 hover:text-white hover:bg-blue-600 text-white lg:text-gray-300 px-3 rounded shadow justify-center"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-left px-2 lg:text-gray-300">
            No meetings found...
          </p>
        )
      ) : (
        <p className="text-sm text-left px-2 lg:text-gray-300">
          No meetings found...
        </p>
      );
    }
  };

  return (
    <div className="lg:bg-gray-800 md:bg-gray-800 bg-white h-screen font-sans overflow-y-auto">
      <div style={{ paddingBottom: "90px" }}>
        <TopNav data={title} path={path}></TopNav>

        <div className="container mx-auto px-6 flex gap-1 pb-2 py-20 justify-between">
          <div className="flex items-center lg:mt-6">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="p-10 border border-gray-300 lg:bg-gray-700 lg:border-gray-600 lg:text-gray-300 md:bg-gray-700 md:border-gray-600 md:text-gray-300 rounded-lg py-1 px-4 text-sm block w-full leading-normal focus:outline-none"
            >
              <option value="">Upcoming Meetings</option>
              <option value="completed">Completed Meetings</option>
            </select>
          </div>

          <Link to="/addmeeting" className="lg:mt-6">
            <button className="flex items-center bg-blue-800 hover:bg-blue-600 lg:text-gray-300 md:text-gray-300 hover:text-white text-white text-sm lg:px-4 px-1 py-2 rounded shadow justify-center">
              <Routes>
                <Route path="/addmeeting" element={<AddMeeting></AddMeeting>} />
              </Routes>
              <FaPlusCircle className="hidden md:flex"></FaPlusCircle> &nbsp;New
              Meeting
            </button>
          </Link>
        </div>

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
        ) : null}

        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 py-2">
          {getContent()}
        </div>

        <BottomNavigation></BottomNavigation>
      </div>

      {/* Delete confirmation */}
      {showDeletemodal ? (
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
                  {/* Add fallback content if video is not supported */}
                  Your browser does not support the video tag.
                </video>
                <h3 className="mb-5 font-medium text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this meeting?
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
      ) : null}
    </div>
  );
}

export default Meetings;

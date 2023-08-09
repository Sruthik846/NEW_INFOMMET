import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNavigation from "../Navbar/BottomNavigation";
import { useState } from "react";
import { faPencil, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import TopNav from "../Navbar/TopNav";
import Meetings from "./Meetings";
import {
  useNavigate,
  useLocation,
  Link,
  Route,
  Routes,
} from "react-router-dom";

function EditMeeting() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const data = location.state;
  const [editedItem, setEditedItem] = useState({ ...data });

  const [meetingList, setMeetingList] = useState([]);
  const [showsuccessMessage, setshowsuccessMessage] = useState("");
  const alreadySelectedEditSlots = [];
  const [timeArray, setTimeArray] = useState([]);
  const [showerrorMessage, setshowerrorMessage] = useState([]);
  const [TimeList, setTimeList] = useState([]);

  const handleClose = () => {
    setshowsuccessMessage("");
    navigate("/meeting");
  };

  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage([]);
  };

  // ---------------------- GET TIME SLOTS ---------------------------------------

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${apiUrl}/api/slot`, config)
      .then((response) => {
        setTimeList(response.data);
        setTimeArray(editedItem.time);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, editedItem.time, apiUrl]);

  const times = TimeList.map((item) => item.time);

  // --------------------------- GET MEETING LIST --------------------------------

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${apiUrl}/api/meeting-list`, config)
      .then((response) => {
        // convert date from datetime & save to meetinglist
        const updatedList = response.data.map((item) => {
          const dateOnly = item.date.split("T")[0];
          return { ...item, date: dateOnly };
        });
        setMeetingList(updatedList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, apiUrl]);

  const matchingDict = meetingList.filter(
    (dict) => dict.hall === editedItem.hall && dict.date === editedItem.date
  );
  if (matchingDict) {
    matchingDict.map((data) => alreadySelectedEditSlots.push(data.time));
  }
  // console.log(alreadySelectedEditSlots);
  // convert nested list to single list
  const notAvailableEditSlots = alreadySelectedEditSlots.reduce(
    (accumulator, currentArray) => {
      return accumulator.concat(currentArray);
    },
    []
  );
  // console.log(notAvailableEditSlots);
  let li = editedItem.time;
  const filteredList = notAvailableEditSlots.filter(
    (item) => !li.includes(item)
  );

  // console.log("Filtered List :", filteredList);

  const handleButtonClickEdit = (value) => {
    if (timeArray.includes(value)) {
      setTimeArray(timeArray.filter((button) => button !== value));
    } else {
      console.log(value);
      setTimeArray([...timeArray, value]);
      // li = timeArray;
    }
  };
  // console.log(li)

  const handleSave = (event) => {
    event.preventDefault();
    const updatedObject = { ...editedItem };
    delete updatedObject.time;
    updatedObject.time = timeArray;
    setshowsuccessMessage("Succesfully Edited!");
    // console.log("Updated item : ", updatedObject);
  };
  const title = "Edit Meeting";
  const path = "/meeting";

  return (
    <div className="bg-white lg:bg-gray-800 md:bg-gray-800 h-screen font-sans">
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
                <h3 className="mb-5 font-medium text-gray-500 dark:text-gray-400">
                  {showsuccessMessage}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{ background: "#263997" }}
                  className="text-white bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded inline-flex items-center px-5 py-1 text-center mr-2"
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
      )}

      <div className="container mx-auto justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none md:p-8 py-10">
        <div className=" justify-center md:flex hidden lg:py-10 md:py-10">
          <Link to="/meeting" className="mt-6">
            <FontAwesomeIcon
              // meIcon
              icon={faCircleArrowLeft}
              className="py-1 text-xl text-gray-300"
            />
            <Routes>
              <Route path="/meeting" element={<Meetings></Meetings>}></Route>
            </Routes>
          </Link>

          <div className=" font-bold px-2 text-gray-300 py-0.5 mt-6">
            EDIT MEETING
          </div>
        </div>

        <form className="space-y-6 p-6 lg:py-0 md:py-0" onSubmit={handleSave}>
          <div className="flex items-center bg-gray-200 lg:bg-gray-800 border lg:border-gray-600 lg:text-gray-300 md:bg-gray-800 md:border-gray-600 md:text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <select
              id="halls"
              name="hall"
              value={editedItem.hall}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  hall: e.target.value,
                })
              }
              required
              className="flex-grow block w-full px-4 py-2 text-sm bg-gray-200 lg:bg-gray-800 lg:text-gray-300 md:bg-gray-800 md:text-gray-300 rounded-lg focus:outline-none focus:ring-opacity-40 "
            >
              <option selected value="option1">
                Select hall
              </option>
              <option value="Main Office Conference Hall">
                Main Office Conference Hall
              </option>
              <option value="ODC Conference Hall">ODC Conference Hall</option>
            </select>
          </div>
          <div className="flex items-center bg-gray-200 lg:bg-gray-800 border lg:border-gray-600 lg:text-gray-300 md:bg-gray-800 md:border-gray-600 md:text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <input
              type="date"
              name="date"
              value={editedItem.date}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  date: e.target.value,
                })
              }
              className="flex-grow block w-full px-4 py-2 text-sm bg-gray-200 lg:bg-gray-800 lg:text-gray-300 md:bg-gray-800 md:text-gray-300 rounded-lg focus:outline-none focus:ring-opacity-40 "
              style={{ paddingLeft: "1rem" }}
              placeholder="Date"
              required
            />
          </div>

          <div className="flex items-center bg-gray-200 lg:bg-gray-800 border lg:border-gray-600 lg:text-gray-300 md:bg-gray-800 md:border-gray-600 md:text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <input
              type="text"
              name="agenda"
              value={editedItem.agenda}
              autoComplete="off"
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  agenda: e.target.value,
                })
              }
              className="flex-grow block w-full px-4 py-2 text-sm bg-gray-200 lg:bg-gray-800 lg:text-gray-300 md:bg-gray-800 md:text-gray-300 rounded-lg focus:outline-none focus:ring-opacity-40 "
              placeholder="Agenda"
              required
            />
            <div className="ml-2 text-gray-500">
              <FontAwesomeIcon icon={faPencil} />
            </div>
          </div>

          <div className=" items-center bg-gray-200 lg:bg-gray-800 border lg:border-gray-600 lg:text-gray-300 md:bg-gray-800 md:border-gray-600 md:text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <h6 className="text-blueGray-400 py-3 font-medium uppercase text-sm ">
              Slots
            </h6>
            <div className="flex flex-wrap ">
              <div className="w-full lg:w-12/12 px-4 grid-cols-1 sm:grid-cols-2 gap-1 max-h-[250px] overflow-y-auto">
                <div className=" md:grid-cols-8 lg:grid-cols-12 mb-2 grid grid-cols-2 sm:grid-cols-2 gap-2 ">
                  {times.map((item) => (
                    <div className=" md:mb-0" key={item.id}>
                      {filteredList.includes(item) ? (
                        <button
                          type="button"
                          className="bg-red-800 text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3 "
                          disabled
                        >
                          {item}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={
                            timeArray.includes(item)
                              ? "bg-blue-800 text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                              : "bg-white text-black lg:bg-gray-700 lg:text-gray-300 md:bg-gray-700 md:text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                          }
                          onClick={() => handleButtonClickEdit(item)}
                        >
                          {item}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="flex gap-1 w-full bg-blue-800 p-6 text-sm items-center hover:bg-blue-600 hover:text-white text-white font-semibold py-2 px-4 rounded shadow justify-center">
            SAVE
          </button>
        </form>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  );
}

export default EditMeeting;

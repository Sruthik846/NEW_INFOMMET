import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNavigation from "../Navbar/BottomNavigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { faPencil, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import TopNav from "../Navbar/TopNav";
import Meetings from "./Meetings";

function AddMeeting() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("info_Authtoken");
  const ifid = Cookies.get("ifid");
  const name = Cookies.get("name");
  const department = Cookies.get("department");
  const imageUrl = process.env.PUBLIC_URL + "/animation_lkhv4mhb.mp4";
  const imageErrorUrl = process.env.PUBLIC_URL + "/animation_lkji4e3e.mp4";
  const navigate = useNavigate();

  const [meetingList, setMeetingList] = useState([]);
  const [TimeList, setTimeList] = useState([]);
  const alreadySelectedSlots = [];
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [showsuccessMessage, setshowsuccessMessage] = useState("");
  const [showerrorMessage, setshowerrorMessage] = useState("");

  const handleClose = () => {
    setshowsuccessMessage("");
    navigate("/meeting");
  };

  // ---------------------- GET TIME SLOTS ---------------------------------------
  useEffect(() => {
    if(!token){
      window.location.href = "/";
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${apiUrl}/api/slot`, config)
      .then((response) => {
        // console.log(response.data);
        setTimeList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, apiUrl]);

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
        // convert date from datetime & save to updatedta
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

  const handleButtonClick = (value) => {
    // If already exists remove it from the list
    if (selectedButtons.includes(value)) {
      setSelectedButtons(selectedButtons.filter((button) => button !== value));
    } else {
      // otherwise add value to the list
      setSelectedButtons([...selectedButtons, value]);
    }
  };

  const [formData, setFormData] = useState({
    agenda: "",
    hall: "",
    date: "",
  });

  const { agenda, hall, date } = formData;

  const onChangeFormdata = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (formData.hall && formData.date) {
    // console.log(formData.hall, formData.date);
    const matchingDict = meetingList.filter(
      (dict) => dict.hall === formData.hall && dict.date === formData.date
    );
    if (matchingDict) {
      matchingDict.map((data) => alreadySelectedSlots.push(data.time));
    }
  }
  // console.log(alreadySelectedSlots);
  // selected time slots to a single list
  const notAvailableSlots = alreadySelectedSlots.reduce(
    (accumulator, currentArray) => {
      return accumulator.concat(currentArray);
    },
    []
  );
  // console.log(notAvailableSlots);

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      agenda,
      hall,
      date,
    };
    // console.log(newUser);
    const slot = Object.values(selectedButtons).map((item) => item.slot);
    const time = Object.values(selectedButtons).map((item) => item.time);
    newUser.slot = slot;
    newUser.time = time;
    newUser.if_id = ifid;
    newUser.booked_by = name;
    newUser.department = department;
    // console.log(newUser);

    axios
      .post(`${apiUrl}/api/booking`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setshowsuccessMessage("Meeting Created");
        // window.location.reload()
      })
      .catch((error) => {
        console.error("Error : ", error["message"]);
        setshowerrorMessage(error["message"]);
      });

    setFormData({
      agenda: "",
      hall: "",
      date: "",
    });
    setSelectedButtons("");
  };
  // Error message close
  const handleErrorClose = () => {
    setshowerrorMessage([]);
  };

  const title = "Add Meeting";
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

      <div className="container mx-auto  justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none md:p-8">
        <div className=" justify-center md:flex hidden lg:py-10 md:py-10">
          <Link to="/meeting" className="mt-6">
            <FontAwesomeIcon
              // meicon
              icon={faCircleArrowLeft}
              className="py-1 text-xl text-gray-300"
            />
            <Routes>
              <Route path="/meeting" element={<Meetings></Meetings>}></Route>
            </Routes>
          </Link>

          <div className=" font-bold px-2 text-gray-300 py-0.5 mt-6">
            ADD MEETING
          </div>
        </div>
        <form
          className=" p-6 lg:py-0 md:py-0 py-20"
          onSubmit={(e) => onSubmit(e)}
        >
          <div className="grid lg:grid-cols-2 lg:gap-2">
          <div className="flex items-center bg-gray-200 lg:bg-gray-800 md:bg-gray-800 border lg:border-gray-600 md:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <select
              id="halls"
              name="hall"
              value={hall}
              onChange={(e) => onChangeFormdata(e)}
              required
              // defaultValue="option1"
              className="flex-grow block w-full px-4 py-2 text-sm border bg-gray-200 lg:bg-gray-800 lg:border-none lg:text-gray-300 md:bg-gray-800 md:border-none md:text-gray-300 rounded-lg focus:outline-none focus:ring-opacity-40"
            >
              <option value="option1">
                Select hall
              </option>
              <option value="Main Office Conference Hall">
                Main Office Conference Hall
              </option>
              <option value="ODC Conference Hall">ODC Conference Hall</option>
            </select>
          </div>
          <div className="flex items-center bg-gray-200 lg:bg-gray-800 md:bg-gray-800 border lg:border-gray-600 md:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <input
              type="date"
              name="date"
              value={date}
              id="date"
              onChange={(e) => onChangeFormdata(e)}
              className="flex-grow block w-full py-2 lg:placeholder-gray-300 placeholder-gray-800 text-sm border lg:bg-gray-800 lg:border-none lg:text-gray-300 md:bg-gray-800 md:border-none md:text-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
              style={{ paddingLeft: "1rem" }}
              placeholder="Date"
              required
            />
          </div>
          </div>

          <div className="flex items-center bg-gray-200 lg:bg-gray-800 md:bg-gray-800 border lg:border-gray-600 md:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <input
              type="text"
              name="agenda"
              value={agenda}
              id="agenda"
              onChange={(e) => onChangeFormdata(e)}
              autoComplete="off"
              className="flex-grow block w-full px-4 py-2 lg:placeholder-gray-300 placeholder-gray-800 text-sm text-gray-800 border lg:bg-gray-800 lg:border-none lg:text-gray-100 md:bg-gray-800 md:border-none md:text-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
              placeholder="Agenda"
              required
            />
            <div className="ml-2 text-gray-600 lg:text-gray-400">
              <FontAwesomeIcon icon={faPencil} />
            </div>
          </div>

          <div className=" items-center bg-gray-200 lg:bg-gray-800 border lg:border-gray-600 lg:text-gray-300 md:bg-gray-800  md:border-gray-600 md:text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2">
            <h6 className="text-blueGray-400 py-3 font-medium uppercase text-sm ">
              SLOTS
            </h6>
            <div className="flex flex-wrap ">
              <div className="w-full lg:w-12/12 px-4 grid-cols-1 sm:grid-cols-2 gap-1 max-h-[250px] overflow-y-auto">
                <div className=" md:grid-cols-8 lg:grid-cols-12 mb-2 grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {TimeList.map((item) => (
                    <div className=" md:mb-0 " key={item.id}>
                      {notAvailableSlots ? (
                        notAvailableSlots.includes(item.time) ? (
                          <button
                            type="button"
                            className="bg-red-800 text-white selection:appearance-none text-sm rounded-lg text-center block w-full bg-grey-lighter text-grey-darker py-2 md:py-3 lg:py-3 xl:py-3 "
                            onClick={() => handleButtonClick(item)}
                            disabled
                          >
                            {item.time}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={
                              selectedButtons.includes(item)
                                ? "bg-blue-800 text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                                : "bg-white text-black lg:bg-gray-700 lg:text-gray-300 md:bg-gray-700 md:text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                            }
                            onClick={() => handleButtonClick(item)}
                          >
                            {item.time}
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          className={
                            selectedButtons.includes(item)
                              ? "bg-blue-800 text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                              : "bg-white text-black lg:bg-gray-700 lg:text-gray-300 md:bg-gray-700 md:text-gray-300 appearance-none text-sm text-center block w-full bg-grey-lighter text-grey-darker rounded-lg py-2 md:py-3 lg:py-3 xl:py-3"
                          }
                          onClick={() => handleButtonClick(item)}
                        >
                          {item.time}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="flex gap-1 w-full bg-blue-800 p-6 text-sm items-center hover:bg-blue-600 lg:text-gray-300 hover:text-white text-white font-semibold py-2 px-4 rounded shadow justify-center">
            SAVE
          </button>
        </form>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  );
}

export default AddMeeting;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import Home from "../Home/Home";
import CryptoJS from "crypto-js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showerrorMessage, setshowerrorMessage] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 20|YuM6aPDZhJXBJ8NV2Zx4zaAGY7jBYZnJkAwcvcu0",
        },
      };
      const body = JSON.stringify(newUser);
      await axios
        .post("https://meetingapi.infolksgroup.com/api/login", body, config)
        .then((response) => {
          const token = response.data["token"];

          // encrypt data and stored to cookie
          const expirationTime = new Date();
          expirationTime.setHours(expirationTime.getHours() + 2);

          const tokanVal = CryptoJS.AES.encrypt(
            token, "secret-key").toString(); 
          Cookies.set("infoToken", tokanVal, {
            expires: expirationTime,
          });

          const emailVal = CryptoJS.AES.encrypt(
            newUser["email"],
            "secret-key"
          ).toString();
          Cookies.set("Email", emailVal);

          const passwordVal = CryptoJS.AES.encrypt(
            newUser["password"],
            "secret-key"
          ).toString();
          Cookies.set("Password", passwordVal);

          const nameVal = CryptoJS.AES.encrypt(
            response.data["user"]["name"],
            "secret-key"
          ).toString();
          Cookies.set("Name", nameVal);

          const ifidVal = CryptoJS.AES.encrypt(
            response.data["user"]["if_id"],
            "secret-key"
          ).toString();
          Cookies.set("Ifid", ifidVal);

          const deptVal = CryptoJS.AES.encrypt(
            response.data["user"]["department"],
            "secret-key"
          ).toString();
          Cookies.set("Department", deptVal);

          const userVal = CryptoJS.AES.encrypt(
            response.data["user"]["user_type"],
            "secret-key"
          ).toString();
          Cookies.set("UserType", userVal);

          window.location.href = "/home/*";
        });
    } catch (err) {
      setshowerrorMessage(err.response["data"]["message"]);
      navigate("/");
    }
  };

  useEffect(() => {
    const handleAuthChange = () => {
      const authToken = Cookies.get("infoToken");
      if (authToken) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleAuthChange);
    handleAuthChange();

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <>
      {authenticated ? (
        <Home></Home>
      ) : (
        <div className="relative flex flex-col justify-center overflow-hidden h-screen bg-white md:bg-gray-100 lg:bg-gray-100 ">
          <div className="w-full p-6 m-auto rounded-md lg:max-w-sm flex  flex-col justify-center lg:shadow-lg bg-white">
            <img
              src="https://infolks.info/images/logo/logo-rc.svg"
              className="w-full"
              alt="Logo"
              style={{ height: "150px" }}
            ></img>
            <h1 className="text-3xl font-bold text-left text-gray-600 py-10">
              Hey! <br></br>
              Login
            </h1>
            <form onSubmit={(e) => onSubmit(e)} method="POST">
              <div className="flex items-center bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 mb-4 px-2 ">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  className="flex-grow block w-full text-gray-800 px-4 py-2 mt-2 text-sm border bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40 focus:bg-gray-200 appearance-none bg-transparent "
                  placeholder="Infolks Email"
                  required
                />
                <div className="ml-2 text-gray-500">
                  <FontAwesomeIcon icon={faPencil} />
                </div>
              </div>

              <div className="mb-2 flex items-center bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40 px-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                  className="flex-grow block w-full text-gray-800 px-4 py-2 mt-2 text-sm border bg-gray-200 rounded-lg focus:outline-none focus:ring-opacity-40"
                  placeholder="Password"
                  autoComplete="off"
                  required
                />
                <div className="ml-2 text-gray-500">
                  <FontAwesomeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                </div>
              </div>
              {showerrorMessage.length !== 0 && (
                <div className="text-red-500 text-sm font-medium">
                  {showerrorMessage}
                </div>
              )}
              <div className="mt-6 pb-5">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm tracking-wide bg-blue-800 text-white transition-colors duration-200 transform rounded-md hover:bg-blue focus:outline-none focus:bg-blue "
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;

import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Login from "../Login/Login";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");

  const email = Cookies.get("email");
  const password = Cookies.get("password");
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-cookie-data", { withCredentials: true })
      .then((response) => {
        // console.log(response);
        const cookieData = response.data.auth;
        if (cookieData) {
          setToken(cookieData);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleTokenExpiration = async () => {
    if (!token) {
      // If token is expired check for user exist. If user regenerate token , else redirect to login page
      if (email && password) {
        const newUser = {
          email,
          password,
        };

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
            updateValue(token);
          });
      } else {
        <Login></Login>;
      }
    }
  };

  const updateValue = async (tokens) => {
    await axios.post(
      "http://localhost:5000/api/loginn",
      { tokens },
      { withCredentials: true }
    );

    axios
      .get("http://localhost:5000/get-cookie-data", { withCredentials: true })
      .then((response) => {
        const cookieData = response.data.auth;
        setToken(cookieData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Automatically regenerate token after 2 hour
  useEffect(() => {
    const tokenExpirationTimeout = setTimeout(() => {
      handleTokenExpiration();
    },  2 * 60 * 60 * 1000); // 2 hour

    return () => {
      clearTimeout(tokenExpirationTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

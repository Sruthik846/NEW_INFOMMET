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
    const savedToken = localStorage.getItem("info_Authtoken");
    if (savedToken) {
      setToken(savedToken);
      generateToken();
    } else {
      // window.location.href = "/";
    }
  }, []);

  const generateToken = () => {
    const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
    return { value: token, expirationTime };
  };

  const handleTokenExpiration = async () => {
    if (!token || !token.expirationTime) {
      updateToken("");
      // console.log("Expired");
      // If token is expired check for user exist . If user regenerate token , else redirect to login page
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
            setToken(response.data["token"]);
            generateToken();
            localStorage.setItem("info_Authtoken", response.data["token"]);
          });
      } else {
        <Login></Login>;
      }
    }
  };

  // Automatically regenerate token after 2 hour
  useEffect(() => {
    const tokenExpirationTimeout = setTimeout(() => {
      handleTokenExpiration();
    }, 2 * 60 * 60 * 1000); // 2 hour

    return () => {
      clearTimeout(tokenExpirationTimeout);
    };
  }, []);

  const updateToken = async (newToken) => {
    setToken(newToken);
    localStorage.setItem("info_Authtoken", newToken);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

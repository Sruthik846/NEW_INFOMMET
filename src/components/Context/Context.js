import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Login from "../Login/Login";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [ContexToken, setContexToken] = useState("");
  const [emailCookie, setemailCookie] = useState("");
  const [nameCookie, setnameCookie] = useState("");
  const [passwordCookie, setpasswordCookie] = useState("");
  const [ifidCookie, setifidCookie] = useState("");
  const [deptCookie, setdeptCookie] = useState("");
  const [userTypeCooklie, setuserTypeCooklie] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-cookie-data", { withCredentials: true })
      .then((response) => {
        const cookieData = response.data.auth;
        const email = response.data.email;
        const password = response.data.password;
        const ifid = response.data.ifid;
        const department = response.data.department;
        const usertype = response.data.usertype;
        const name = response.data.name;

        if (cookieData) {
          setContexToken(cookieData);
          setemailCookie(email);
          setpasswordCookie(password);
          setifidCookie(ifid);
          setdeptCookie(department);
          setuserTypeCooklie(usertype);
          setnameCookie(name);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleTokenExpiration = async () => {
    if (!ContexToken) {
      // If ContexToken is expired check for user exist. If user regenerate ContexToken , else redirect to login page
      if (emailCookie && passwordCookie) {
        const newUser = {
          emailCookie,
          passwordCookie,
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
            const ContexToken = response.data["ContexToken"];
            updateValue(ContexToken);
          });
      } else {
        <Login></Login>;
      }
    }
  };

  const updateValue = async (ContexTokens) => {
    await axios.post(
      "http://localhost:5000/api/loginn",
      { ContexTokens },
      { withCredentials: true }
    );

    axios
      .get("http://localhost:5000/get-cookie-data", { withCredentials: true })
      .then((response) => {
        const contextCookieData = response.data.auth;
        setContexToken(contextCookieData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Automatically regenerate ContexToken after 2 hour
  useEffect(() => {
    const ContexTokenExpirationTimeout = setTimeout(() => {
      handleTokenExpiration();
    }, 2 * 60 * 60 * 1000); // 2 hour

    return () => {
      clearTimeout(ContexTokenExpirationTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ContexToken,
        emailCookie,
        passwordCookie,
        nameCookie,
        ifidCookie,
        deptCookie,
        userTypeCooklie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

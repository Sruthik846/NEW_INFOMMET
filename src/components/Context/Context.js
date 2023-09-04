import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Login from "../Login/Login";
import Logout from "../Logout/Logout";

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
    const interval = setInterval(() => {
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
        } else{
          const condition = true;
          handleTokenExpiration(condition,email,password);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }, 1000); // Check every second (1000 milliseconds)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);

    
  }, []);


  const handleTokenExpiration = async (condition,email,password) => {
    if (condition) {
      // If ContexToken is expired check for user exist. If user regenerate ContexToken , else redirect to login page
      console.log('Data ',email, password)
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
            console.log(response.data);
            const ContexToken = response.data["token"];
            const emailCookie = newUser["email"];
            const passwordCookie = newUser["password"];
            const nameCookie = response.data["user"]["name"];
            const ifidCookie = response.data["user"]["if_id"];
            const deptCookie = response.data["user"]["department"];
            const userTypeCookie = response.data["user"]["user_type"];
            console.log("usertype : ", userTypeCookie);
            updateValue(
              ContexToken,
              emailCookie,
              passwordCookie,
              ifidCookie,
              deptCookie,
              userTypeCookie,
              nameCookie
            );
          });
      } else {
        console.log("redirected to login");
        <Login></Login>
      }
    }
  };

  const updateValue = async (
    tokens,
    emailCookie,
    passwordCookie,
    ifidCookie,
    deptCookie,
    userTypeCookie,
    nameCookie
  ) => {
    await axios.post(
      "http://localhost:5000/api/loginn",
      {
        tokens,
        emailCookie,
        passwordCookie,
        ifidCookie,
        deptCookie,
        userTypeCookie,
        nameCookie,
      },
      { withCredentials: true }
    );
    console.log(emailCookie, ifidCookie);
  

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

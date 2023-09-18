import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Login from "../Login/Login";
import CryptoJS from "crypto-js";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [tokenVal, setToken] = useState("");
  const [emailVal, setemail] = useState("");
  const [passwordVal, setpassword] = useState("");
  const [ifidVal, setifid] = useState("");
  const [nameVal, setname] = useState("");
  const [deptVal, setdept] = useState("");
  const [userVal, setuserType] = useState("");

  useEffect(() => {
    // Decrypt data from cookies, saved to var and passed this cookie values to all components
    if (Cookies.get("infoToken")) {
      const tokenData = Cookies.get("infoToken");
      // Decrypting data
      const tokenVal = CryptoJS.AES.decrypt(tokenData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setToken(tokenVal);

      const emailData = Cookies.get("Email");
      const emailVal = CryptoJS.AES.decrypt(emailData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setemail(emailVal);

      const passwordData = Cookies.get("Password");
      const passwordVal = CryptoJS.AES.decrypt( passwordData,"secret-key").toString(
        CryptoJS.enc.Utf8);
      setpassword(passwordVal);

      const nameData = Cookies.get("Name");
      const nameVal = CryptoJS.AES.decrypt(nameData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setname(nameVal);

      const ifidData = Cookies.get("Ifid");
      const ifidVal = CryptoJS.AES.decrypt(ifidData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setifid(ifidVal);

      const deptData = Cookies.get("Department");
      const deptVal = CryptoJS.AES.decrypt(deptData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setdept(deptVal);

      const userData = Cookies.get("UserType");
      const userVal = CryptoJS.AES.decrypt(userData, "secret-key").toString(
        CryptoJS.enc.Utf8
      );
      setuserType(userVal);
    }
  }, []);

  const handleTokenExpiration = async () => {
    // To check if token exist
    if (!Cookies.get("infoToken")) {
      // To check user exist
      if (Cookies.get("Email") && Cookies.get("Password")) {
        // if exist regenerate token using login credentials ( stored in cookie )
        const emailData = Cookies.get("Email");
        const email = CryptoJS.AES.decrypt(emailData, "secret-key").toString(
          CryptoJS.enc.Utf8
        );

        const passwordData = Cookies.get("Password");
        const password = CryptoJS.AES.decrypt(passwordData,"secret-key").toString(
          CryptoJS.enc.Utf8);

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
            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1);
            const tokanVal = CryptoJS.AES.encrypt(
              response.data["token"],
              "secret-key"
            ).toString();
            Cookies.set("infoToken", tokanVal, {
              expires: expirationTime,
            });
          });
      } else {
        // If not user, redirected to loginpage
        <Login></Login>;
      }
    }
  };

  // Token expire after 2 hour, go to handleTokenexpiration() and regenerate new token
  useEffect(() => {
    const tokenExpirationTimeout = setTimeout(() => {
      handleTokenExpiration();
    }, 2 * 60 * 60 * 1000); // 2 hour

    return () => {
      clearTimeout(tokenExpirationTimeout);
    };
  }, []);


  return (
    <AuthContext.Provider
      value={{
        tokenVal,
        deptVal,
        ifidVal,
        nameVal,
        passwordVal,
        emailVal,
        userVal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

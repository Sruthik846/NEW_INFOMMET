import axios from "axios";
import { useEffect } from "react";
import { createContext } from "react";
// import Cookies from "js-cookie";
import Cookies from "universal-cookie";

const AuthContext = createContext({})
const cookies = new Cookies();

  axios.get('http://localhost:5000/get-cookie-data', { withCredentials: true })
  .then(response => {
    // console.log(response);
    const cookieData = response.data.auth;
    console.log('Cookie Data:', cookieData);
  })
  .catch(error => {
    console.error('Error:', error);
  });

export const AuthContextProvider = () => {
    const loginApiCall = async (payload) =>{
        const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 20|YuM6aPDZhJXBJ8NV2Zx4zaAGY7jBYZnJkAwcvcu0",
            },
            
          };
          const body = JSON.stringify(payload);
        await axios.post("https://meetingapi.infolksgroup.com/api/login", body,{
            withCredentials:true,
        }).then((response) =>{
            const token = response.data["token"];
          Cookies.set("info_Authtoken", token);
          Cookies.set("email", ['admin@admin.com']);
          Cookies.set("password", ["admin@admin.com"],{httpOnly:true});
          Cookies.set("name", response.data["user"]["name"],{httpOnly:true});
          Cookies.set("ifid", response.data["user"]["if_id"],{httpOnly:true});
          Cookies.set("department", response.data["user"]["department"],{httpOnly:true});
          Cookies.set("user_type", response.data["user"]["user_type"],{httpOnly:true});
          window.location.href = "/home";
        });
    };
    return <AuthContext.Provider value={{ loginApiCall}}></AuthContext.Provider>

};

export default AuthContext;
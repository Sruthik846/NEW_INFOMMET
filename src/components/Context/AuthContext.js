import axios from "axios";
import { createContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({})

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
          // localStorage.setItem("info_Authtoken", token);
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
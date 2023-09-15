import React, { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { tokenVal } = useContext(AuthContext);
  const ContexToken = tokenVal;
  const navigate = useNavigate();

  // const { updateToken } = useContext(AuthContext);
  const handleLogout = async () => {
    if(!Cookies.get("infoToken")){
      navigate("/");
    }
    await axios
      .post("http://meetingapi.infolksgroup.com/api/logout", null, {
        headers: {
          Authorization: `Bearer ${ContexToken}`,
        },
      })
      .then((response) => {
        Cookies.remove("Email");
        Cookies.remove("Name");
        Cookies.remove("Ifid");
        Cookies.remove("Department");
        Cookies.remove("UserType");
        Cookies.remove("Password");

        Cookies.remove("infoToken");
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex gap-1 text-sm" onClick={handleLogout}>
      <FaSignOutAlt className="mt-1"></FaSignOutAlt>
      <p>Logout</p>
    </div>
  );
}

export default Logout;

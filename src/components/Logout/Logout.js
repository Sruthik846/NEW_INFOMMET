import React, { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

function Logout() {
  const token = localStorage.getItem("info_Authtoken");
  const { updateToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    // console.log('Logout token' ,token);
    await axios
      .post("http://meetingapi.infolksgroup.com/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);

        localStorage.removeItem("info_Authtoken");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpirationTime");
        updateToken("");
        // window.location.reload();
        navigate("/");
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

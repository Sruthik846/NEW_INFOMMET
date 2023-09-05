import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../Context/Context";
import Cookies from "js-cookie";
import { useContext } from "react";


function Logout() {
  const { ContexToken } = useContext(AuthContext);

  // const { updateToken } = useContext(AuthContext);
  const handleLogout = async () => {
    await axios
      .post("http://meetingapi.infolksgroup.com/api/logout", null, {
        headers: {
          Authorization: `Bearer ${ContexToken}`,
        },
      })
      .then((response) => {
        Cookies.remove("email");
        Cookies.remove("name");
        Cookies.remove("ifid");
        Cookies.remove("department");
        Cookies.remove("user_type");
        Cookies.remove("password");
        axios
          .get("http://localhost:5000/clear-cookie", { withCredentials: true })
          .then((response) => {
            // console.log("Cookie deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting cookie:", error);
          });
        Cookies.remove("info_Authtoken");
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

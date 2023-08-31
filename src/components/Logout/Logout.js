import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
// import { AuthContext } from "../Context/Context";
import Cookies from "js-cookie";

function Logout() {
  const token = Cookies.get("info_Authtoken");
  // const { updateToken } = useContext(AuthContext);
  const handleLogout = async () => {
    await axios
      .post("http://meetingapi.infolksgroup.com/api/logout",null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Cookies.remove('info_Authtoken');
        Cookies.remove('email');
        Cookies.remove('name');
        Cookies.remove('ifid');
        Cookies.remove('department');
        Cookies.remove('user_type');
        Cookies.remove('password');
        
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

import "./App.css";
import React, { useEffect, useState } from "react";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Users from "./components/Users/Users";
import Meetings from "./components/Meetings/Meetings";
import Hall from "./components/Halls/Hall";
import { AuthProvider } from "./components/Context/Context";
import { UserProvider } from "./components/Context/UserContext";
import Accesdenied from "./components/Error/404Error";
import Cookies from "js-cookie";
import Loading from "./components/Login/Loading";
import AddHall from "./components/Halls/AddHall";
import EditHall from "./components/Halls/EditHall";
import EditUser from "./components/Users/EditUser";
import AddUser from "./components/Users/AddUser";
import AddMeeting from "./components/Meetings/AddMeeting";
import EditMeeting from "./components/Meetings/EditMeeting";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Logout from "./components/Logout/Logout";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [restrictedLink, setLink] = useState(false);
  const [token, setToken] = useState("");
  // const token = localStorage.getItem("token");

  const restrictedLinks = {
    user: ["/users", "/hall"],
    admin: [],
  };
  const userType = Cookies.get("user_type");
  if (userType && !restrictedLink) {
    const hasRestrictedLinks = userType && restrictedLinks[userType].length > 0;
    if (hasRestrictedLinks !== false) {
      setLink(true);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("info_Authtoken");
    setToken(storedToken);
  }, []);


  // const expirationTime = localStorage.getItem("tokenExpirationTime");
  // console.log(expirationTime, new Date().getTime())
  // if (
  //   token &&
  //   expirationTime &&
  //   new Date().getTime() < parseInt(expirationTime)
  // ) {
  //   console.log("Token exist");
  // } else {
  //   console.log("Expired");
  // }

  // if ( new Date().getTime() < parseInt(expirationTime)){
  //   console.log("EXPIREDDDDDDDDD")
  // }
  return (
    <div className="App">
      <AuthProvider>
        <UserProvider>
          <Router>
            {isLoading ? (
              <Loading></Loading>
            ) : userType ? (
              <Routes>
                <Route path="/loading" element={<Loading></Loading>} />
                <Route
                  path="/home"
                  element={token ? <Home></Home> : <Navigate to="/"></Navigate>}
                />
                <Route
                  path="/error"
                  element={<Accesdenied></Accesdenied>}
                ></Route>
                <Route path="/" element={<Login></Login>}></Route>
                {restrictedLink === false ? (
                  <Route
                    path="/users"
                    element={
                      token ? <Users></Users> : <Navigate to="/"></Navigate>
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/users"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}

                <Route
                  path="/meeting"
                  element={
                    token ? <Meetings></Meetings> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/addmeeting"
                  element={
                    token ? (
                      <AddMeeting></AddMeeting>
                    ) : (
                      <Navigate to="/"></Navigate>
                    )
                  }
                ></Route>
                <Route
                  path="/editmeeting"
                  element={
                    token ? (
                      <EditMeeting></EditMeeting>
                    ) : (
                      <Navigate to="/"></Navigate>
                    )
                  }
                ></Route>

                {restrictedLink === false ? (
                  <Route
                    path="/hall"
                    element={
                      token ? <Hall></Hall> : <Navigate to="/"></Navigate>
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/hall"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}
                {restrictedLink === false ? (
                  <Route
                    path="/addhall"
                    element={
                      token ? <AddHall></AddHall> : <Navigate to="/"></Navigate>
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/addhall"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}

                {restrictedLink === false ? (
                  <Route
                    path="/edithall"
                    element={
                      token ? (
                        <EditHall></EditHall>
                      ) : (
                        <Navigate to="/"></Navigate>
                      )
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/edithall"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}

                {restrictedLink === false ? (
                  <Route
                    path="/edituser"
                    element={
                      token ? (
                        <EditUser></EditUser>
                      ) : (
                        <Navigate to="/"></Navigate>
                      )
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/edituser"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}

                {restrictedLink === false ? (
                  <Route
                    path="/adduser"
                    element={
                      token ? <AddUser></AddUser> : <Navigate to="/"></Navigate>
                    }
                  ></Route>
                ) : (
                  <Route
                    path="/adduser"
                    element={<Accesdenied></Accesdenied>}
                  ></Route>
                )}
              </Routes>
            ) : (
              <Routes>
                <Route path="/loading" element={<Loading></Loading>}></Route>
                <Route path="/" element={<Login></Login>}></Route>
                <Route
                  path="/meeting"
                  element={
                    token ? <Meetings></Meetings> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/home"
                  element={token ? <Home></Home> : <Navigate to="/"></Navigate>}
                />
                <Route
                  path="/hall"
                  element={token ? <Hall></Hall> : <Navigate to="/"></Navigate>}
                ></Route>
                <Route
                  path="/addhall"
                  element={
                    token ? <AddHall></AddHall> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/edithall"
                  element={
                    token ? <EditHall></EditHall> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/error"
                  element={<Accesdenied></Accesdenied>}
                ></Route>
                <Route
                  path="/users"
                  element={
                    token ? <Users></Users> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/edituser"
                  element={
                    token ? <EditUser></EditUser> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/adduser"
                  element={
                    token ? <AddUser></AddUser> : <Navigate to="/"></Navigate>
                  }
                ></Route>
                <Route
                  path="/addmeeting"
                  element={
                    token ? (
                      <AddMeeting></AddMeeting>
                    ) : (
                      <Navigate to="/"></Navigate>
                    )
                  }
                ></Route>
                <Route
                  path="/editmeeting"
                  element={
                    token ? (
                      <EditMeeting></EditMeeting>
                    ) : (
                      <Navigate to="/"></Navigate>
                    )
                  }
                ></Route>
              </Routes>
            )}
          </Router>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

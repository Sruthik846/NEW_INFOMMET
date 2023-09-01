import "./App.css";
import React, { useEffect, useState } from "react";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Users from "./components/Users/Users";
import Meetings from "./components/Meetings/Meetings";
import Hall from "./components/Halls/Hall";
import { AuthProvider } from "./components/Context/Context";
import Accesdenied from "./components/Error/404Error";
import Cookies from "js-cookie";
import Loading from "./components/Login/Loading";
import AddHall from "./components/Halls/AddHall";
import EditHall from "./components/Halls/EditHall";
import EditUser from "./components/Users/EditUser";
import AddUser from "./components/Users/AddUser";
import AddMeeting from "./components/Meetings/AddMeeting";
import EditMeeting from "./components/Meetings/EditMeeting";
import { Provider } from "react-redux";
import store from "./store";
import { CookiesProvider } from "react-cookie";
import axios from "axios";
import CookieMonitorMiddleware from "./CookieMonitorMiddleware";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import NetworkError from "./components/Error/NetworkError";
// import { AuthContextProvider} from './components/Context/AuthContext'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [restrictedLink, setLink] = useState(false);
  const [token, setToken] = useState("");

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
    axios.get('http://localhost:5000/get-cookie-data', { withCredentials: true })
  .then(response => {
    const cookieData = response.data.auth;
    setToken(cookieData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  }, []);

  console.log("Token fhgfgj",token);

  return (
    <div className="App">
      {/* <AuthContextProvider> */}
      <CookiesProvider>
        <CookieMonitorMiddleware>
          <Provider store={store}>
            <AuthProvider>
              <Router>
                {isLoading ? (
                  <Loading></Loading>
                ) : userType ? (
                  <Routes>
                    <Route path="/loading" element={<Loading></Loading>} />
                    <Route
                      path="/home"
                      element={
                        token ? <Home></Home> : <Navigate to="/"></Navigate>
                      }
                    />
                    <Route
                      path="/networkError"
                      element={<NetworkError></NetworkError>}
                    ></Route>
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
                        token ? (
                          <Meetings></Meetings>
                        ) : (
                          <Navigate to="/"></Navigate>
                        )
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
                          <Hall></Hall>
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
                          token ? (
                            <AddHall></AddHall>
                          ) : (
                            <Navigate to="/"></Navigate>
                          )
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
                          token ? (
                            <AddUser></AddUser>
                          ) : (
                            <Navigate to="/"></Navigate>
                          )
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
                    <Route
                      path="/loading"
                      element={<Loading></Loading>}
                    ></Route>
                    <Route path="/" element={<Login></Login>}></Route>
                    <Route
                      path="/meeting"
                      element={
                        token ? (
                          <Meetings></Meetings>
                        ) : (
                          <Navigate to="/"></Navigate>
                        )
                      }
                    ></Route>
                    <Route
                      path="/home"
                      element={
                        token ? <Home></Home> : <Navigate to="/"></Navigate>
                      }
                    />
                    <Route
                      path="/hall"
                      element={
                        <Hall></Hall>
                      }
                    ></Route>
                    <Route
                      path="/addhall"
                      element={
                        token ? (
                          <AddHall></AddHall>
                        ) : (
                          <Navigate to="/"></Navigate>
                        )
                      }
                    ></Route>
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
                    <Route
                      path="/error"
                      element={<Accesdenied></Accesdenied>}
                    ></Route>

                    <Route
                      path="/networkerror"
                      element={<NetworkError></NetworkError>}
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
                        token ? (
                          <EditUser></EditUser>
                        ) : (
                          <Navigate to="/"></Navigate>
                        )
                      }
                    ></Route>
                    <Route
                      path="/adduser"
                      element={
                        token ? (
                          <AddUser></AddUser>
                        ) : (
                          <Navigate to="/"></Navigate>
                        )
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
            </AuthProvider>
          </Provider>
        </CookieMonitorMiddleware>
      </CookiesProvider>
      {/* </AuthContextProvider> */}
    </div>
    
  );
}

export default App;

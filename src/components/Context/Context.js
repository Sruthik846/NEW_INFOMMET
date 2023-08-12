import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from local storage or any other persistent storage
    // window.location.reload()
    const savedToken = localStorage.getItem("info_Authtoken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("info_Authtoken", newToken);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

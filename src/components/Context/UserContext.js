import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    id: "",
    department: "",
    user_type: "",
  });

  const updateUser = (name, ifid, department, user_type) => {
    setUser({ name, ifid, department, user_type });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

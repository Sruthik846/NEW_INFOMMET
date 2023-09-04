import React, { useEffect } from "react";
// import { useCookies, withCookies } from "react-cookie";

function CookieMonitorMiddleware({ children }) {

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "email") {
        if (event.newValue === null) {
          console.log("Cookie deleted");
        } else {
          console.log("Cookie exist");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}

export default CookieMonitorMiddleware;

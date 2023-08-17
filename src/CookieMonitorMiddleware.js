import React, { useEffect } from "react";
// import { useCookies, withCookies } from "react-cookie";

function CookieMonitorMiddleware({ children }) {
  // const [cookies] = useCookies(["email"]);
  // const isCookieExist = cookies.cookieName !== undefined;
  // console.log(isCookieExist);

  // console.log(withCookies("email"));
  // console.log(document.cookie);
  // console.log(document.cookie.includes("email"));

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

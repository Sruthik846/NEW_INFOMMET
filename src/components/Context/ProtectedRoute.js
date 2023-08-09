import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Context";

function ProtectedRoute({ component: Component, ...rest }) {
  const { token } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Navigate to="/" replace />
      }
    />
  );
}

export default ProtectedRoute;

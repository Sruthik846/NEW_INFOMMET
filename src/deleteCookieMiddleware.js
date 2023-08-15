const deleteCookieMiddleware = (store) => (next) => (action) => {
  if (action.type === "DELETE_COOKIE") {
    console.log("Deleted action");
    localStorage.removeItem("info_Authtoken");
    store.dispatch({ type: "TOKEN_DELETED" });
  }
  return next(action);
};

export default deleteCookieMiddleware;

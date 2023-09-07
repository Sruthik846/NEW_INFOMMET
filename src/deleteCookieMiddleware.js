

const deleteCookieMiddleware = (store) => (next) => (action) => {
  if (action.type === "DELETE_COOKIE") {
    store.dispatch({ type: "TOKEN_DELETED" });
  }
  return next(action);
};

export default deleteCookieMiddleware;

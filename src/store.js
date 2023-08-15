// store.js
import { createStore, applyMiddleware } from 'redux';
import authenticationReducer from './authenticationReducer';
import deleteCookieMiddleware from './deleteCookieMiddleware';

const store = createStore(
  authenticationReducer,
  applyMiddleware(deleteCookieMiddleware, /* other middlewares */)
);

export default store;

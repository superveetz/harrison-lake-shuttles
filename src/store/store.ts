import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import authReducer from "./reducers/auth";
import appDataReducer from "./reducers/app-data";

const composeEnhancers =
  process.env.NODE_ENV === "development" ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

/*
 * Root reducer of the app
 */
export const RootReducer = combineReducers({
  auth: authReducer,
  appData: appDataReducer,
});

const store = createStore(RootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;

import * as actionTypes from "../actions/_actionTypes";
import { updateObject } from "../../shared/util";

import { AppData } from "../models/app-data";

export interface AppDataStore {
  app: AppData;
  error: any;
  loading: boolean;
}

const initialState: AppDataStore = {
  app: {
    id: "",
    name: "",
    infoEmail: "",
    companyStreetAddress: "",
    companyCity: "",
    companyProvState: "",
    companyPostalZip: "",
    companyStartYear: "",
  },
  error: null,
  loading: true, // start with loading true until app loads
};

const appDataGetStart = (state: AppDataStore, action: any) => {
  return updateObject(state, { error: null, loading: true });
};

const appDataGetSuccess = (state: AppDataStore, action: any) => {
  return updateObject(state, { app: action.appData, error: null, loading: false });
};

const appDataGetFail = (state: AppDataStore, action: any) => {
  return updateObject(state, { app: null, error: action.error, loading: false });
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.APP_DATA_GET_START:
      return appDataGetStart(state, action);

    case actionTypes.APP_DATA_GET_SUCCESS:
      return appDataGetSuccess(state, action);

    case actionTypes.APP_DATA_GET_FAIL:
      return appDataGetFail(state, action);

    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "./_actionTypes";

import { AppData } from "../models/app-data";

export const appDataGetStart = () => {
  return { type: actionTypes.APP_DATA_GET_START };
};

export const appDataGetSuccess = (appData: AppData) => {
  return { type: actionTypes.APP_DATA_GET_SUCCESS, appData: appData };
};

export const appDataGetFail = (error: any) => {
  return { type: actionTypes.APP_DATA_GET_FAIL, error: error };
};

import * as actionTypes from './_actionTypes';

export const authStart = () => {
	return { type: actionTypes.AUTH_START };
};

export const authSuccess = (user: any) => {
	return { type: actionTypes.AUTH_SUCCESS, user: user };
};

export const authFail = (error: any) => {
	return { type: actionTypes.AUTH_FAIL, error: error };
};

export const authSignOut = () => {
	return { type: actionTypes.AUTH_SIGN_OUT };
};
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

// export const setAuthRedirectPath = (path: string) => {
// 	return { 
// 		type: actionTypes.SET_AUTH_REDIRECT_PATH,
// 		path: path
// 	};
// };

// export const checkAuthTimeout = (expirationTime: string) => {
// 	return (dispatch: Dispatch) => {
// 		setTimeout(() => {
// 			dispatch(authSignOut());
// 		}, parseInt(expirationTime) * 1000);
// 	};
// };

// export const auth = (email: string, password: string, isSignUp: boolean) => {
// 	return (dispatch: Dispatch) => {
// 		dispatch(authStart());
		
		// const authData = {
		// 	email: email,
		// 	password: password,
		// 	returnSecureToken: true
		// };
		
		// let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCsqx4ZiYn9wZ7PP3K4Glhj-1Uv8to6epQ";
		// if (!isSignUp) {
		// 	url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCsqx4ZiYn9wZ7PP3K4Glhj-1Uv8to6epQ"
		// }
		// axios.post(url, authData)
		// 	.then((res: any) => {
		// 		// console.log("res:", res);
		// 		localStorage.setItem('token', res.data.idToken);
		// 		const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
		// 		localStorage.setItem('expirationDate', expirationDate);
		// 		localStorage.setItem('token', res.data.idToken);
		// 		localStorage.setItem('userId', res.data.localId);
		// 		dispatch(authSuccess(res.data.idToken, res.data.localId));
		// 		dispatch(checkAuthTimeout(res.data.expiresIn));
		// 	})
		// 	.catch((err: any) => {
		// 		console.log("err:", err);
		// 		dispatch(authFail(err.response.data.error));
		// 	});
// 	};
// };

// export const authCheckState = () => {
// 	return dispatch => {
// 		const token = localStorage.getItem('token');
// 		if (!token) {
// 			dispatch(logout());
// 		} else {
// 			const expirationDate = new Date(localStorage.getItem('expirationDate'));
// 			if (expirationDate > new Date()) {
// 				const userId = localStorage.getItem('userId');
// 				dispatch(authSuccess(token, userId));
// 				dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
// 			} else {
// 				dispatch(logout());
// 			}
			
// 		}
// 	};
// };
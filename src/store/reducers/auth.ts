import * as actionTypes from '../actions/_actionTypes';
import { updateObject } from '../../shared/util';

import AWSConfig from '../../aws-exports';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

const initAWSUserPool = () => {
	const poolData = {
		UserPoolId: AWSConfig.aws_user_pools_id,
		ClientId: AWSConfig.aws_user_pools_web_client_id
	};
	
	return new CognitoUserPool(poolData);
};

const initialState = {
	user: null,
	error: null,
	loading: true, // start with loading true until app loads
	awsUserPool: initAWSUserPool()
};

const authStart = (state: any, action: any) => {
	return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state: any, action: any) => { 
	return updateObject(state, { 
		user: action.user,
		error: null,
		loading: false
	})
};

const authFail = (state: any, action: any) => {
	return updateObject(state, {
		error: action.error,
		loading: false
	});
};

const authSignOut = (state: any, action: any) => {
	return updateObject(state, { 
		user: null, 
		error: null, 
		loading: false
	});
};

const reducer = (state = initialState, action: any) => {
	switch (action.type ) {
		case actionTypes.AUTH_START: 				return authStart(state, action);

		case actionTypes.AUTH_SUCCESS: 				return authSuccess(state, action);

		case actionTypes.AUTH_FAIL: 				return authFail(state, action);

		case actionTypes.AUTH_SIGN_OUT: 			return authSignOut(state, action);

	default:
		return state
	}
};

export default reducer;
import { API, graphqlOperation, Auth } from "aws-amplify";
import credentials from "../credentials";

interface AuthServiceStaticMethods {
  ensureAuthSession(): Promise<any>;
}

let AuthService: AuthServiceStaticMethods;
AuthService = class AuthService {
  public static async ensureAuthSession(): Promise<any> {
    // ensure authenticated session
    try {
      await Auth.currentAuthenticatedUser();
    } catch (err) {
      // login as guest if not authenticated
      await Auth.signIn(credentials.guestUsername, credentials.guestPassword);
    }
  }
};

export default AuthService;

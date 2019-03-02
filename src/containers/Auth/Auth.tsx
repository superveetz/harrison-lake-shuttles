import * as React from "react";
import * as actions from "../../store/actions";
import { scrollToTop } from "../../shared/util";
import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Authenticator, Greetings } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import Spinner from "../../components/UI/Spinner/Spinner";
import AWSExports from "../../aws-exports";

// import * as classes from "./Auth.module.css";

interface IAuthProps extends RouteComponentProps<any> {
  currentUser: any;
  onAuthSuccess(user: any): void;
  onAuthSignOut(): void;
  onAuthFail(err: any): void;
}

interface IAuthState {
  waitForLoad: boolean;
}

class AuthContainer extends React.Component<IAuthProps, IAuthState> {
  public state: IAuthState = {
    waitForLoad: false,
  };

  constructor(props: IAuthProps) {
    super(props);

    this.isCurrentUserAuthAdmin = this.isCurrentUserAuthAdmin.bind(this);
  }

  private isCurrentUserAuthAdmin(cognitoUser: any) {
    if (
      cognitoUser &&
      cognitoUser.signInUserSession &&
      cognitoUser.signInUserSession.idToken &&
      cognitoUser.signInUserSession.idToken.payload &&
      cognitoUser.signInUserSession.idToken.payload["cognito:groups"]
    ) {
      const hasAdminRole = cognitoUser.signInUserSession.idToken.payload["cognito:groups"].find(
        (group: string) => group === "Full-Access-Admin",
      );

      if (hasAdminRole) {
        return true;
      }
    }

    return false;
  }

  componentWillMount() {
    scrollToTop();

    Auth.signOut();
    Auth.currentAuthenticatedUser()
      .then((res: any) => {
        Auth.signOut();
        this.setState({
          waitForLoad: true,
        });
      })
      .catch((err: any) => {
        this.setState({
          waitForLoad: true,
        });
      });
  }

  private authChangedHandler(authState: string, cognitoUser: any) {
    if (authState === "signedIn") {
      console.log("signed in");
      this.props.onAuthSuccess(cognitoUser);
      this.props.history.push("/admin");
    }
  }

  public render() {
    return (
      <div className="">
        {this.state.waitForLoad ? (
          <Authenticator
            // Fired when Authentication State changes
            onStateChange={(authState: any, cognitoUser: any) => this.authChangedHandler(authState, cognitoUser)}
            amplifyConfig={AWSExports}
            hide={[Greetings]}
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

// redux
function mapStateToProps(rootState: any) {
  return {
    currentUser: rootState.auth.user,
  };
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onAuthSuccess: (user: any) => dispatch(actions.authSuccess(user)),
    onAuthSignOut: () => dispatch(actions.authSignOut()),
    onAuthFail: (err: any) => dispatch(actions.authFail(err)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AuthContainer));

import * as React from "react";
import * as actions from "./store/actions";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { Auth, graphqlOperation, API } from "aws-amplify";
import { Dispatch, Action } from "redux";
import { AppDataStore } from "./store/reducers/app-data";
import { connect } from "react-redux";
import { AppData } from "./store/models/app-data";
import * as queries from "./graphql/queries";
import "./App.css";
import credentials from "./credentials";

// containers
import Layout from "./hoc/Layout/Layout";
import StyleGuide from "./containers/StyleGuide/StyleGuide";
import Home from "./containers/Home/Home";
import About from "./containers/About/About";
import BusRoutes from "./containers/BusRoutes/BusRoutes";
import Fares from "./containers/Fares/Fares";
import MoreInfo from "./containers/MoreInfo/MoreInfo";
import Contact from "./containers/Contact/Contact";
import BookNow from "./containers/BookNow/BookNow";
import PrivacyPolicy from "./containers/PrivacyPolicy/PrivacyPolicy";
import RouteNotFound404 from "./containers/NotFound404/NotFound404";
import AuthRoute from "./containers/Auth/Auth";
import Admin from "./containers/Admin/Admin";

import Spinner from "./components/UI/Spinner/Spinner";

interface AppReduxProps {
  appData: AppDataStore;
  currentUser: any;
  authLoading: boolean;
  onAuthStart: () => void;
  onAuthSignOut: () => void;
  onAuthSuccess: (user: any) => void;
  onAuthFail: (error: any) => void;
  onGetAppDataStart: () => void;
  onGetAppDataSuccess: (appData: any) => void;
  onGetAppDataFail: (error: any) => void;
}

class App extends React.Component<AppReduxProps, {}> {
  constructor(props: AppReduxProps) {
    super(props);

    // bind funcs
    this.isCurrentUserAuthAdmin = this.isCurrentUserAuthAdmin.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps: AppReduxProps) {
    // if (prevProps.currentUser !== this.props.currentUser) {
    //   console.log("forced update");
    //   this.forceUpdate();
    // }
  }

  async componentWillMount() {
    // ensure authenticated session
    try {
      this.props.onAuthStart();
      const res = await Auth.currentAuthenticatedUser();
      this.props.onAuthSuccess(res);
    } catch (err) {
      // login as guest if not authenticated
      const guest = await Auth.signIn(credentials.guestUsername, credentials.guestPassword);
      this.props.onAuthSuccess(guest);
    }

    // query for app data
    try {
      this.props.onGetAppDataStart();
      const res: any = await API.graphql(graphqlOperation(queries.listApps));
      const appData = res.data.listApps.items[0];
      this.props.onGetAppDataSuccess(appData);
    } catch (err) {
      // todo, send me an email
      this.props.onGetAppDataFail(err);
    }
  }

  private isCurrentUserAuthAdmin() {
    if (
      this.props.currentUser &&
      this.props.currentUser.signInUserSession &&
      this.props.currentUser.signInUserSession.idToken &&
      this.props.currentUser.signInUserSession.idToken.payload &&
      this.props.currentUser.signInUserSession.idToken.payload["cognito:groups"]
    ) {
      const hasAdminRole = this.props.currentUser.signInUserSession.idToken.payload["cognito:groups"].find(
        (group: string) => group === "Full-Access-Admin",
      );

      if (hasAdminRole) {
        return true;
      }
    }

    return false;
  }

  render() {
    // determine if this user is an authenticated admin
    const currentUserIsAuthAdmin = this.isCurrentUserAuthAdmin();

    let routes = (
      <Switch>
        {/* Static Pages */}
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/bus-routes" component={BusRoutes} />
        <Route path="/fares" component={Fares} />
        <Route path="/more-info" component={MoreInfo} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-now" appData={this.props.appData} component={BookNow} />
        <Route path="/style-guide" component={StyleGuide} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/login" component={AuthRoute} />
        <Route path="/404" component={RouteNotFound404} />

        {/* Authenticated Admin Routes */}
        {currentUserIsAuthAdmin ? <Route path="/admin" component={Admin} /> : null}

        {!this.props.authLoading ? <Redirect to="/404" /> : null}
      </Switch>
    );

    if (this.props.authLoading) routes = <Spinner />;

    return <Layout>{routes}</Layout>;
  }
}

function mapStateToProps(rootState: any) {
  return {
    currentUser: rootState.auth.user,
    authLoading: rootState.auth.loading,
    appData: rootState.appData,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onAuthStart: () => dispatch(actions.authStart()),
    onAuthSignOut: () => dispatch(actions.authSignOut()),
    onAuthSuccess: (user: any) => dispatch(actions.authSuccess(user)),
    onAuthFail: (error: any) => dispatch(actions.authFail(error)),
    onGetAppDataStart: () => dispatch(actions.appDataGetStart()),
    onGetAppDataSuccess: (appData: any) => dispatch(actions.appDataGetSuccess(appData)),
    onGetAppDataFail: (error: any) => dispatch(actions.appDataGetFail(error)),
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App) as any);

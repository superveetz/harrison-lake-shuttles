import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import Amplify, { Auth } from "aws-amplify";

// vendor css :todo - put this in css import
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

// app
import App from "./App";
import "./index.css";

// aws-amplify
import AWSExports from "./aws-exports";
Amplify.configure(AWSExports);

// redux store
import Store from "./store/store";

const app = (
  <Provider store={Store}>
    <BrowserRouter>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root") as HTMLElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

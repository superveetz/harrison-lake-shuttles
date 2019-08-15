import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { AppDataStore } from "../../../store/reducers/app-data";
import moment from "moment";

const classes: any = require("./Footer.module.css");
import logo from "../../../assets/img/logo-large.png";

import PageHeader from "../../UI/PageHeader/PageHeader";

interface FooterReduxProps {
  appData: AppDataStore;
}

class Footer extends React.Component<FooterReduxProps, {}> {
  render(): JSX.Element {
    const appName = this.props.appData.app ? this.props.appData.app.name : "";
    const companyStreetAddress = this.props.appData.app ? this.props.appData.app.companyStreetAddress : "";
    const companyCity = this.props.appData.app ? this.props.appData.app.companyCity : "";
    const companyProvState = this.props.appData.app ? this.props.appData.app.companyProvState : "";
    const companyPostalZip = this.props.appData.app ? this.props.appData.app.companyPostalZip : "";
    const infoEmail = this.props.appData.app ? this.props.appData.app.infoEmail : "";
    const startYear = this.props.appData.app ? this.props.appData.app.companyStartYear : "";

    return (
      <footer className={["mt-2", "d-print-none", classes.Footer].join(" ")}>
        <div className={classes.FooterCrown} />
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-3">
              <PageHeader classes="text-dark" invertColors elem="h2">
                <strong>{appName}</strong>
              </PageHeader>
              <ul className={["list-unstyled", classes.SiteMap].join(" ")}>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/book-now">
                    <i className="fa fa-caret-right" /> Book Now
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/">
                    <i className="fa fa-caret-right" /> Home
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/about">
                    <i className="fa fa-caret-right" /> About
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/bus-routes">
                    <i className="fa fa-caret-right" /> Bus Routes
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/fares">
                    <i className="fa fa-caret-right" /> Fares
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/more-info">
                    <i className="fa fa-caret-right" /> More Info
                  </Link>
                </li>
                <li>
                  <Link className="btn-block btn-link lead m-0" to="/contact">
                    <i className="fa fa-caret-right" /> Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className={[classes.FooterContactWrap, "col-lg-3 order-lg-3"].join(" ")}>
              <PageHeader elem="h2" classes="d-none text-dark d-lg-block" invertColors alignedRight={true}>
                <strong>Contact Us</strong>
              </PageHeader>

              <PageHeader elem="h2" invertColors classes="text-dark d-lg-none">
                <strong>Contact Us</strong>
              </PageHeader>

              <address className="d-lg-none text-dark" style={{ fontSize: "18px" }}>
                <strong className="mb-1">
                  <u>{appName}</u>
                </strong>{" "}
                <br />
                {companyStreetAddress},
                <br />
                {companyCity}, {companyProvState},
                <br />
                {companyPostalZip}
                <br />
                <br />
                <a style={{ fontWeight: "bold" }} href={`mailto:${infoEmail}`}>
                  {infoEmail}
                </a>
              </address>

              <address className="d-none d-lg-block text-right text-dark" style={{ fontSize: "18px" }}>
                <strong className="mb-1">
                  <u>{appName}</u>
                </strong>{" "}
                <br />
                {companyStreetAddress},
                <br />
                {companyCity}, {companyProvState},
                <br />
                {companyPostalZip}
                <br />
                <br />
                <a style={{ fontWeight: "bold" }} href={`mailto:${infoEmail}`}>
                  {infoEmail}
                </a>
              </address>
            </div>
            <div className="col-lg-6 d-flex d-justify-content-center">
              <div className="mx-auto" style={{ verticalAlign: "middle", display: "block", maxWidth: "80%" }}>
                <span style={{ verticalAlign: "middle", display: "inline-block", height: "100%" }} />
                <img
                  className="img-fluid"
                  style={{ verticalAlign: "middle", width: "100%" }}
                  src={logo}
                  alt="Easy Strata Logo"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.FooterBottom}>
          <p className="m-0  text-center text-light">
            Copyright &copy; {appName} {startYear} - {moment().format("YYYY")}
          </p>
          <p className="text-center">
            <small>
              <Link to="/privacy-policy">Terms of Service / Privacy Policy</Link>
            </small>
          </p>
        </div>
        <div className={classes.FooterVeryBottom}>
          Built &amp; powered by{" "}
          <a href="https://advsoftware.solutions" target="_blank">
            ADV Software Solutions <i className="fa fa-external-link" />
          </a>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(rootState: any) {
  return {
    appData: rootState.appData,
  };
}

export default connect(mapStateToProps)(Footer);

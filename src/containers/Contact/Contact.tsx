import * as React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";
import { AppDataStore } from "../../store/reducers/app-data";
import { scrollToTop } from "../../shared/util";

interface ContactProps {
  appData: AppDataStore;
}
class Contact extends React.Component<ContactProps, {}> {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Contact Starline Shuttles</PageHeader>

        <div className="row">
          <div className="col">
            <GoogleMap view="marker" />
          </div>

          <div className="col-lg-6">
            <PageHeader>Open 7 Days a Week</PageHeader>

            <p className="lead">
              Have a question? Give us a call or shoot us an email and we'll get back to you as soon as we can.
              <br />
            </p>

            <ul className="lead list-group">
              <li className="list-group-item">
                <i className="fa fa-fw fa-phone" /> &nbsp;
                <strong>
                  <a href="tel:6132983580" className="">
                    613-298-3580
                  </a>
                </strong>
                <br />
              </li>

              <li className="list-group-item">
                <i className="fa fa-fw fa-envelope" /> &nbsp;
                <strong>
                  {this.props.appData.app.infoEmail ? (
                    <a href={this.props.appData.app.infoEmail} className="">
                      {this.props.appData.app.infoEmail}
                    </a>
                  ) : null}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(rootState: any) {
  return {
    appData: rootState.appData,
  };
}

export default connect(mapStateToProps)(Contact);

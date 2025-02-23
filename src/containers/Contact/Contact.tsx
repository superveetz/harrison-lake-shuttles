import * as React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import { AppDataStore } from "../../store/reducers/app-data";
import { scrollToTop } from "../../shared/util";

import ContactUsImg from "../../assets/img/contact-us-img.jpg";

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
        <PageHeader>Contact {this.props.appData.app.name}</PageHeader>

        <div className="row">
          <div className="col">
            <img className="img-fluid" src={ContactUsImg} alt="Contact Us Image" />
          </div>

          <div className="col-lg-6">
            <PageHeader>Open 7 Days a Week</PageHeader>

            <p className="lead">
              Have a question? Send us an email or give us a call and we'll get back to you as soon as we can.
              <br />
            </p>

            <ul className="lead list-group">
              <li className="list-group-item">
                <i className="fa fa-fw fa-envelope-square" />
                &nbsp;
                <strong>
                  {this.props.appData.app.infoEmail ? (
                    <a href={`mailto:${this.props.appData.app.infoEmail}`} className="">
                      {this.props.appData.app.infoEmail}
                    </a>
                  ) : null}
                </strong>
              </li>
              <li className="list-group-item">
                <i className="fa fa-fw fa-phone-square" />
                &nbsp;
                <strong>
                    <a href={`tel:6043780481`} className="">
                      (604) 378-0481 
                    </a> 
                    <br />
                    (available after 10:30am PST)
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

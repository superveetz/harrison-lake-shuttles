import React, { Component } from "react";
import { scrollToTop } from "../../shared/util";

import testImg from "../../assets/slide-5.jpg";

import PageHeader from "../../components/UI/PageHeader/PageHeader";

class MoreInfo extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>General Information</PageHeader>

        <div className="row">
          <div className="col-sm-6">
            <div className="card bg-primary text-white mb-3">
              <img alt="Card image cap" className="card-img-top" src={testImg} />
              <div className="card-body">
                <h3 className="card-title">Who We Are</h3>
                <p className="lead card-text">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card bg-danger text-white mb-3">
              <img alt="Card image cap" className="card-img-top" src={testImg} />
              <div className="card-body">
                <h3 className="card-title">How We Work</h3>
                <p className="lead card-text">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card bg-success text-white mb-3">
              <img alt="Card image cap" className="card-img-top" src={testImg} />
              <div className="card-body">
                <h3 className="card-title">What To Expect</h3>
                <p className="lead card-text">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card bg-secondary text-white mb-3">
              <img alt="Card image cap" className="card-img-top" src={testImg} />
              <div className="card-body">
                <h3 className="card-title">Baggage Policies</h3>
                <p className="lead card-text">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MoreInfo;

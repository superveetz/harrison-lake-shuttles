import React, { Component } from "react";

import { scrollToTop } from "../../shared/util";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";

class BusRoutes extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Bus Routes</PageHeader>
        <div className="row">
          <div className="col-lg-8 col-12">
            <GoogleMap />
          </div>

          <div className="col-lg-4 col-12">
            <PageHeader elem="h2">Bus Schedule</PageHeader>

            <p className="lead">
              The bus makes two trips, everyday and make sure you goto the bath room first because this is a straight
              trip with no stops, drop offs or pick ups once the bus leaves.
            </p>

            <div className="col-12">
              <div className="card border-secondary">
                <h5 className="card-header">Harrison to Bridgeport&nbsp;Station</h5>
                <div className="card-body">
                  <p className="card-text text-dark">
                    <strong>
                      Departs 11:00 am &nbsp;
                      <i className="fa fa-fw fa-long-arrow-right" />
                      &nbsp; Arrives 1:50 pm
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}

            <hr />

            <div className="col-12">
              <div className="card border-secondary">
                <h5 className="card-header">Bridgeport&nbsp;Station to Harrison</h5>
                <div className="card-body">
                  <p className="card-text text-dark">
                    <strong>
                      Departs 2:00 pm &nbsp;
                      <i className="fa fa-fw fa-long-arrow-right" />
                      &nbsp; Arrives 4:35 pm
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
        </div>
      </div>
    );
  }
}

export default BusRoutes;

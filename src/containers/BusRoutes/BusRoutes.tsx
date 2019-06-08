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
        <PageHeader elem="h2">Bus Route</PageHeader>
        <div className="row">
          <div className="col-12">
            <p className="lead">
              The bus travels between Richmond and Harrison Hot Springs along the following route. Please note that the
              bus cannot provide service elsewhere other than the route displayed.
            </p>

            <GoogleMap />
          </div>
          {/* end col */}
        </div>
      </div>
    );
  }
}

export default BusRoutes;

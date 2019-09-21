import React, { Component } from "react";

import { scrollToTop } from "../../shared/util";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";

// imgs
import BridgeportMapImg from '../../assets/img/bridgeport-map.png';
import VanPickup1Img from '../../assets/img/pickup-van-1.jpg';
import VanPickup2Img from '../../assets/img/pickup-van-2.jpg';

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
        </div>
        {/* end row */}
        <PageHeader elem="h2 mt-4">Bridgeport Station Pick-up Location</PageHeader>
          <div className="row">
            <div className="col-12">
              <p className="lead mb-0 pb-0">
                Please refer to the map below to find our Bridgeport Station pick-up location.
              </p>

              <img src={BridgeportMapImg} className="img-fluid w-100" />
            </div>
          </div>
          {/* end row */}
          
          <p className="lead">
            The following pictures show our shuttle van parked at the pick-up point.
          </p>
          <div className="row">
            <div className="col-6">
              <img src={VanPickup1Img} className="img-fluid w-100" />
            </div>
            <div className="col-6">
              <img src={VanPickup2Img} className="img-fluid w-100" />
            </div>
          </div>
      </div>
    );
  }
}

export default BusRoutes;

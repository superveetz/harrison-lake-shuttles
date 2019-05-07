import React, { Component } from "react";
import { scrollToTop } from "../../shared/util";

import imgTripInfo from "../../assets/img/booking.png";
import imgBaggage from "../../assets/img/baggage.jpg";
import imgBusSafety from "../../assets/img/bus-safety.png";
import imgBus from "../../assets/img/slide-4.jpg";

import PageHeader from "../../components/UI/PageHeader/PageHeader";

class MoreInfo extends Component {
  private imgHeight: number = 435;

  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>General Information</PageHeader>

        <div className="row">
          <div className="col-md-6">
            <div className="card bg-primary text-white mb-3">
              <img
                alt="Card image cap"
                style={{ height: `${this.imgHeight}px` }}
                className="card-img-top"
                src={imgBus}
              />
              <div className="card-body">
                <h3 className="card-title">Trip Information:</h3>
                <div className="lead card-text">
                  <ul className="list-group bg-transparent border-0 list-group-flush">
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; The travel time in each direction is about 2 hours and 30 minutes.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Halfway through the trip, we will take a 15 minute rest stop.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Travel, pick-up, and drop-off times may vary depending on road conditions or other
                      unforeseeable occurances.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; The driver cannot pick you up or drop off off anywhere other than the terminus stop.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-success text-white mb-3">
              <img
                alt="Card image cap"
                style={{ height: `${this.imgHeight}px` }}
                className="card-img-top"
                src={imgTripInfo}
              />
              <div className="card-body">
                <h3 className="card-title">Before You Book:</h3>
                <div className="lead card-text">
                  <ul className="list-group bg-transparent border-0 list-group-flush">
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Passengers are encouraged to arrive at their stop 15 minutes early.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Please have your I.D. and booking confirmation ready for the driver before boarding.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; If you are not at your stop at the determined time, the driver will attempt to call your
                      provided telephone number twice. If the call is not answered, the driver will be forced to leave.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; No refund will be issued if you miss your bus.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-danger text-white mb-3">
              <img
                alt="Card image cap"
                style={{ height: `${this.imgHeight}px` }}
                className="card-img-top"
                src={imgBusSafety}
              />
              <div className="card-body">
                <h3 className="card-title">Bus Rules &amp; Regulations:</h3>
                <div className="lead card-text">
                  <ul className="list-group bg-transparent border-0 list-group-flush">
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; SAFETY FIRST. Any unsafe acts observed during the trip will not be tolerated.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; No smoking cigarettes, vaporizers, or otherwise.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Alcohol is not to be consumed prior to boarding or while on the bus.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Swearing or violent acts will not be tolerated.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-secondary text-white mb-3">
              <img
                alt="Card image cap"
                style={{ height: `${this.imgHeight}px` }}
                className="card-img-top"
                src={imgBaggage}
              />
              <div className="card-body">
                <h3 className="card-title">Baggage Policies:</h3>
                <div className="lead card-text">
                  <ul className="list-group bg-transparent border-0 list-group-flush">
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Passengers will be allowed ONE large suitcase. The bus can only hold a certain amount.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; One carry-on bag is permitted, either on your lap or under the seat infront of you.
                    </li>
                    <li className="list-group-item pb-1 pt-1 px-0 bg-transparent border-0">
                      &bull; Pets are NOT allowed at this time.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MoreInfo;

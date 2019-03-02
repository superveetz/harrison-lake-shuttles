import * as React from "react";
import { Link } from "react-router-dom";

import "./PricingTable.css";

import Button from "../Button/Button";

const pricingTable: React.SFC<{}> = (props) => {
  return (
    <section className="PricingTable">
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-5 mb-lg-0 shadow">
            <div className="card-body">
              <h5 className="card-title text-muted text-uppercase text-center">Infant</h5>
              <h6 className="card-price text-center">
                $0<span className="period">/ticket</span>
              </h6>

              <h6 className="card-title text-muted text-lowercase text-center">
                <em>ages: 2 or less</em>
              </h6>

              <hr />

              {/* <ul className="fa-ul">
                <li>
                  <span className="fa-li">
                    <i className="fa fa-check-circle text-success" />
                  </span>
                  1 Large Bus Seat
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fa fa-check-circle text-success" />
                  </span>
                  1 Large Bus Seat
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  USB Charging Outlets
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Free Movie Entertainment
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Wheelchair Lift Available
                </li>
                <li className="text-muted">
                  <span className="fa-li">
                    <i className="fas fa-times" />
                  </span>
                  Child Seat Not Provided
                </li>
              </ul> */}
              {/* <Link className="btn btn-block btn-outline-primary text-uppercase" to="/book-now">Book Now</Link> */}

              <div className="text-center">
                <Button size="btn-lg" kind="link" to="/book-now" classes="text-uppercase" theme="secondary">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-5 mb-lg-0 shadow">
            <div className="card-body">
              <h5 className="card-title text-muted text-uppercase text-center">Child</h5>
              <h6 className="card-price text-center">
                $59<span className="period">/ticket</span>
              </h6>

              <h6 className="card-title text-muted text-lowercase text-center">
                <em>Ages: 3 - 17</em>
              </h6>
              <hr />
              {/* <ul className="fa-ul">
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  1 Large Bus Seat
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Free Bus Wi-Fi
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  USB Charging Outlets
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Free Movie Entertainment
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Wheelchair Lift Available
                </li>
                <li className="text-muted">
                  <span className="fa-li">
                    <i className="fas fa-times" />
                  </span>
                  Child Seat Not Provided
                </li>
              </ul> */}

              <div className="text-center">
                <Button size="btn-lg" kind="link" to="/book-now" classes="text-uppercase" theme="secondary">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-5 shadow">
            <div className="card-body">
              <h5 className="card-title text-muted text-uppercase text-center">Adult</h5>
              <h6 className="card-price text-center">
                $59<span className="period">/ticket</span>
              </h6>
              <h6 className="card-title text-muted text-lowercase text-center">
                <em>ages: 18+</em>
              </h6>
              <hr />
              {/* <ul className="fa-ul">
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  1 Large Bus Seat
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Free Bus Wi-Fi
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  USB Charging Outlets
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Free Movie Entertainment
                </li>
                <li>
                  <span className="fa-li">
                    <i className="fas fa-check" />
                  </span>
                  Wheelchair Lift Available
                </li>
                <li className="text-muted">
                  <span className="fa-li">
                    <i className="fas fa-times" />
                  </span>
                  Alcohol &amp; Smoking Restricted
                </li>
              </ul> */}

              <div className="text-center">
                <Button size="btn-lg" kind="link" to="/book-now" classes="text-uppercase" theme="secondary">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default pricingTable;

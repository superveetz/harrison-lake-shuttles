import * as React from "react";
import { scrollToTop } from "../../shared/util";
import "./About.scss";
import testImg from "../../assets/img/slide-4.jpg";

import PageHeader from "../../components/UI/PageHeader/PageHeader";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";

class About extends React.Component<{}, {}> {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>About Harrison Lake Shuttles</PageHeader>

        <div className="row">
          <div className="col">
            <GoogleMap view="street" />
          </div>

          <div className="col-lg-4">
            <PageHeader>Our Mission</PageHeader>

            <p className="lead">
              To provide an affordable and comfortable journey between Vancouver and Harrison Hot Springs, everyday. At
              Starline, we understand that the worst part of getting out of the city is the commute. Getting stuck in
              weekend traffic with hardly any leg room is no way to travel. That's why we stive to provide ...
            </p>

            <hr />

            <div className="alert alert-primary" role="alert">
              Check us out on{" "}
              <a className="alert-link" href="https://www.tourismharrison.com/hotels-and-resorts" target="_blank">
                Tourism Harrison
              </a>
              ! <i className="fas fa-mountain" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;

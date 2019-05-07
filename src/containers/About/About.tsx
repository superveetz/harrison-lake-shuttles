import * as React from "react";
import { scrollToTop } from "../../shared/util";
import imgAbout from "../../assets/img/harrison-welcome-sign.jpg";

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

        <p className="lead">
          Harrison Lake Shuttles is locally owned and operated by residents of the village. We are very passionate about
          our little slice of paradise out here in the Fraser Valley. We are happy to provide a bus service so
          travellers from near and far can easily access Harrison Hot Springs.
        </p>

        <div className="">
          <img className="img-fluid" src={imgAbout} />
        </div>

        <hr />

        <div className="alert alert-primary" role="alert">
          Check us out on{" "}
          <a className="alert-link" href="https://www.tourismharrison.com/hotels-and-resorts" target="_blank">
            Tourism Harrison
          </a>
          ! <i className="fas fa-mountain" />
        </div>
      </div>
    );
  }
}

export default About;

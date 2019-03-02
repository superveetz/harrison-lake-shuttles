import React, { Component } from "react";
import { scrollToTop } from "../../shared/util";

import PageHeader from "../../components/UI/PageHeader/PageHeader";
import SubHeader from "../../components/UI/SubHeader/SubHeader";
import CheckList from "../../components/UI/CheckList/Checklist";
import Button from "../../components/UI/Button/Button";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";

class StyleGuide extends Component {
  componentDidMount() {
    scrollToTop();
  }

  state = {
    items: [
      {
        text: "Best Price Guarentee",
      },
      {
        text: "Prepay Securely Online",
      },
      {
        text: "Booking Instantly Confirmed",
      },
      {
        text: "Reliable & Safe Transport",
      },
    ],
  };

  render() {
    return (
      <section>
        <div className="container-fluid">
          <PageHeader elem="h2">About Starline Shuttles</PageHeader>

          <p className="lead">
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
            1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
            original form, accompanied by English versions from the 1914 translation by H. Rackham.
          </p>

          <CheckList items={this.state.items} />

          <div className="text-center">
            <Button kind="link" to="/about" theme="primary">
              Click Here to Book Now!
            </Button>

            <Button kind="button" theme="secondary">
              Click Here to Book Now 2!
            </Button>
          </div>

          <SubHeader elem="h3">
            <b>Passenger Ticket(s)</b>
          </SubHeader>
        </div>
      </section>
    );
  }
}

export default StyleGuide;

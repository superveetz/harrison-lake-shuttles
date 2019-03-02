import React, { Component } from "react";

import PageHeader from "../../components/UI/PageHeader/PageHeader";
import PricingTable from "../../components/UI/PricingTable/PricingTable";

class Fares extends Component {
  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Bus Fares</PageHeader>

        <p className="lead">
          All fares listed below are for round-trip tickets only. Upon booking your ticket, you will have the
          opportunity to select a departure date and any return date you wish.
        </p>

        <PricingTable />
      </div>
    );
  }
}

export default Fares;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import PricingTable from "../../components/UI/PricingTable/PricingTable";

class Fares extends Component {
  render() {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Bus Fares</PageHeader>

        <p className="lead">
          Fares are for one direction and do not include 5% service tax. Before you choose your ticket, we strongly
          recommend reading our <Link to="/more-info">More Info</Link> section to view all policies and regulations.
        </p>

        <PricingTable />
      </div>
    );
  }
}

export default Fares;

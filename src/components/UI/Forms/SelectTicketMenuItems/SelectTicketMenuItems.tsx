import * as React from "react";

import { MenuItem } from "@material-ui/core";

const classes: any = require("./SelectTicketMenuItems.module.css");
import SelectTicketCard from "../../Cards/SelectTicketCard/SelectTicketCard";
import Spinner from "../../Spinner/Spinner";

interface SelectTicketMenuItemsProps {
  ticketProducts: any[];
  showFullInfo: boolean;
  onClick: (e: React.MouseEvent<{}>) => void;
}

const selectTicketMenuItems: React.FunctionComponent<SelectTicketMenuItemsProps> = (
  props: SelectTicketMenuItemsProps,
) => {
  const { ticketProducts = [], showFullInfo = false } = props;
  if (!ticketProducts.length) return <Spinner />;

  const menuItems = ticketProducts.map((ticketProd: any, ticketProdIndex: number) => {
    return (
      <MenuItem
        value={ticketProd.id}
        className={classes.SelectMenuItem}
        key={ticketProdIndex}
        onClick={(e: React.MouseEvent<{}>) => {
          console.log("clicked", ticketProd.id);
        }}
      >
        {showFullInfo ? (
          <SelectTicketCard
            header="One Way Bus Ticket"
            title={ticketProd.departsLong}
            subTitle={ticketProd.arrivesLong}
            depAddrTitle="Departure Information:"
            depName={ticketProd.departsLocName}
            depDesc={ticketProd.departsDesc}
            depStreetAddr={ticketProd.departsLocStreet}
            depCity={ticketProd.departsLocCity}
            depProvince="BC"
            depPostalCode={ticketProd.departsLocPostal}
            depTime={`@ ${ticketProd.departsTime}`}
            arrAddrTitle="Arrival Information:"
            arrName={ticketProd.arrivesLocName}
            arrDesc={ticketProd.arrivesDesc}
            arrCity={ticketProd.arrivesLocCity}
            arrStreetAddr={ticketProd.arrivesLocStreet}
            arrPostalCode={ticketProd.arrivesLocPostal}
            arrTime={`@ ${ticketProd.arrivesTime}`}
            arrProvince="BC"
            transitTitle="Transit Information:"
            transitDesc={ticketProd.transitDesc}
            transitRestBreaks={ticketProd.restBreakLocations}
          />
        ) : (
          ticketProd.departsLong
        )}
      </MenuItem>
    );
  });

  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default selectTicketMenuItems;

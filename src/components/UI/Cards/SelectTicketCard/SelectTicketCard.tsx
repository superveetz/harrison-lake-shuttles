import * as React from "react";
import {
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
import Button from "../../Button/Button";

const classes: any = require("./SelectTicketCard.module.css");

export interface SelectTicketCardProps {
  header?: string;
  title: string;
  subTitle: string;

  depAddrTitle: string;
  depName: string;
  depDesc: string;
  depStreetAddr: string;
  depCity: string;
  depProvince: string;
  depPostalCode: string;
  depTime: string;

  transitTitle?: string;
  transitDesc?: string;
  transitRestBreaks?: string[];

  arrAddrTitle: string;
  arrDesc?: string;
  arrName?: string;
  arrStreetAddr?: string;
  arrCity?: string;
  arrProvince?: string;
  arrPostalCode?: string;
  arrTime?: string;
}

const selectTicketCard: React.SFC<SelectTicketCardProps> = (props: SelectTicketCardProps) => {
  return (
    <div className={classes.SelectTicketCard}>
      <Typography className={classes.Header} color="textSecondary" gutterBottom>
        {props.header}
      </Typography>
      <Typography className={classes.Title} variant="h5" component="h2">
        {props.title}
      </Typography>
      <Typography className={classes.SubTitle} align="right" color="textPrimary" variant="subtitle1" component="h4">
        &rarr; {props.subTitle}
      </Typography>

      <hr className="w-75 border-secondary" />

      <div className="row">
        <div className="col-12">
          {/* Departure Title */}
          <Typography className={classes.DepAddrTitle} variant="title" component="h4">
            <span>{props.depAddrTitle}</span>
          </Typography>
          {/* Address */}
          {props.depStreetAddr && props.depCity && props.depProvince && props.depPostalCode ? (
            // departure has address (leaving vancouver)
            <div
              className="float-left pl-0 pb-0 pr-0 pt-1 ml-0 mr-2 mb-0 mt-0 border-right border-secondary"
              style={{ whiteSpace: "normal", maxWidth: "125px" }}
            >
              <Typography className={classes.LocName}>
                <strong>{props.depName}</strong>
              </Typography>
              <Typography className={classes.DepAddr} component="address">
                {props.depStreetAddr}, <br />
                {props.depCity}, {props.depProvince} <br />
                {props.depPostalCode}
              </Typography>
              <Typography className={classes.DepTime} component="address">
                {props.depTime}
              </Typography>
            </div>
          ) : (
            // Departure has no address (leaveing harrison)
            <Typography className={classes.LocName}>
              <strong>{props.depName}</strong>

              <Typography className={[classes.DepTime, "float-right"].join(" ")} component="span">
                {props.depTime}
              </Typography>
            </Typography>
          )}

          {/* Description */}
          {props.depDesc ? (
            <Typography className={classes.ArrDesc} component="p" gutterBottom>
              {props.depDesc}
            </Typography>
          ) : null}
        </div>

        <hr className="w-75 border-secondary" />

        {/* Transit Info */}
        <div className="col-12">
          <Typography className={classes.DepAddrTitle} variant="title" component="h4">
            <span>{props.transitTitle}</span>
          </Typography>
          {props.transitRestBreaks ? (
            <div
              className="float-left pl-0 pb-0 pr-2 pt-1 ml-0 mr-2 mb-0 mt-0 border-right border-secondary"
              style={{ whiteSpace: "normal", maxWidth: "125px" }}
            >
              <Typography className={[classes.ArrDesc].join(" ")}>
                <strong>Rest Break</strong>
              </Typography>

              <ul className="list-unstyled">
                {props.transitRestBreaks.map((restBreak, restBreakIndex) => (
                  <li key={restBreakIndex}>{restBreak}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {props.transitDesc ? (
            <Typography className={classes.ArrDesc} component="p" gutterBottom>
              {props.transitDesc}
            </Typography>
          ) : null}
        </div>

        <hr className="w-75 border-secondary" />

        <div className="col-12">
          {/* Arrival Title */}
          <Typography className={classes.DepAddrTitle} variant="title" component="h4">
            <span>{props.arrAddrTitle}</span>
          </Typography>
          {/* Address */}
          {props.arrStreetAddr && props.arrCity && props.arrProvince && props.arrPostalCode ? (
            // departure has address (leaving vancouver)
            <div
              className="float-left pl-0 pb-0 pr-0 pt-1 ml-0 mr-2 mb-0 mt-0 border-right border-secondary"
              style={{ whiteSpace: "normal", maxWidth: "125px" }}
            >
              <Typography className={classes.LocName}>
                <strong>{props.arrName}</strong>
              </Typography>
              <Typography className={classes.DepAddr} component="address">
                {props.arrStreetAddr}, <br />
                {props.arrCity}, {props.arrProvince} <br />
                {props.arrPostalCode}
              </Typography>
              <Typography className={classes.DepTime} component="address">
                {props.arrTime}
              </Typography>
            </div>
          ) : (
            // Departure has no address (leaveing harrison)
            <Typography className={classes.LocName}>
              <strong>{props.arrName}</strong>

              <Typography className={[classes.DepTime, "float-right"].join(" ")} component="span">
                {props.arrTime}
              </Typography>
            </Typography>
          )}

          {/* Description */}
          {props.arrDesc ? (
            <Typography className={classes.ArrDesc} component="p" gutterBottom>
              {props.arrDesc}
            </Typography>
          ) : null}
        </div>

        <hr className="w-75 border-secondary" />

        <div className="w-100 text-center">
          <Button size="xs">Select Ticket</Button>
        </div>
      </div>
    </div>
  );
};

export default selectTicketCard;

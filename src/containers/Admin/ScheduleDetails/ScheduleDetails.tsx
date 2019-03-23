import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { scrollToTop } from "../../../shared/util";
import { API, graphqlOperation } from "aws-amplify";
import moment from "moment";
import { Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";

import Spinner, { SpinnerType, SpinnerSizes } from "../../../components/UI/Spinner/Spinner";
import PageHeader from "../../../components/UI/PageHeader/PageHeader";
import Button from "../../../components/UI/Button/Button";
import ScheduleService from "../../../dac/ScheduleService";

interface ScheduleDetailsRouteParams {
  scheduleId: string;
}

interface ScheduleDetailsProps extends RouteComponentProps<ScheduleDetailsRouteParams> {}

interface ScheduleDetailsState {
  scheduleLoaded: boolean;
  schedule: any;
}

class ScheduleDetails extends React.Component<ScheduleDetailsProps, ScheduleDetailsState> {
  public state: ScheduleDetailsState = {
    scheduleLoaded: false,
    schedule: null,
  };

  componentDidMount() {
    scrollToTop();
    ScheduleService.fetchSchedule(this.props.match.params.scheduleId)
      .then((schedule: any) => {
        console.log("fetched schedule:", schedule);
        this.setState({
          scheduleLoaded: true,
          schedule: schedule,
        });
      })
      .catch((err: any) => {
        console.log("err:", err);
      });
  }

  render() {
    return (
      <div className="container-fluid py-4">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <PageHeader>Schedule Details</PageHeader>
        </div>

        {this.state.scheduleLoaded && this.state.schedule ? (
          <div>
            <div className="float-left">
              <h2 className="">
                <small>General Information </small>
              </h2>

              {this.state.schedule.closed ? (
                <h2>
                  <span className="badge badge-warning">Route Closed</span>
                </h2>
              ) : null}
            </div>

            <div className="text-right d-print-none">
              <Button size="md" kind="button" theme="secondary" click={() => window.print()}>
                Print Schedule
              </Button>
            </div>

            <div
              style={{
                overflowX: "scroll",
                clear: "both",
              }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Date:</TableCell>
                    <TableCell>
                      <strong>{moment(this.state.schedule.date).format("MMM DD, YYYY")}</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Departing:</TableCell>
                    <TableCell>
                      <strong>{this.state.schedule.departureTicket.departsLocName}</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Arriving:</TableCell>
                    <TableCell>
                      <strong>{this.state.schedule.departureTicket.arrivesLocName}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <hr className="w-100 border border-light" />

            <div className="row mb-3">
              <div className="col-12">
                <ul className="list-group">
                  <li className="list-group-item">
                    Tickets Sold + Seats Reserved: &nbsp;
                    <strong>
                      {ScheduleService.tallyTotalScheduleTravellers(
                        this.state.schedule.tickets.items,
                        this.state.schedule.reservedSeats.items,
                      )}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>

            <h2>
              <small>Ticket Information</small>
            </h2>
            {this.state.schedule.tickets.items.length ? (
              <div
                style={{
                  overflowX: "scroll",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Group Information</TableCell>
                      <TableCell>Travellers Name</TableCell>
                      <TableCell>Ticket Type</TableCell>
                      <TableCell>Requires Wheelchair</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.schedule.tickets.items.map((ticket: any, ticketIndex: number) => {
                      return (
                        <TableRow key={ticketIndex}>
                          <TableCell>
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>{ticket.transaction.payeeName}</strong>
                              </li>
                            </ul>
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>{ticket.transaction.payeeEmail}</strong>
                              </li>
                            </ul>
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>{ticket.transaction.payeePhone}</strong>
                              </li>
                            </ul>
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>Total Paid:</strong> &nbsp;
                                <span>{`$${ticket.transaction.totalPaid.toFixed(2)}`}</span>
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell padding="none">
                            <ul className="list-inline pl-3 mt-0 pt-0">
                              {ticket.ticketTypes.items.map((ticketType: any, ticketTypeIndex: number) => {
                                return (
                                  <React.Fragment key={ticketTypeIndex}>
                                    <li className="border-bottom border-secondary py-1 mb-1">
                                      <strong>{ticketType.travellerName}</strong>
                                    </li>
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </TableCell>
                          <TableCell padding="none">
                            <ul className="list-inline pl-3 mt-0 pt-0">
                              {ticket.ticketTypes.items.map((ticketType: any, ticketTypeIndex: number) => {
                                return (
                                  <React.Fragment key={ticketTypeIndex}>
                                    <li className="border-bottom border-secondary py-1 mb-1">
                                      <strong>{ticketType.age.slice(0, 5) + ".."}</strong>
                                    </li>
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </TableCell>
                          <TableCell align="center" padding="none">
                            {ticket.requiresWheelchair ? (
                              <strong className="mt-0 pt-0">
                                <i className="fa fa-check" />
                              </strong>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <hr className="w-100 border border-light" />
              </div>
            ) : (
              <div className="alert alert-info">It appears there are no tickets sold for this schedule</div>
            )}

            <h2>
              <small>Reserved Seats</small>
            </h2>

            {this.state.schedule.reservedSeats.items.length ? (
              <div
                className="mb-4"
                style={{
                  overflowX: "scroll",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Travellers Name</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Requires Wheelchair</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.schedule.reservedSeats.items.map((reservedSeat: any, reservedSeatIndex: number) => {
                      return (
                        <TableRow key={reservedSeatIndex}>
                          <TableCell>
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>{reservedSeat.name}</strong>
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell padding="none">
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <strong>{reservedSeat.note}</strong>
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell align={window.innerWidth >= 992 ? "left" : "center"}>
                            <ul className="list-inline d-inline m-0 p-0">
                              <li className="list-inline-item">
                                <strong>
                                  {reservedSeat.requiresWheelchair ? <i className="fa fa-check" /> : null}
                                </strong>
                              </li>
                            </ul>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <hr className="w-100 border border-light" />
              </div>
            ) : (
              <div className="alert alert-info">It appears there are no reserved seats for this schedule</div>
            )}
            <div className="row mb-3 d-print-none">
              <button
                className="btn btn-link pull-left ml-2"
                type="button"
                onClick={() => this.props.history.push("/admin/schedule")}
              >
                <i className="fa fa-3x fa-chevron-circle-left text-secondary" />
              </button>
              <Button
                classes="mx-auto"
                theme="secondary"
                click={() => this.props.history.push("/admin/schedule/save/" + this.props.match.params.scheduleId)}
              >
                Edit Schedule
              </Button>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default withRouter(ScheduleDetails);

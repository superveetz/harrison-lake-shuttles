import * as React from "react";
import * as Yup from "yup";
import { scrollToTop } from "../../../shared/util";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Formik, FormikProps, Form, FieldArray, FieldArrayRenderProps } from "formik";
import { DatePicker } from "material-ui-pickers";
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Input, Paper } from "@material-ui/core";

const classes: any = require("../../../components/UI/Forms/SelectTicketMenuItems/SelectTicketMenuItems.module.css");
import PageHeader from "../../../components/UI/PageHeader/PageHeader";
import Spinner from "../../../components/UI/Spinner/Spinner";
import SelectTicketCard from "../../../components/UI/Cards/SelectTicketCard/SelectTicketCard";
import Button from "../../../components/UI/Button/Button";
import moment from "moment";
import ScheduleService from "../../../dac/ScheduleService";

interface ScheduleSaveFormValues {
  id: string;
  date: string;
  departureTicketId: string;
  reservedSeats: any[];
  closed: boolean;
}

interface ScheduleSaveRouteParams {
  scheduleId: string;
}

interface ScheduleSaveProps extends RouteComponentProps<ScheduleSaveRouteParams> {
  ticketProducts: any[];
}

interface ScheduleSaveState {
  isSelectRouteOpen: boolean;
  savingSchedule: boolean;
  fetchingSchedule: boolean;
  fetchedSchedule: any;
}

class ScheduleSave extends React.Component<ScheduleSaveProps, ScheduleSaveState> {
  public state: ScheduleSaveState = {
    isSelectRouteOpen: false,
    savingSchedule: false,
    fetchingSchedule: false,
    fetchedSchedule: null,
  };

  constructor(props: ScheduleSaveProps) {
    super(props);

    // bind funcs
    this.onScheduleSaveFormSubmit = this.onScheduleSaveFormSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSetSelectRouteOpen = this.onSetSelectRouteOpen.bind(this);
    this.onDeleteSchedule = this.onDeleteSchedule.bind(this);
  }

  async componentDidMount() {
    scrollToTop();
    // fetch schedule if necessary
    if (this.props.match.params.scheduleId) {
      // set loading
      this.setState({
        fetchingSchedule: true,
      });

      // fetch schedule
      ScheduleService.fetchSchedule(this.props.match.params.scheduleId)
        .then((schedule: any) => {
          console.log("schedule fetched:", schedule);
          // prep the reserved seats
          schedule.reservedSeats = schedule.reservedSeats.items ? schedule.reservedSeats.items : [];

          // set fetched schedule and loading
          this.setState({
            fetchingSchedule: false,
            fetchedSchedule: schedule,
          });
        })
        .catch((err: any) => {
          console.log("err:", err);
        });
    }
  }

  async onScheduleSaveFormSubmit(values: ScheduleSaveFormValues) {
    console.log("values:", values);
    // set saving
    this.setState({ savingSchedule: true });

    if (this.props.match.params.scheduleId) {
      // update existing schedule
      ScheduleService.updateSchedule(values)
        .then((schedule: any) => {
          console.log("schedule updated:", schedule);
          this.props.history.push("/admin/schedule/details/" + schedule.id);
        })
        .catch((err: any) => {
          console.log("err:", err);
        });
    } else {
      // create new schedule
      ScheduleService.createSchedule(values)
        .then((schedule: any) => {
          console.log("schedule:", schedule);
          this.props.history.push("/admin/schedule/details/" + schedule.id);
        })
        .catch((err: any) => {
          console.log("err:", err);
        });
    }
  }

  onChangeDate(e: React.ChangeEvent<ScheduleSaveFormValues>, formikBag: FormikProps<ScheduleSaveFormValues>) {
    formikBag.setFieldValue("date", (e as any)._d.toString());
  }

  onSetSelectRouteOpen(setIsSelectRouteOpen: boolean): void {
    this.setState({ isSelectRouteOpen: setIsSelectRouteOpen });
  }

  onDeleteSchedule(): void {
    // confirm deletion
    const confirmDeleteSchedule: boolean = confirm("Are you sure that you would like to delete the selected schedule?");

    if (confirmDeleteSchedule) {
      // set loading
      this.setState({
        savingSchedule: true,
      });
      // delete schedule
      ScheduleService.deleteSchedule(this.state.fetchedSchedule.id)
        .then((res: any) => {
          this.props.history.push("/admin/schedule");
        })
        .catch((err: any) => {
          console.log("err:", err);
        });
    }
  }

  render() {
    const menuItems = this.props.ticketProducts.map((ticketProd: any, ticketProdIndex: number) => {
      return (
        <MenuItem
          value={ticketProd.id}
          className={classes.SelectMenuItem}
          key={ticketProdIndex}
          onClick={(e: React.MouseEvent<{}>) => {
            console.log("clicked", ticketProd.id);
          }}
        >
          {this.state.isSelectRouteOpen ? (
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
    return (
      <div className="container-fluid py-4">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <PageHeader>Save Schedule</PageHeader>
        </div>

        <p className="alert alert-warning">
          <b>Warning:</b> There is no validation to ensure that there is not a schedule already created for the selected
          date and route or if the number of reserved seats plus the number of sold tickets is less than or equal to the
          number of seats on the bus. Proceed with caution when making changes.
        </p>

        {!this.props.match.params.scheduleId || (this.props.match.params.scheduleId && this.state.fetchedSchedule) ? (
          <Formik
            initialValues={{
              id: this.state.fetchedSchedule && this.state.fetchedSchedule.id ? this.state.fetchedSchedule.id : "",
              date:
                this.state.fetchedSchedule && this.state.fetchedSchedule.date
                  ? moment(this.state.fetchedSchedule.date).format("YYYY-MM-DD")
                  : moment(new Date()).format("YYYY-MM-DD"),
              departureTicketId:
                this.state.fetchedSchedule &&
                this.state.fetchedSchedule.departureTicket &&
                this.state.fetchedSchedule.departureTicket.id
                  ? this.state.fetchedSchedule.departureTicket.id
                  : "",
              reservedSeats:
                this.state.fetchedSchedule && this.state.fetchedSchedule.reservedSeats
                  ? this.state.fetchedSchedule.reservedSeats
                  : [],
              closed:
                this.state.fetchedSchedule && this.state.fetchedSchedule.closed
                  ? this.state.fetchedSchedule.closed
                  : false,
            }}
            validationSchema={Yup.object().shape({
              departureTicketId: Yup.string().required("Required"),
              reservedSeats: Yup.array().of(
                Yup.object().shape({
                  name: Yup.string().required("Required"),
                }),
              ),
            })}
            onSubmit={(values: ScheduleSaveFormValues) => this.onScheduleSaveFormSubmit(values)}
            render={(formikBag: FormikProps<ScheduleSaveFormValues>) => (
              <div>
                <Form>
                  <h2 className="mb-4 pb-2 border-bottom border-secondary">
                    <small>General Information</small>
                    {this.props.match.params.scheduleId && !this.state.fetchedSchedule.tickets.items.length ? (
                      <Button
                        kind="button"
                        classes="float-right"
                        theme="danger"
                        size="xs"
                        click={this.onDeleteSchedule}
                      >
                        <i className="fa fa-remove" /> {window.innerWidth >= 992 ? "Delete Schedule" : null}
                      </Button>
                    ) : null}
                  </h2>
                  <div className="row mb-3">
                    <div className="col-12">
                      {/* Date */}
                      <DatePicker
                        className="w-100"
                        autoOk={true}
                        initialFocusedDate={new Date(formikBag.values.date)}
                        format="MMMM DD, YYYY"
                        label="Schedule Date"
                        value={formikBag.values.date}
                        onChange={(e: React.ChangeEvent<ScheduleSaveFormValues>) => this.onChangeDate(e, formikBag)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-12">
                      {/* Departing Number of Passengers */}
                      <FormControl className="w-100">
                        {/* className={classes.formControl} */}
                        <InputLabel htmlFor="departureTicketId-required">
                          {formikBag.values.departureTicketId ? "Selected Route" : "Choose a route.."}
                        </InputLabel>
                        <Select
                          variant="filled"
                          autoWidth={true}
                          error={formikBag.submitCount > 0 && !!formikBag.errors.departureTicketId}
                          value={formikBag.values.departureTicketId}
                          open={this.state.isSelectRouteOpen}
                          onOpen={(e: React.ChangeEvent<{}>) => this.onSetSelectRouteOpen(true)}
                          onClose={(e: React.ChangeEvent<{}>) => this.onSetSelectRouteOpen(false)}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            formikBag.setFieldValue("departureTicketId", e.target.value);
                            this.setState({
                              isSelectRouteOpen: false,
                            });
                          }}
                          name="departureTicketId"
                        >
                          <MenuItem value="" className={[].join(" ")} disabled>
                            <div className="w-100">
                              <em className="mx-auto">Choose a route..</em>
                            </div>
                          </MenuItem>
                          {menuItems}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formikBag.values.closed}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              formikBag.setFieldValue("closed", e.target.checked);
                            }}
                            value={true}
                            color="primary"
                          />
                        }
                        label={
                          formikBag.values.closed ? (
                            <span className="text-primary">Schedule Closed for Selected Date &amp; Route</span>
                          ) : (
                            <span className="text-dark">Close Schedule</span>
                          )
                        }
                      />
                    </div>
                    {this.props.match.params.scheduleId ? (
                      <div className="col-12">
                        <ul className="list-group">
                          <li className="list-group-item">
                            Tickets Sold + Reserved Seats: &nbsp;
                            <strong>
                              {this.state.fetchedSchedule &&
                                this.state.fetchedSchedule.tickets &&
                                this.state.fetchedSchedule.tickets.items &&
                                ScheduleService.tallyTotalScheduleTravellers(
                                  this.state.fetchedSchedule.tickets.items,
                                  this.state.fetchedSchedule.reservedSeats,
                                )}
                            </strong>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  <FieldArray
                    name="reservedSeats"
                    render={(arrayHelpers: FieldArrayRenderProps) => {
                      return (
                        <div>
                          <h2 className="mb-4 pb-2 border-bottom border-secondary">
                            <small>Reserved Seats</small>
                            <Button
                              kind="button"
                              classes="float-right"
                              theme="secondary"
                              size="xs"
                              click={() => {
                                arrayHelpers.unshift({ name: "", requiresWheelchair: false, note: "" });
                                console.log("arrayHelpers:", arrayHelpers);
                              }}
                            >
                              <i className="fa fa-plus" /> {window.innerWidth >= 992 ? "Add Reserved Seat" : null}
                            </Button>
                          </h2>
                          {formikBag.values.reservedSeats.length ? (
                            formikBag.values.reservedSeats.map((reservedSeat, reservedSeatIndex: number) => {
                              const animateInClass =
                                !reservedSeat.id && reservedSeatIndex === 0 ? "animated slideInRight" : "";
                              return (
                                <Paper
                                  key={reservedSeatIndex}
                                  className={["p-4 bg-light mb-3", animateInClass].join(" ")}
                                >
                                  <div className="row">
                                    <div className="col-12 col-md-5">
                                      <div className="row">
                                        <div className="col-12">
                                          <FormControl className="w-100">
                                            <InputLabel htmlFor={`reservedSeats[${reservedSeatIndex}]-required`}>
                                              Traveller Full Name
                                            </InputLabel>
                                            <Input
                                              type="text"
                                              error={
                                                formikBag.submitCount > 0 &&
                                                !!formikBag.touched.reservedSeats &&
                                                !!formikBag.touched.reservedSeats[reservedSeatIndex] &&
                                                !!formikBag.errors.reservedSeats &&
                                                !!formikBag.errors.reservedSeats[reservedSeatIndex]
                                              }
                                              value={reservedSeat.name}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                arrayHelpers.replace(reservedSeatIndex, {
                                                  ...reservedSeat,
                                                  name: e.target.value,
                                                });
                                              }}
                                              name={`reservedSeats.${reservedSeatIndex}.name`}
                                              inputProps={{
                                                id: `reservedSeats[${reservedSeatIndex}]-required`,
                                              }}
                                            />
                                          </FormControl>
                                        </div>
                                        <div className="col-12">
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                checked={
                                                  arrayHelpers.form.values.reservedSeats[reservedSeatIndex]
                                                    .requiresWheelchair
                                                }
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  arrayHelpers.replace(reservedSeatIndex, {
                                                    ...reservedSeat,
                                                    requiresWheelchair: !arrayHelpers.form.values.reservedSeats[
                                                      reservedSeatIndex
                                                    ].requiresWheelchair,
                                                  });
                                                }}
                                                value={true}
                                                color="primary"
                                              />
                                            }
                                            label={
                                              arrayHelpers.form.values.reservedSeats[reservedSeatIndex]
                                                .requiresWheelchair ? (
                                                <span className="text-primary">Wheelchair Seat Reserved</span>
                                              ) : (
                                                <span className="text-dark">Requires Wheelchair</span>
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-8 col-md-5">
                                      <FormControl className="w-100">
                                        <InputLabel htmlFor={`reservedSeats[${reservedSeatIndex}]-required`}>
                                          Notes
                                        </InputLabel>
                                        <Input
                                          multiline={true}
                                          rows={1}
                                          rowsMax={3}
                                          type="textarea"
                                          value={reservedSeat.note ? reservedSeat.note : ""}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            arrayHelpers.replace(reservedSeatIndex, {
                                              ...reservedSeat,
                                              note: e.target.value,
                                            });
                                          }}
                                          name={`reservedSeats.${reservedSeatIndex}.note`}
                                          inputProps={{
                                            id: `reservedSeats[${reservedSeatIndex}]-required`,
                                          }}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="col-4 col-md-2">
                                      <Button
                                        classes="mt-2"
                                        kind="button"
                                        theme="danger"
                                        size="xs"
                                        click={() => {
                                          console.log("reservedSeatIndex:", reservedSeatIndex);

                                          arrayHelpers.remove(reservedSeatIndex);
                                        }}
                                      >
                                        <i className="fa fa-remove" /> {window.innerWidth >= 992 ? "Delete" : ""}
                                      </Button>
                                    </div>
                                  </div>
                                </Paper>
                              );
                            })
                          ) : (
                            <div className="alert alert-info">
                              It appears there are no reserved seats for this scheduled route.
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <div className="row mb-3">
                    <button
                      className="btn btn-link pull-left ml-2"
                      type="button"
                      onClick={() => this.props.history.goBack()}
                    >
                      <i className="fa fa-3x fa-chevron-circle-left text-secondary" />
                    </button>
                    <Button classes="mx-auto" theme="primary" btnType="submit" disabled={this.state.savingSchedule}>
                      Save Schedule {this.state.savingSchedule ? <i className="fa fa-spinner fa-spin" /> : null}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default withRouter(ScheduleSave);

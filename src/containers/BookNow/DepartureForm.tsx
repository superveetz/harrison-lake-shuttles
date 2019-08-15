import * as React from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../shared/util";
import { Formik, Form, FormikProps, FieldArray } from "formik";
import { DatePicker } from "material-ui-pickers";
import {
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  Input,
  InputLabel,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import moment from "moment";
import TextField from "@material-ui/core/TextField";

const classes: any = require("./BookNow.module.css");
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import SelectTicketCard from "../../components/UI/Cards/SelectTicketCard/SelectTicketCard";
import Steps from "./UI/Steps/Steps";
import { CachedState, BookNowSteps, PassengerTicket, BookNowMethods } from "./BookNow";
import ReturnForm from "./ReturnForm";

export interface DepartureFormValues {
  ticketId: string;
  departureDate: string;
  numberOfPassengers: number;
  passengerTickets: Array<PassengerTicket>;
  pickupLocation: string;
  dropoffLocation: string;
  requiresWheelchair: boolean;
}

interface DepartureFormProps {
  activeStep: BookNowSteps;
  cachedState: CachedState;
  ticketProducts: Array<any>;
  pickupDropoffSuggestions: Array<any>;
  updateParentState: BookNowMethods["updateParentState"];
}

interface DepartureFormState {
  isSelectDepartureTicketOpen: boolean;
}

// DepartureForm Class
class DepartureForm extends React.Component<DepartureFormProps, {}> {
  public state: DepartureFormState = {
    isSelectDepartureTicketOpen: false,
  };

  componentDidMount() {
    scrollToTop();
  }

  onSetIsSelectTicketOpen(e: React.ChangeEvent<{}>, setTicketOpen: boolean): void {
    this.setState({
      isSelectDepartureTicketOpen: setTicketOpen,
    });
  }

  // submit departure form
  onDeliveryFormSubmit(values: DepartureFormValues) {
    const cachedUpdate = {
      lastActiveStep: BookNowSteps.Return,
      departureForm: {
        ...values,
      },
      returnForm: {
        ...this.props.cachedState.returnForm,
      },
    };

    // set the selected activeStep
    this.props.updateParentState({
      activeStep: BookNowSteps.Return,
      cachedState: cachedUpdate,
    });
  }

  onChangeDepartureDate(e: React.ChangeEvent<DepartureFormValues>, formikBag: FormikProps<DepartureFormValues>) {
    formikBag.setFieldValue("departureDate", (e as any)._d.toISOString());
  }

  onKeyboardChange(
    e: React.ChangeEvent<any>,
    formikBag: FormikProps<DepartureFormValues>,
    fieldName: keyof DepartureFormValues,
  ): void {
    formikBag.setFieldValue(fieldName, (e.target as HTMLSelectElement).value);
  }

  onNumPassengersChanged(e: React.ChangeEvent<any>, formikBag: FormikProps<DepartureFormValues>): void {
    // update number of passengers
    this.onKeyboardChange(e, formikBag, "numberOfPassengers");

    // determine if we need to add or subtract passengers tickets
    const numCurrTickets = formikBag.values.passengerTickets.length;
    const numNowTickets = +(e.target as HTMLInputElement).value;
    const numDiffTickets = numNowTickets - numCurrTickets;

    // was it subtract or add
    if (numDiffTickets > 0) {
      // adding
      // determine number to add and create a new array of that many
      const newTickets = new Array(numDiffTickets).fill({ name: "", type: "" });

      // update state
      formikBag.setFieldValue("passengerTickets", formikBag.values.passengerTickets.concat(newTickets));
    } else {
      // subtract
      // determine number to subtract and create a new array holding the remaining tickets
      const unslicedTickets = formikBag.values.passengerTickets.slice(
        0,
        formikBag.values.passengerTickets.length - Math.abs(numDiffTickets),
      );

      // update state
      formikBag.setFieldValue("passengerTickets", unslicedTickets);
    }
  }

  renderSelectedTicketTypeMenuItems(formikBag: FormikProps<DepartureFormValues>): JSX.Element {
    const selectedTicket = this.props.ticketProducts.find(
      (ticketProd: any) => ticketProd.id === formikBag.values.ticketId,
    );

    if (selectedTicket) {
      return selectedTicket.ticketTypes.items
        .sort((a: any, b: any) => {
          if (a.age < b.age) {
            return -1;
          }
          if (a.age > b.age) {
            return 1;
          }
          return 0;
        })
        .map((ticketType: any, ticketTypeIndex: number) => {
          return (
            <MenuItem key={ticketTypeIndex} value={ticketType.id}>
              {ticketType.age}
            </MenuItem>
          );
        });
    }

    return <Spinner />;
  }

  renderDepartureFormDetails(formikBag: FormikProps<DepartureFormValues>): JSX.Element | null {
    // does the selected ticket have a designated arrival address?
    const selectedTicket = this.props.ticketProducts.find((ticket: any) => ticket.id === formikBag.values.ticketId);
    const hasArrivalAddress = !!(
      selectedTicket &&
      selectedTicket.arrivesLocStreet &&
      selectedTicket.arrivesLocCity &&
      selectedTicket.arrivesLocPostal
    );

    const hasDepartureAddress = !!(
      selectedTicket &&
      selectedTicket.departsLocStreet &&
      selectedTicket.departsLocCity &&
      selectedTicket.departsLocPostal
    );
    const animateOnFirstSelect: string | undefined = this.props.cachedState.departureForm.ticketId
      ? ""
      : "animated fadeIn";
    let pickupOrDropoffLocation: null | JSX.Element = null;

    // ticket has no arrival address and a ticket is currently selected
    // therefore, return display the input field
    if (!hasArrivalAddress && selectedTicket) {
      pickupOrDropoffLocation = (
        <div>
          <h2>
            <small>
              Harrison Dropoff Location:<sup>*</sup>
            </small>
          </h2>
          <div className="row mb-3">
            <div className="col-12">
              <FormControl className="w-100">
                <Select
                  value={formikBag.values.dropoffLocation}
                  onChange={(e: React.ChangeEvent<any>) => this.onKeyboardChange(e, formikBag, "dropoffLocation")}
                  name="harrison-dropoff"
                  displayEmpty
                >
                  <MenuItem value="" disabled className="bg-light">
                    <span className="text-secondary">Which resort or hotel should we drop you off at?</span>
                  </MenuItem>
                  {/* dropoff / pickup suggestions */}
                  {this.props.pickupDropoffSuggestions.map((suggestion: any, index: number) => (
                    <MenuItem key={index} value={suggestion.value}>
                      {suggestion.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Our license allows us to drop you off or pick you up at resorts or hotels in Harrison Hot Springs
                  only.
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </div>
      );
    }
    // has selected ticket and selected ticket has no departure address
    // therefore, show the pickup location input form
    else if (!hasDepartureAddress && selectedTicket) {
      pickupOrDropoffLocation = (
        <div>
          <h2>
            <small>
              Harrison Pickup Location:<sup>*</sup>
            </small>
          </h2>
          <div className="row mb-3">
            <div className="col-12">
              <FormControl className="w-100">
                <Select
                  value={formikBag.values.pickupLocation}
                  onChange={(e: React.ChangeEvent<any>) => this.onKeyboardChange(e, formikBag, "pickupLocation")}
                  name="harrison-pickup"
                  displayEmpty
                >
                  <MenuItem value="" disabled className="bg-light">
                    <span className="text-secondary">Which resort or hotel should we pick you up from?</span>
                  </MenuItem>
                  {/* dropoff / pickup suggestions */}
                  {this.props.pickupDropoffSuggestions.map((suggestion: any, index: number) => (
                    <MenuItem key={index} value={suggestion.value}>
                      {suggestion.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Our license allows us to drop you off or pick you up at resorts or hotels in Harrison Hot Springs
                  only.
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </div>
      );
    }

    // render ticket details form upon selecting a ticket
    return formikBag.values.ticketId ? (
      <div className={animateOnFirstSelect}>
        {pickupOrDropoffLocation}

        <div className="alert alert-warning" role="alert">
          <em>
            Each traveller will be required to provide one piece of government issued ID as well as your ticket
            confirmation email in order to board the bus.
          </em>
        </div>

        <h2 className="mt-3">
          <small>
            Traveller Information:<sup>*</sup>
          </small>
        </h2>

        <FieldArray
          name="passengerTickets"
          render={(arrayHelpers: any) => (
            <div>
              {formikBag.values.passengerTickets.map((passTicket: PassengerTicket, passTicketIndex: number) => {
                return (
                  <div className="row" key={passTicketIndex}>
                    <div className="col-7">
                      <FormControl className="w-100">
                        {/* className={classes.formControl} */}
                        <InputLabel htmlFor={`passengerTickets[${passTicketIndex}]-required`}>
                          Traveller Full Name
                        </InputLabel>
                        <Input
                          type="text"
                          value={passTicket.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            arrayHelpers.replace(passTicketIndex, {
                              ...passTicket,
                              name: e.target.value,
                            });
                          }}
                          name={`passengerTickets.${passTicketIndex}.name`}
                          inputProps={{
                            id: `passengerTickets[${passTicketIndex}]-required`,
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="col-5">
                      {/* Passenger Ticket Type */}
                      <FormControl className="w-100">
                        {/* className={classes.formControl} */}
                        <InputLabel htmlFor="passengers-required">Ticket Type</InputLabel>
                        <Select
                          autoWidth={true}
                          value={passTicket.type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            arrayHelpers.replace(passTicketIndex, {
                              ...passTicket,
                              type: e.target.value,
                            });
                          }}
                          name="passengers"
                          inputProps={{
                            id: "passengers-required",
                          }}
                        >
                          {/* todo: make this dynamic.. */}
                          {this.renderSelectedTicketTypeMenuItems(formikBag)}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        />
        {/* end FieldArray */}

        {/* Requires Wheelchair */}
        {/* <FormGroup row>
          <FormHelperText className="mt-4">
            We have space for exactly one wheelchair. If someone else has already reserved the wheelchair on the
            selected departure date, you will be notified before checking out.
          </FormHelperText>
          <FormControlLabel
            control={
              <Switch
                checked={formikBag.values.requiresWheelchair}
                onChange={(e: React.ChangeEvent<any>) => {
                  this.onKeyboardChange(
                    { target: { value: e.target.checked } } as any,
                    formikBag,
                    "requiresWheelchair",
                  );
                }}
                value={true}
                color="primary"
              />
            }
            label={
              formikBag.values.requiresWheelchair ? (
                <span className="text-primary">Wheelchair Seat Reserved</span>
              ) : (
                <span className="text-dark">Wheelchair Seat Required</span>
              )
            }
          />
        </FormGroup> */}

        <div className="row mt-4">
          <Button
            classes="mx-auto"
            theme="secondary"
            btnType="button"
            click={() => this.onDeliveryFormSubmit(formikBag.values)}
          >
            Select Return Ticket
          </Button>
        </div>
      </div>
    ) : null;
  }

  render() {
    // menu items or spinner
    const menuItems = this.props.ticketProducts.length ? (
      this.props.ticketProducts.map((ticketProd: any, ticketProdIndex: number) => {
        return (
          <MenuItem value={ticketProd.id} className={classes.SelectMenuItem} key={ticketProdIndex}>
            {this.state.isSelectDepartureTicketOpen ? (
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
      })
    ) : (
      <Spinner />
    );

    return (
      <React.Fragment>
        <Formik
          initialValues={{
            departureDate:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.departureDate) ||
              moment().toISOString(),
            numberOfPassengers:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.numberOfPassengers) ||
              1,
            ticketId:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.ticketId) ||
              "",
            passengerTickets: (this.props.cachedState &&
              this.props.cachedState.departureForm &&
              this.props.cachedState.departureForm.passengerTickets) || [{ name: "", type: "" }],
            pickupLocation:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.pickupLocation) ||
              "",
            dropoffLocation:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.dropoffLocation) ||
              "",
            requiresWheelchair:
              (this.props.cachedState &&
                this.props.cachedState.departureForm &&
                this.props.cachedState.departureForm.requiresWheelchair) ||
              false,
          }}
          onSubmit={(values: DepartureFormValues) => this.onDeliveryFormSubmit(values)}
          render={(formikBag: FormikProps<DepartureFormValues>) => (
            <Form className="">
              <Steps
                cachedStateKey="departureForm"
                cachedState={this.props.cachedState}
                formPayload={formikBag.values}
                activeStep={this.props.activeStep}
                clicked={this.props.updateParentState}
              />
              <h2>
                <small>
                  Departure Ticket Details:<sup>*</sup>
                </small>
              </h2>
              <div className="row mb-3">
                <div className="col-12">
                  {/* Departing Number of Passengers */}
                  <FormControl className="w-100">
                    {/* className={classes.formControl} */}
                    <InputLabel htmlFor="ticketId-required">
                      {formikBag.values.ticketId ? "Departure Ticket" : "Choose your ticket.."}
                    </InputLabel>
                    <Select
                      className={classes.Select}
                      variant="filled"
                      autoWidth={true}
                      value={formikBag.values.ticketId}
                      open={this.state.isSelectDepartureTicketOpen}
                      onOpen={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, true)}
                      onClose={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, false)}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        this.onKeyboardChange(e, formikBag, "ticketId");
                        // also reset the dropoff and pickup locations to ""
                        formikBag.setFieldValue("pickupLocation", "");
                        formikBag.setFieldValue("dropoffLocation", "");
                        formikBag.setFieldValue("numberOfPassengers", 1);
                        formikBag.setFieldValue("passengerTickets", [{ name: "", type: "" }]);

                        // clear cache for return ticket
                        this.props.updateParentState({
                          activeStep: BookNowSteps.Departure,
                          cachedState: {
                            ...this.props.cachedState,
                            returnForm: {
                              ...this.props.cachedState.returnForm,
                              ticketId: "",
                              extraTicketId: "",
                              pickupLocation: "",
                              extraPickupLocation: "",
                              dropoffLocation: "",
                              extraDropoffLocation: "",
                              numberOfPassengers: 1,
                              passengerTickets: [{ name: "", type: "" }],
                              extraNumberOfPassengers: 1,
                              extraPassengerTickets: [{ name: "", type: "" }],
                              requiresWheelchair: false,
                              extraRequiresWheelchair: false,
                              additionalReturnNeeded: false,
                            },
                          },
                        });
                      }}
                      name="ticketId"
                    >
                      <MenuItem value="" disabled>
                        <span className="text-secondary">Choose a departure ticket..</span>
                      </MenuItem>
                      {menuItems}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* -- end row -- */}

              <div className="row mb-3">
                <div className="col-7">
                  {/* Departure Date */}
                  <DatePicker
                    className="w-100"
                    autoOk={true}
                    minDate={moment()}
                    initialFocusedDate={moment()}
                    format="MMMM DD, YYYY"
                    label="Departure Date"
                    value={formikBag.values.departureDate}
                    onChange={(e: React.ChangeEvent<DepartureFormValues>) => this.onChangeDepartureDate(e, formikBag)}
                  />
                </div>
                <div className="col-4 offset-1">
                  {/* Departing Number of Passengers */}
                  <FormControl className="w-100">
                    {/* className={classes.formControl} */}
                    <InputLabel htmlFor="passengers-required">#&nbsp;Travellers</InputLabel>
                    <Select
                      required
                      autoWidth={true}
                      value={formikBag.values.numberOfPassengers}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        this.onNumPassengersChanged(e, formikBag);
                      }}
                      name="passengers"
                      inputProps={{
                        id: "passengers-required",
                      }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={11}>11</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={13}>13</MenuItem>
                      <MenuItem value={14}>14</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                      <MenuItem value={16}>16</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* -- end row -- */}

              {/* rendering the rest of the form upon selecting a ticket type */}
              {this.renderDepartureFormDetails(formikBag)}

              <div className="alert alert-info mt-5">
                We strongly recommend reading our <Link to="more-info">policies</Link> before booking.
              </div>
            </Form>
          )}
        />
      </React.Fragment>
    );
  }
}

export default DepartureForm;

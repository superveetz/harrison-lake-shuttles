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
  Tab,
  Tabs,
  AppBar,
} from "@material-ui/core";
import BusIcon from "@material-ui/icons/DirectionsBus";

import deburr from "lodash/deburr";
import Downshift from "downshift";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

const classes: any = require("./BookNow.module.css"); // reusing css
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import SelectTicketCard from "../../components/UI/Cards/SelectTicketCard/SelectTicketCard";
import Steps from "./UI/Steps/Steps";
import { CachedState, IBookNowState, BookNowSteps, PassengerTicket, BookNowMethods } from "./BookNow";
import TabContent from "reactstrap/lib/TabContent";

export interface ReturnFormValues {
  noReturnNeeded: boolean;
  additionalReturnNeeded: boolean;
  ticketId: string;
  departureDate: string;
  numberOfPassengers: number;
  passengerTickets: Array<PassengerTicket>;
  pickupLocation: string;
  dropoffLocation: string;
  requiresWheelchair: boolean;

  extraTicketId: string;
  extraDepartureDate: string;
  extraNumberOfPassengers: number;
  extraPassengerTickets: Array<PassengerTicket>;
  extraPickupLocation: string;
  extraDropoffLocation: string;
  extraRequiresWheelchair: boolean;
}

interface ReturnFormProps {
  activeStep: BookNowSteps;
  cachedState: CachedState;
  ticketProducts: Array<any>;
  pickupDropoffSuggestions: Array<any>;
  updateParentState: BookNowMethods["updateParentState"];
}

interface ReturnFormState {
  isSelectReturnTicketOpen: boolean;
  activeTicketTab: number;
}

// dropoff suggestions
const dropoffSuggestions = [
  { label: "Harrison Hot Springs Resort & Spa" },
  { label: "Harrison Beach Hotel (Rear parking lot)" },
  { label: "Hot Spring Villa Hotel" },
].map((suggestion) => ({
  value: suggestion.label,
  label: suggestion.label,
}));

// autocomplete functions
function renderInput(inputProps: any) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }: any) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(value: any) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : dropoffSuggestions.filter((suggestion: any) => {
        const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

// ReturnForm Class
class ReturnForm extends React.Component<ReturnFormProps, {}> {
  public state: ReturnFormState = {
    isSelectReturnTicketOpen: false,
    activeTicketTab: 0,
  };

  private returnTicketTabsRef: React.Ref<HTMLDivElement>;

  constructor(props: ReturnFormProps) {
    super(props);

    // bind funcs
    this.onBack = this.onBack.bind(this);

    // ref for the tabs on return page
    this.returnTicketTabsRef = React.createRef();
  }

  componentDidMount() {
    scrollToTop();
  }

  onSetIsSelectTicketOpen(e: React.ChangeEvent<{}>, setTicketOpen: boolean): void {
    this.setState({
      isSelectReturnTicketOpen: setTicketOpen,
    });
  }

  // submit departure form
  onReturnFormSubmit(values: ReturnFormValues) {
    const cachedUpdate = {
      lastActiveStep: BookNowSteps.Checkout,
      returnForm: {
        ...values,
      },
      departureForm: {
        ...this.props.cachedState.departureForm,
      },
    };

    // set the selected activeStep
    this.props.updateParentState({
      activeStep: BookNowSteps.Checkout,
      cachedState: cachedUpdate,
    });
  }

  onBack(values: ReturnFormValues) {
    const cachedUpdate = {
      lastActiveStep: BookNowSteps.Checkout,
      returnForm: {
        ...values,
      },
      departureForm: {
        ...this.props.cachedState.departureForm,
      },
    };

    // set the selected activeStep
    this.props.updateParentState({
      activeStep: BookNowSteps.Departure,
      cachedState: cachedUpdate,
    });
  }

  onChangeReturnDate(
    e: React.ChangeEvent<ReturnFormValues>,
    formikBag: FormikProps<ReturnFormValues>,
    keyName: string,
  ) {
    formikBag.setFieldValue(keyName, (e as any)._d.toISOString());
  }

  onKeyboardChange(
    e: React.ChangeEvent<any>,
    formikBag: FormikProps<ReturnFormValues>,
    fieldName: keyof ReturnFormValues,
  ): void {
    formikBag.setFieldValue(fieldName, (e.target as HTMLSelectElement).value);
  }

  onNumPassengersChanged(e: React.ChangeEvent<any>, formikBag: FormikProps<ReturnFormValues>): void {
    // reusing this function for both return tickets as well as the departure ticket
    // determine all formik refs here
    let formikNumPasssengers: keyof ReturnFormValues = "numberOfPassengers";
    if (this.state.activeTicketTab === 1) {
      formikNumPasssengers = "extraNumberOfPassengers";
    }
    let formikPassengerArrayName: keyof ReturnFormValues = "passengerTickets";
    if (this.state.activeTicketTab === 1) {
      formikPassengerArrayName = "extraPassengerTickets";
    }

    // update number of passengers
    this.onKeyboardChange(e, formikBag, formikNumPasssengers);

    // determine if we need to add or subtract passengers tickets
    const numCurrTickets = formikBag.values[formikPassengerArrayName].length;
    const numNowTickets = +(e.target as HTMLInputElement).value;
    const numDiffTickets = numNowTickets - numCurrTickets;

    // was it subtract or add
    if (numDiffTickets > 0) {
      // adding
      // determine number to add and create a new array of that many
      const newTickets = new Array(numDiffTickets).fill({ name: "", type: "" });

      // update state
      formikBag.setFieldValue(formikPassengerArrayName, formikBag.values[formikPassengerArrayName].concat(newTickets));
    } else {
      // subtract
      // determine number to subtract and create a new array holding the remaining tickets
      const unslicedTickets = formikBag.values[formikPassengerArrayName].slice(
        0,
        formikBag.values[formikPassengerArrayName].length - Math.abs(numDiffTickets),
      );

      // update state
      formikBag.setFieldValue(formikPassengerArrayName, unslicedTickets);
    }
  }

  renderSelectedTicketTypeMenuItems(formikBag: FormikProps<ReturnFormValues>): JSX.Element {
    const formikTicketId: keyof ReturnFormValues = this.state.activeTicketTab === 0 ? "ticketId" : "extraTicketId";
    const selectedTicket = this.props.ticketProducts.find(
      (ticketProd: any) => ticketProd.id === formikBag.values[formikTicketId],
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

  handleTicketTabChange = (event: any, value: any) => {
    this.setState({
      activeTicketTab: value,
    });
  };

  renderDropoffOrPickupLocationInput(formikBag: FormikProps<ReturnFormValues>): JSX.Element | null {
    // reusing for both tickets
    // determine formik refs here
    const formikTicketId: keyof ReturnFormValues = this.state.activeTicketTab === 0 ? "ticketId" : "extraTicketId";
    const formikDropoffLocation: keyof ReturnFormValues =
      this.state.activeTicketTab === 0 ? "dropoffLocation" : "extraDropoffLocation";
    const formikPickupLocation: keyof ReturnFormValues =
      this.state.activeTicketTab === 0 ? "pickupLocation" : "extraPickupLocation";
    // does the selected ticket have a designated arrival address?
    const selectedTicket = this.props.ticketProducts.find(
      (ticket: any) => ticket.id === formikBag.values[formikTicketId],
    );

    const hasArrivalAddress =
      selectedTicket &&
      selectedTicket.arrivesLocStreet &&
      selectedTicket.arrivesLocCity &&
      selectedTicket.arrivesLocPostal;

    const hasReturnAddress =
      selectedTicket &&
      selectedTicket.departsLocStreet &&
      selectedTicket.departsLocCity &&
      selectedTicket.departsLocPostal;

    // ticket has no arrival address and a ticket is currently selected
    // therefore, return display the input field
    if (!hasArrivalAddress && selectedTicket) {
      const animateOnFirstSelect: string | undefined = formikBag.values[formikDropoffLocation]
        ? undefined
        : "animated fadeIn";
      return (
        <div className={animateOnFirstSelect}>
          <h2>
            <small>
              Harrison Dropoff Location:<sup>*</sup>
            </small>
          </h2>
          <div className="row mb-3">
            <div className="col-12">
              {/* Harrison Dropoff */}
              <FormControl className="w-100">
                <Select
                  value={formikBag.values[formikDropoffLocation]}
                  onChange={(e: React.ChangeEvent<any>) => this.onKeyboardChange(e, formikBag, formikDropoffLocation)}
                  name={`harrison-${formikDropoffLocation}`}
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
    else if (!hasReturnAddress && selectedTicket) {
      return (
        <div>
          <h2>
            <small>
              Harrison Pickup Location:<sup>*</sup>
            </small>
          </h2>
          <div className="row mb-3">
            <div className="col-12">
              {/* Harrison Pickup */}
              <FormControl className="w-100">
                <Select
                  value={formikBag.values[formikPickupLocation]}
                  onChange={(e: React.ChangeEvent<any>) => this.onKeyboardChange(e, formikBag, formikPickupLocation)}
                  name={`harrison-${formikPickupLocation}`}
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
    } else {
      return null;
    }
  }

  renderSecondTicketFields(formikBag: FormikProps<ReturnFormValues>) {
    let ticketNum = null;
    if (formikBag.values.additionalReturnNeeded) {
      ticketNum = "#" + (this.state.activeTicketTab + 1);
    }

    return (
      <React.Fragment>
        <h2>
          <small>
            Return Ticket {ticketNum} Details:<sup>*</sup>
          </small>
        </h2>
        <div className="row mb-3">
          <div className="col-12">
            {/* Departing Number of Passengers */}
            <FormControl className="w-100">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor="extraTicketId-required">
                {formikBag.values.extraTicketId ? "Return Ticket" : "Choose your ticket.."}
              </InputLabel>
              <Select
                className={classes.Select}
                variant="filled"
                autoWidth={true}
                value={formikBag.values.extraTicketId}
                open={this.state.isSelectReturnTicketOpen}
                onOpen={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, true)}
                onClose={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, false)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  this.onKeyboardChange(e, formikBag, "extraTicketId");
                }}
                name="extraTicketId"
              >
                <MenuItem value="" className={[].join(" ")} disabled>
                  <div className="w-100">
                    <em className="mx-auto">Choose a return ticket..</em>
                  </div>
                </MenuItem>
                {this.renderTicketMenuOptions(formikBag)}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* -- end row -- */}

        <div className="row mb-3">
          <div className="col-7">
            {/* Return Date */}
            <DatePicker
              className="w-100"
              autoOk={true}
              initialFocusedDate={new Date()}
              minDate={new Date()}
              format="MMMM DD, YYYY"
              label="Return Date"
              placeholder="Test"
              value={formikBag.values.extraDepartureDate}
              onChange={(e: React.ChangeEvent<ReturnFormValues>) =>
                this.onChangeReturnDate(e, formikBag, "extraDepartureDate")
              }
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
                value={formikBag.values.extraNumberOfPassengers}
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

        {formikBag.values.extraTicketId ? (
          <div>
            {this.renderDropoffOrPickupLocationInput(formikBag)}

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
              name="extraPassengerTickets"
              render={(arrayHelpers: any) => (
                <div>
                  {formikBag.values.extraPassengerTickets.map(
                    (passTicket: PassengerTicket, passTicketIndex: number) => {
                      return (
                        <div className="row" key={passTicketIndex}>
                          <div className="col-7">
                            <FormControl className="w-100">
                              {/* className={classes.formControl} */}
                              <InputLabel htmlFor={`extraPassengerTickets[${passTicketIndex}]-required`}>
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
                                name={`extraPassengerTickets.${passTicketIndex}.name`}
                                inputProps={{
                                  id: `extraPassengerTickets[${passTicketIndex}]-required`,
                                }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-5">
                            {/* Passenger Ticket Type */}
                            <FormControl className="w-100">
                              {/* className={classes.formControl} */}
                              <InputLabel htmlFor="extraPassengerTickets-required">Ticket Type</InputLabel>
                              <Select
                                autoWidth={true}
                                value={passTicket.type}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                  arrayHelpers.replace(passTicketIndex, {
                                    ...passTicket,
                                    type: e.target.value,
                                  });
                                }}
                                name="extraPassengerTickets"
                                inputProps={{
                                  id: "extraPassengerTickets-required",
                                }}
                              >
                                {this.renderSelectedTicketTypeMenuItems(formikBag)}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            />
            {/* end FieldArray */}

            {/* Requires Wheelchair */}
            {/* <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    className="mb-0 pb-0"
                    checked={formikBag.values.extraRequiresWheelchair}
                    onChange={(e: React.ChangeEvent<any>) => {
                      this.onKeyboardChange(
                        { target: { value: e.target.checked } } as any,
                        formikBag,
                        "extraRequiresWheelchair",
                      );
                    }}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  formikBag.values.extraRequiresWheelchair ? (
                    <span className="text-primary">Wheelchair Seat Reserved</span>
                  ) : (
                    <span className="text-dark">Wheelchair Seat Required</span>
                  )
                }
              />
            </FormGroup>
            <FormHelperText className="mt-0">
              We have space for exactly one wheelchair. If someone else has already reserved the wheelchair on the
              selected departure date, you will be notified before checking out.
            </FormHelperText> */}

            {/* <hr className="w-75 mx-auto border-secondary" /> */}
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  renderFirstTicketFields(formikBag: FormikProps<ReturnFormValues>) {
    let ticketNum = null;
    if (formikBag.values.additionalReturnNeeded) {
      ticketNum = "#" + (this.state.activeTicketTab + 1);
    }

    return (
      <React.Fragment>
        <h2>
          <small>
            Return Ticket {ticketNum} Details:<sup>*</sup>
          </small>
        </h2>
        <div className="row mb-3">
          <div className="col-12">
            {/* Departing Number of Passengers */}
            <FormControl className="w-100">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor="ticketId-required">
                {formikBag.values.ticketId ? "Return Ticket" : "Choose your ticket.."}
              </InputLabel>
              <Select
                className={classes.Select}
                variant="filled"
                autoWidth={true}
                value={formikBag.values.ticketId}
                open={this.state.isSelectReturnTicketOpen}
                onOpen={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, true)}
                onClose={(e: React.ChangeEvent<{}>) => this.onSetIsSelectTicketOpen(e, false)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  this.onKeyboardChange(e, formikBag, "ticketId");
                }}
                name="ticketId"
              >
                <MenuItem value="" className={[].join(" ")} disabled>
                  <div className="w-100">
                    <em className="mx-auto">Choose a return ticket..</em>
                  </div>
                </MenuItem>
                {this.renderTicketMenuOptions(formikBag)}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* -- end row -- */}

        <div className="row mb-3">
          <div className="col-7">
            {/* Return Date */}
            <DatePicker
              className="w-100"
              autoOk={true}
              minDate={new Date()}
              initialFocusedDate={new Date()}
              format="MMMM DD, YYYY"
              label="Return Date"
              placeholder="Test"
              value={formikBag.values.departureDate}
              onChange={(e: React.ChangeEvent<ReturnFormValues>) =>
                this.onChangeReturnDate(e, formikBag, "departureDate")
              }
            />
          </div>
          <div className="col-4 offset-1">
            {/* Departing Number of Passengers */}
            <FormControl className="w-100">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor="extraPassengers-required">#&nbsp;Travellers</InputLabel>
              <Select
                required
                autoWidth={true}
                value={formikBag.values.numberOfPassengers}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  this.onNumPassengersChanged(e, formikBag);
                }}
                name="extraPassengers"
                inputProps={{
                  id: "extraPassengers-required",
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

        {formikBag.values.ticketId ? (
          <div>
            {this.renderDropoffOrPickupLocationInput(formikBag)}

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
              <FormControlLabel
                control={
                  <Switch
                    className="mb-0 pb-0"
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
            </FormGroup>

            <FormHelperText className="mt-0">
              We have space for exactly one wheelchair. If someone else has already reserved the wheelchair on the
              selected departure date, you will be notified before checking out.
            </FormHelperText> */}

            {/* <hr className="w-75 mx-auto border-secondary" /> */}
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  renderTicketMenuOptions(formikBag: FormikProps<ReturnFormValues>) {
    return this.props.ticketProducts.length ? (
      this.props.ticketProducts
        .filter((ticketProd: any) => ticketProd.id !== this.props.cachedState.departureForm.ticketId)
        .map((ticketProd: any, ticketProdIndex: number) => {
          return (
            <MenuItem value={ticketProd.id} className={classes.SelectMenuItem} key={ticketProdIndex}>
              {this.state.isSelectReturnTicketOpen ? (
                <SelectTicketCard
                  header="One Way Bus Ticket"
                  title={ticketProd.departsLong}
                  subTitle={ticketProd.arrivesLong}
                  depAddrTitle="Return Information:"
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
  }

  render() {
    // determine if there is a selected departure ticket or not
    // and display the opposite return ticket
    // or spinner
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            noReturnNeeded:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.noReturnNeeded) ||
              false,
            additionalReturnNeeded:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.additionalReturnNeeded) ||
              false,
            departureDate:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.departureDate) ||
              new Date().toISOString(),
            numberOfPassengers:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.numberOfPassengers) ||
              1,
            ticketId:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.ticketId) ||
              "",
            passengerTickets: (this.props.cachedState &&
              this.props.cachedState.returnForm &&
              this.props.cachedState.returnForm.passengerTickets) || [{ name: "", type: "" }],
            pickupLocation:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.pickupLocation) ||
              "",
            dropoffLocation:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.dropoffLocation) ||
              "",
            requiresWheelchair:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.requiresWheelchair) ||
              false,
            extraDepartureDate:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraDepartureDate) ||
              new Date().toISOString(),
            extraNumberOfPassengers:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraNumberOfPassengers) ||
              1,
            extraTicketId:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraTicketId) ||
              "",
            extraPassengerTickets: (this.props.cachedState &&
              this.props.cachedState.returnForm &&
              this.props.cachedState.returnForm.extraPassengerTickets) || [{ name: "", type: "" }],
            extraPickupLocation:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraPickupLocation) ||
              "",
            extraDropoffLocation:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraDropoffLocation) ||
              "",
            extraRequiresWheelchair:
              (this.props.cachedState &&
                this.props.cachedState.returnForm &&
                this.props.cachedState.returnForm.extraRequiresWheelchair) ||
              false,
          }}
          onSubmit={(values: ReturnFormValues) => this.onReturnFormSubmit(values)}
          render={(formikBag: FormikProps<ReturnFormValues>) => {
            return (
              <React.Fragment>
                <div ref={this.returnTicketTabsRef}>
                  <Steps
                    cachedStateKey="returnForm"
                    cachedState={this.props.cachedState}
                    formPayload={formikBag.values}
                    activeStep={this.props.activeStep}
                    clicked={this.props.updateParentState}
                  />
                </div>

                <Form className="">
                  {formikBag.values.noReturnNeeded ? null : (
                    <React.Fragment>
                      {formikBag.values.additionalReturnNeeded ? (
                        <div className="">
                          <AppBar className="mb-2" position="static" color="default">
                            <Tabs
                              value={this.state.activeTicketTab}
                              onChange={this.handleTicketTabChange}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth"
                            >
                              <Tab label="Ticket One" icon={<BusIcon />} />
                              <Tab label="Ticket Two" icon={<BusIcon />} />
                            </Tabs>
                          </AppBar>
                          {this.state.activeTicketTab === 0 && (
                            <TabContent className="w-100 animated fadeIn" style={{ animationDuration: "450ms" }}>
                              {this.renderFirstTicketFields(formikBag)}
                            </TabContent>
                          )}

                          {this.state.activeTicketTab === 1 && (
                            <TabContent className="w-100 animated fadeIn" style={{ animationDuration: "450ms" }}>
                              {/* {this.renderSecondTicketFields(formikBag)} */}
                              {this.renderSecondTicketFields(formikBag)}
                            </TabContent>
                          )}
                        </div>
                      ) : (
                        this.renderFirstTicketFields(formikBag)
                      )}

                      {/* Additional Return Ticket Needed */}
                      {formikBag.values.ticketId ? (
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formikBag.values.additionalReturnNeeded}
                                onChange={(e: React.ChangeEvent<any>) => {
                                  // update noReturnNeeded
                                  this.onKeyboardChange(
                                    { target: { value: e.target.checked } } as any,
                                    formikBag,
                                    "additionalReturnNeeded",
                                  );

                                  // scroll to top of tabs
                                  (this.returnTicketTabsRef as any).current.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });

                                  // reset the return two ticket fields
                                  formikBag.setFieldValue("extraTicketId", "");
                                  formikBag.setFieldValue("extraDropoffLocation", "");
                                  formikBag.setFieldValue("extraPickupLocation", "");
                                  formikBag.setFieldValue("extraNumberOfPassengers", 1);
                                  formikBag.setFieldValue("extraPassengerTickets", [{ name: "", type: "" }]);

                                  // set the 1st or 2nd ticket as the active ticket
                                  if (e.target.checked) {
                                    this.setState({
                                      activeTicketTab: 1,
                                    });
                                  } else {
                                    this.setState({
                                      activeTicketTab: 0,
                                    });
                                  }
                                }}
                                value={true}
                                color="secondary"
                              />
                            }
                            label={
                              formikBag.values.noReturnNeeded ? (
                                <span className="text-primary">Additional Return Ticket Needed</span>
                              ) : (
                                <span className="text-dark">Additional Return Ticket Needed</span>
                              )
                            }
                          />
                        </FormGroup>
                      ) : null}
                    </React.Fragment>
                  )}

                  {/* No Return Needed */}
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formikBag.values.noReturnNeeded}
                          onChange={(e: React.ChangeEvent<any>) => {
                            // reset the form
                            formikBag.resetForm({
                              noReturnNeeded: formikBag.values.noReturnNeeded,
                              additionalReturnNeeded: false,
                              departureDate: new Date().toString(),
                              numberOfPassengers: 1,
                              pickupLocation: "",
                              dropoffLocation: "",
                              requiresWheelchair: false,
                              ticketId: "",
                              passengerTickets: [{ name: "", type: "" }],

                              extraTicketId: "",
                              extraDepartureDate: new Date().toString(),
                              extraNumberOfPassengers: 1,
                              extraPickupLocation: "",
                              extraDropoffLocation: "",
                              extraRequiresWheelchair: false,
                              extraPassengerTickets: [{ name: "", type: "" }],
                            });

                            // update noReturnNeeded
                            this.onKeyboardChange(
                              { target: { value: e.target.checked } } as any,
                              formikBag,
                              "noReturnNeeded",
                            );

                            // set the 1st state as the active tab
                            this.setState({
                              activeTicketTab: 0,
                            });
                          }}
                          value={true}
                          color="primary"
                        />
                      }
                      label={
                        formikBag.values.noReturnNeeded ? (
                          <span className="text-primary">No Return Ticket Needed</span>
                        ) : (
                          <span className="text-dark">No Return Ticket Needed</span>
                        )
                      }
                    />
                  </FormGroup>

                  <div className="row mt-4">
                    <button className="btn btn-link pull-left ml-2" onClick={() => this.onBack(formikBag.values)}>
                      <i className="fa fa-3x fa-chevron-circle-left text-secondary" />
                    </button>
                    <Button
                      classes="mx-auto"
                      theme="secondary"
                      btnType="button"
                      click={() => this.onReturnFormSubmit(formikBag.values)}
                    >
                      Review Order &amp; Checkout
                    </Button>
                  </div>

                  <div className="alert alert-info mt-5">
                    We strongly recommend reading our <Link to="more-info">policies</Link> before booking.
                  </div>
                </Form>
              </React.Fragment>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default ReturnForm;

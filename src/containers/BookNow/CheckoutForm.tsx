import * as React from "react";
import * as Yup from "yup";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import { scrollToTop } from "../../shared/util";
import { Formik, Form, FormikProps, FieldArray } from "formik";
import { connect } from "react-redux";
import {
  AppBar,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Tabs,
  Tab,
  Typography,
  Icon,
  FormHelperText,
} from "@material-ui/core";
import { API, Auth, graphqlOperation } from "aws-amplify";
import credentials from "../../credentials";
import StripeCheckout from "react-stripe-checkout";
import ReceiptIcon from "@material-ui/icons/Receipt";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import classNames from "classnames";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TabContent from "reactstrap/lib/TabContent";

const classes: any = require("./BookNow.module.css"); // reusing css
import logoThumb from "../../assets/img/logo-thumb.png";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import Steps from "./UI/Steps/Steps";
import { CachedState, BookNowSteps, PassengerTicket, BookNowMethods } from "./BookNow";
// import TabContent from "reactstrap/lib/TabContent";
import moment from "moment";
import { AppDataStore } from "../../store/reducers/app-data";
import ScheduleService from "../../dac/ScheduleService";

export interface CheckoutFormValues {
  payeeName: string;
  payeeEmail: string;
  payeePhone: string;
}

interface CheckoutFormProps {
  activeStep: BookNowSteps;
  cachedState: CachedState;
  ticketProducts: Array<{ [keyName: string]: any }>;
  updateParentState: BookNowMethods["updateParentState"];
}

interface CheckoutFormState {
  activeTab: CheckoutFormTabs;
  checkingOut: boolean;
  checkoutSuccess: boolean;
  validatingOrder: boolean;
  validateOrderSuccess: boolean;
  validateOrderErrors: null | OrderErrors;
  checkoutSuccessOrder: any;
  resendingConfirmationEmail: boolean;
  resendConfirmationSuccess: boolean;
}

interface CheckoutFormReduxProps {
  appData: AppDataStore;
}

enum CheckoutFormTabs {
  ReviewOrder = 0,
  Checkout = 1,
}

interface OrderErrors {
  departureForm: string[];
  returnForm: string[];
  returnExtraForm: string[];
}

// CheckoutForm Class
class CheckoutForm extends React.Component<CheckoutFormProps & CheckoutFormReduxProps, {}> {
  public state: CheckoutFormState = {
    activeTab: 0,
    checkingOut: false,
    checkoutSuccess: false,
    validatingOrder: true,
    validateOrderSuccess: false,
    validateOrderErrors: null,
    checkoutSuccessOrder: null,
    resendingConfirmationEmail: false,
    resendConfirmationSuccess: false,
  };

  private checkoutTabsRef: React.Ref<HTMLDivElement>;

  private departTicket: any;
  private adultTicketType: any;
  private departingAdultTickets: PassengerTicket[] = [];
  private childTicketType: any;
  private departingChildTickets: PassengerTicket[] = [];
  private infantTicketType: any;
  private departingInfantTickets: PassengerTicket[] = [];
  private subTotal: number = 0;

  private returnTicket1: any;
  private return1AdultTicketType: any;
  private returning1AdultTickets: PassengerTicket[] = [];
  private return1ChildTicketType: any;
  private returning1ChildTickets: PassengerTicket[] = [];
  private return1InfantTicketType: any;
  private returning1InfantTickets: PassengerTicket[] = [];
  private return1SubTotal: number = 0;

  private returnTicket2: any;
  private return2AdultTicketType: any;
  private returning2AdultTickets: PassengerTicket[] = [];
  private return2ChildTicketType: any;
  private returning2ChildTickets: PassengerTicket[] = [];
  private return2InfantTicketType: any;
  private returning2InfantTickets: PassengerTicket[] = [];
  private return2SubTotal: number = 0;

  constructor(props: CheckoutFormProps & CheckoutFormReduxProps) {
    super(props);

    // bind funcs
    this.initReviewOrderData = this.initReviewOrderData.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.onContinueToCheckout = this.onContinueToCheckout.bind(this);
    this.onStripeCheckout = this.onStripeCheckout.bind(this);
    this.createTransactionAndTicketSales = this.createTransactionAndTicketSales.bind(this);
    this.createTicketSaleAndTicketTypes = this.createTicketSaleAndTicketTypes.bind(this);
    this.validateOrder = this.validateOrder.bind(this);
    this.validateFrontEndErrors = this.validateFrontEndErrors.bind(this);
    this.resendOrderConfirmationEmail = this.resendOrderConfirmationEmail.bind(this);
    this.onBack = this.onBack.bind(this);

    // ref for the tabs on return page
    this.checkoutTabsRef = React.createRef();
  }

  componentDidMount() {
    scrollToTop();

    if (this.props.ticketProducts.length) {
      // get data ready for rendering
      this.initReviewOrderData();
      // validate selected order
      this.validateOrder();
    }
  }

  componentDidUpdate(prevProps: CheckoutFormProps) {
    // tickets loaded
    if (prevProps.ticketProducts.length !== this.props.ticketProducts.length) {
      // get data ready for rendering
      this.initReviewOrderData();
      // validate selected order
      this.validateOrder();
    }
  }

  private validateOrder(): void {
    // validate selected order
    const orderErrors: OrderErrors = this.validateFrontEndErrors();
    // update state
    const hasFrontEndErrors =
      orderErrors.departureForm.length || orderErrors.returnForm.length || orderErrors.returnExtraForm.length;

    if (hasFrontEndErrors) {
      // has front end errors
      return this.setState({
        validatingOrder: false,
        validateOrderErrors: orderErrors,
      });
    }

    // validate order against schedule
    Promise.all([
      // validate departure ticket order
      this.validateTicket(
        this.props.cachedState.departureForm.departureDate,
        this.props.cachedState.departureForm.ticketId,
        this.props.cachedState.departureForm.passengerTickets.length,
        this.props.cachedState.departureForm.requiresWheelchair
      ),
      this.validateTicket(
        this.props.cachedState.returnForm.departureDate,
        this.props.cachedState.returnForm.ticketId,
        this.props.cachedState.returnForm.passengerTickets.length,
        this.props.cachedState.returnForm.requiresWheelchair
      ),
      this.validateTicket(
        this.props.cachedState.returnForm.extraDepartureDate,
        this.props.cachedState.returnForm.extraTicketId,
        this.props.cachedState.returnForm.extraPassengerTickets.length,
        this.props.cachedState.returnForm.extraRequiresWheelchair
      )
    ])
    .then(([depErrs, returnErrs, returnExtraErrs]) => {
      // any errs
      if (depErrs.length || returnErrs.length || returnExtraErrs.length) {
        const orderErrs: OrderErrors = {
          departureForm: depErrs,
          returnForm: returnErrs,
          returnExtraForm: returnExtraErrs
        };

        this.setState({
          validatingOrder: false,
          validateOrderErrors: orderErrs
        });
      } else {
        // all ok
        this.setState({
          validatingOrder: false,
          validateOrderSuccess: true
        });
      }
    })
  }

  async validateTicket(departureDate: string, ticketId: string, seatsRequested: number = 0, requiresWheelchair: boolean): Promise<string[]> {
    const errors: string[] = [];

    if (!ticketId || !departureDate || !seatsRequested) return errors;
    console.log("ticketId:", ticketId);
    console.log("this.props.cachedState.departureForm.ticketId:", this.props.cachedState.departureForm.ticketId);
    console.log("this.props.cachedState.returnForm.ticketId:", this.props.cachedState.returnForm.ticketId);
    
    // validate against schedule
    return await ScheduleService.findScheduleForRoute(departureDate, ticketId)
      .then((scheduleForRoute: any) => {
        console.log("scheduleForRoute:", scheduleForRoute);
        const scheduleForRouteDateFormatted = moment(departureDate).format("MMM DD, YYYY");
        if (!scheduleForRoute) {
          // no route exists yet
          return errors;
        }

        if (scheduleForRoute.closed) {
          // schedule is closed for the day
          errors.push(
            `Unfortunately the bus is receiving maintenance on ${scheduleForRouteDateFormatted}. Please try a different departure date.`,
          );
        }

        // create some useful variables that we will need to finish our validation
        const totalTicketTally: number = ScheduleService.tallyTotalScheduleTravellers(
          scheduleForRoute.tickets.items,
          scheduleForRoute.reservedSeats.items,
        );
        const doesScheduleReqWheelchair: boolean = ScheduleService.doesScheduleReqWheelchair(scheduleForRoute);

        // does this order ask for a wheelchair and does this schedule already req wheelchair?
        if (requiresWheelchair && doesScheduleReqWheelchair) {
          errors.push(
            `Unfortunately the wheelchair seat has already been reserved on ${scheduleForRouteDateFormatted}. Please try a different departure date.`,
          );
        }

        // does the number of current tally tickets plus
        // the number of tickets that we are aboutt to add greater than the number of seats on the bus?
        const seatsOnBus = 16;
        if (totalTicketTally + seatsRequested > seatsOnBus) {
          errors.push(
            `Unfortunately on ${scheduleForRouteDateFormatted}, there are ${seatsOnBus -
              totalTicketTally} seats left on the bus and you requested ${seatsRequested}. Please try a diffferent departure date.`,
          );
        }

        return errors;
      });
  }

  private validateFrontEndErrors(): OrderErrors {
    const errors: OrderErrors = {
      departureForm: [],
      returnForm: [],
      returnExtraForm: [],
    };

    // ensure amount is for more than $0
    const totalAmount = this.getTotalAmountDue();
    if (totalAmount === 0) {
      errors.departureForm.push(
        "We require a selection of at least 1 ticket that is either an 'Adult' or 'Child' type.",
      );
    }

    // validate departure details
    // ensure departure ticket was selected
    if (!this.props.cachedState.departureForm.ticketId) {
      errors.departureForm.push("No departure ticket was selected.");
    }

    // ensure departure ticket dropoff or pickup location was provided
    if (!this.props.cachedState.departureForm.pickupLocation && !this.props.cachedState.departureForm.dropoffLocation) {
      errors.departureForm.push("No dropoff or pickup location was provided.");
    }

    // ensure for each passenger ticket, a name and a ticket type was selected
    this.props.cachedState.departureForm.passengerTickets.forEach((passTicket: PassengerTicket, index: number) => {
      let errMsg = "";

      if (!passTicket.name) {
        errMsg += "Missing name";
      }

      if (!passTicket.type) {
        // was err msg updated yet?
        if (errMsg.length) {
          errMsg += " and ticket type";
        } else {
          errMsg += "Missing ticket type";
        }
      }

      if (errMsg.length) {
        errMsg += " from Traveller #" + (index + 1);
        errors.departureForm.push(errMsg);
      }
    });

    // validate return ticket one
    // ensure return ticket was selected
    if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.ticketId) {
      // ensure return ticket dropoff or pickup location was provided
      if (!this.props.cachedState.returnForm.pickupLocation && !this.props.cachedState.returnForm.dropoffLocation) {
        errors.returnForm.push("No dropoff or pickup location was provided.");
      }

      // ensure for each passenger ticket, a name and a ticket type was selected
      this.props.cachedState.returnForm.passengerTickets.forEach((passTicket: PassengerTicket, index: number) => {
        let errMsg = "";

        if (!passTicket.name) {
          errMsg += "Missing name";
        }

        if (!passTicket.type) {
          // was err msg updated yet?
          if (errMsg.length) {
            errMsg += " and ticket type";
          } else {
            errMsg += "Missing ticket type";
          }
        }

        if (errMsg.length) {
          errMsg += " from Traveller #" + (index + 1);
          errors.returnForm.push(errMsg);
        }
      });
    }

    // validate return ticket two
    // ensure return ticket was selected
    if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.extraTicketId) {
      // ensure return ticket dropoff or pickup location was provided
      if (
        !this.props.cachedState.returnForm.extraPickupLocation &&
        !this.props.cachedState.returnForm.extraDropoffLocation
      ) {
        errors.returnExtraForm.push("No dropoff or pickup location was provided.");
      }

      // ensure for each passenger ticket, a name and a ticket type was selected
      this.props.cachedState.returnForm.extraPassengerTickets.forEach((passTicket: PassengerTicket, index: number) => {
        let errMsg = "";

        if (!passTicket.name) {
          errMsg += "Missing name";
        }

        if (!passTicket.type) {
          // was err msg updated yet?
          if (errMsg.length) {
            errMsg += " and ticket type";
          } else {
            errMsg += "Missing ticket type";
          }
        }

        if (errMsg.length) {
          errMsg += " from Traveller #" + (index + 1);
          errors.returnExtraForm.push(errMsg);
        }
      });
    }

    // ensure you can not select both return and extraReturn and select wheel chair required for the same date
    if (
      this.props.cachedState.returnForm && 
      this.props.cachedState.returnForm.ticketId && 
      this.props.cachedState.returnForm.extraTicketId && 
      this.props.cachedState.returnForm.requiresWheelchair && 
      this.props.cachedState.returnForm.extraRequiresWheelchair && 
      this.props.cachedState.returnForm.departureDate &&
      this.props.cachedState.returnForm.extraDepartureDate &&
      moment(this.props.cachedState.returnForm.departureDate).format('YYYY-MM-DD') === moment(this.props.cachedState.returnForm.extraDepartureDate).format('YYYY-MM-DD')
    ) {
      errors.returnExtraForm.push("Whoops, it appears you've tried to reserve a wheelchair more than once for the same date and route. We only have one wheelchair seat on the bus.")
    }

    return errors;
  }

  private processStripeCharge(token: any, formikBag: FormikProps<CheckoutFormValues>): Promise<any> {
    return API.post("stripe", "/process-transaction", {
      body: {
        stripeToken: token,
        charge: {
          currency: "CAD",
          amount: this.getTotalAmountDue() * 100,
          description: "Bus Ticket Booking",
          payeeName: formikBag.values.payeeName,
          payeePhone: formikBag.values.payeePhone,
          payeeEmail: formikBag.values.payeeEmail,
          departure: {
            ...this.props.cachedState.departureForm,
          },
          return: {
            ...this.props.cachedState.returnForm,
          },
          ticketProds: this.props.ticketProducts,
        },
      },
    });

    // return fetch("http://localhost:3001/process-transaction", {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     stripeToken: token,
    //     charge: {
    //       currency: "CAD",
    //       amount: this.getTotalAmountDue() * 100,
    //       description: "Bus Ticket Booking",
    //       payeeName: formikBag.values.payeeName,
    //       payeePhone: formikBag.values.payeePhone,
    //       payeeEmail: formikBag.values.payeeEmail,
    //       departure: {
    //         ...this.props.cachedState.departureForm,
    //       },
    //       return: {
    //         ...this.props.cachedState.returnForm,
    //       },
    //       ticketProds: this.props.ticketProducts,
    //     },
    //   }),
    // });
  }

  async createTicketSaleAndTicketTypes(
    transaction: any,
    departingTicketId: string,
    departingTicketDate: string,
    departingDropoff: string,
    departingPickup: string,
    departingRequiresWheelchair: boolean,
    departingPassengerTickets: PassengerTicket[],
  ) {
    let ticketSchedule = null;
    // check if a schedule exists already
    const existingSchedule: any = await API.graphql(
      graphqlOperation(queries.listSchedules, {
        filter: {
          and: {
            date: {
              eq: moment(departingTicketDate).format("YYYY-MM-DD"),
            },
          },
        },
      }),
    );
    // console.log("existingSchedule:", existingSchedule);

    // filter to keep only the existing schedules for the selected ticket
    const filteredSchedules = existingSchedule.data.listSchedules.items.filter(
      (schedule: any) => schedule.departureTicket.id === departingTicketId,
    );
    // console.log("filteredSchedules:", filteredSchedules);

    // if no existing schedule, then create one
    if (!filteredSchedules.length) {
      const newScheduleData = {
        date: moment(departingTicketDate).format("YYYY-MM-DD"),
        scheduleDepartureTicketId: departingTicketId,
      };

      const newSchedule: any = await API.graphql(
        graphqlOperation(mutations.createSchedule, { input: newScheduleData }),
      );
      ticketSchedule = newSchedule.data.createSchedule;
    } else {
      // we know there will be 1 existing schedule for each date/ticketId combination
      ticketSchedule = filteredSchedules[0];
    }

    // console.log("ticketSchedule:", ticketSchedule);

    // schedule exists, now create the Ticket Sale
    const newTicketSale: any = await API.graphql(
      graphqlOperation(mutations.createTicketSale, {
        input: {
          ticketSaleTypeId: departingTicketId,
          arrivesDropoffLoc: departingDropoff ? departingDropoff : null,
          departsPickupLoc: departingPickup ? departingPickup : null,
          requiresWheelchair: departingRequiresWheelchair,
          ticketSaleScheduleId: ticketSchedule.id,
          ticketSaleTransactionId: transaction.id,
        },
      }),
    );

    // console.log("newTicketSale:", newTicketSale);

    // ticket sale ecists, now create the Ticket Sale Types
    const newTicketSaleTypes: any[] = departingPassengerTickets.map((passTicket: PassengerTicket) => {
      const selectedDepartureTicket: any = this.props.ticketProducts.find(
        (ticketProd: any) => ticketProd.id === departingTicketId,
      );
      // console.log("selectedDepartureTicket:", selectedDepartureTicket);

      const selectedDepartureTicketType = selectedDepartureTicket.ticketTypes.items.find(
        (ticketType: any) => ticketType.id === passTicket.type,
      );
      // console.log("selectedDepartureTicketType:", selectedDepartureTicketType);
      const newTicketSaleType = {
        age: selectedDepartureTicketType.age,
        travellerName: passTicket.name, //todo, ensure travellerNames are validated
        price: selectedDepartureTicketType.price,
      };
      return newTicketSaleType;
    });

    // ticket sale exists, create ticket types
    await Promise.all(
      newTicketSaleTypes.map(async (ticketSaleType: any) => {
        const newTicketSaleType: any = await API.graphql(
          graphqlOperation(mutations.createTicketSaleType, {
            input: {
              age: ticketSaleType.age.toString(),
              travellerName: ticketSaleType.travellerName.toString(),
              price: +ticketSaleType.price,
              ticketSaleTypeTicketId: newTicketSale.data.createTicketSale.id.toString(),
            },
          }),
        );
        // console.log("newTicketSaleType:", newTicketSaleType);
      }),
    );
  }

  async createTransactionAndTicketSales(formikBag: FormikProps<CheckoutFormValues>): Promise<any> {
    // create the transaction
    const transaction: any = await API.graphql(
      graphqlOperation(mutations.createTransaction, {
        input: {
          payeeName: formikBag.values.payeeName.toString(),
          payeeEmail: formikBag.values.payeeEmail.toString(),
          payeePhone: formikBag.values.payeePhone.toString(),
          totalPaid: +this.getTotalAmountDue(),
        },
      }),
    );

    // create departure ticket
    await this.createTicketSaleAndTicketTypes(
      transaction.data.createTransaction,
      this.props.cachedState.departureForm.ticketId,
      this.props.cachedState.departureForm.departureDate,
      this.props.cachedState.departureForm.dropoffLocation,
      this.props.cachedState.departureForm.pickupLocation,
      this.props.cachedState.departureForm.requiresWheelchair,
      this.props.cachedState.departureForm.passengerTickets,
    );

    // create return ticket
    if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.ticketId) {
      await this.createTicketSaleAndTicketTypes(
        transaction.data.createTransaction,
        this.props.cachedState.returnForm.ticketId,
        this.props.cachedState.returnForm.departureDate,
        this.props.cachedState.returnForm.dropoffLocation,
        this.props.cachedState.returnForm.pickupLocation,
        this.props.cachedState.returnForm.requiresWheelchair,
        this.props.cachedState.returnForm.passengerTickets,
      );
    }

    // create extra return ticket
    if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.extraTicketId) {
      await this.createTicketSaleAndTicketTypes(
        transaction.data.createTransaction,
        this.props.cachedState.returnForm.extraTicketId,
        this.props.cachedState.returnForm.extraDepartureDate,
        this.props.cachedState.returnForm.extraDropoffLocation,
        this.props.cachedState.returnForm.extraPickupLocation,
        this.props.cachedState.returnForm.extraRequiresWheelchair,
        this.props.cachedState.returnForm.extraPassengerTickets,
      );
    }
  }

  onStripeCheckout(token: any, formikBag: FormikProps<CheckoutFormValues>) {
    console.log("token:", token);
    setTimeout(() => {
      scrollToTop();
    }, 150);

    this.setState({
      checkingOut: true,
    });

    // ensure authenticated session
    Auth.currentAuthenticatedUser().catch((err: any) => {
      Auth.signIn(credentials.guestUsername, credentials.guestPassword);
    });

    // process stripe charge
    this.processStripeCharge(token, formikBag)
      .then((res: any) => {
        console.log("res:", res);

        // create transaction and tickets
        this.createTransactionAndTicketSales(formikBag)
          .then((res: any) => {
            console.log("res:", res);
            // set loading to false, show success page
            console.log("checkout success");
            this.setState({
              checkingOut: false,
              checkoutSuccess: true,
              checkoutSuccessOrder: {
                payeeName: formikBag.values.payeeName,
                payeeEmail: formikBag.values.payeeEmail,
                payeePhone: formikBag.values.payeePhone,
                departure: {
                  ...this.props.cachedState.departureForm,
                },
                return: {
                  ...this.props.cachedState.returnForm,
                },
              },
            });
            // empty cache
            localStorage.setItem("order", "");
          })
          .catch((err: any) => {
            console.log("err:", err);
            // error creating tickets
            this.setState({
              checkingOut: false,
            });
          });
      })
      .catch((err: any) => {
        // there was a problem processing the credit card
        this.setState({
          checkingOut: false,
        });
        console.log("err:", err);
      });
  }

  initReviewOrderData = () => {
    // Departure Ticket
    this.departTicket = this.props.ticketProducts.find(
      (ticket: any) => ticket.id === this.props.cachedState.departureForm.ticketId,
    );

    // get all adult departure tickets
    this.adultTicketType =
      this.departTicket &&
      this.departTicket.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Adult"));
    this.departingAdultTickets =
      this.adultTicketType &&
      this.props.cachedState.departureForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.adultTicketType.id,
      );

    // get all child departure tickets
    this.childTicketType =
      this.departTicket &&
      this.departTicket.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Child"));
    this.departingChildTickets =
      this.childTicketType &&
      this.props.cachedState.departureForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.childTicketType.id,
      );

    // get all infant departure tickets
    this.infantTicketType =
      this.departTicket &&
      this.departTicket.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Infant"));
    this.departingInfantTickets =
      this.infantTicketType &&
      this.props.cachedState.departureForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.infantTicketType.id,
      );

    // calc subtotal
    this.subTotal = 0;
    // # adults * priceAdult +
    this.subTotal += this.departingAdultTickets ? this.departingAdultTickets.length * this.adultTicketType.price : 0;
    // # children * priceChildren +
    this.subTotal += this.departingChildTickets ? this.departingChildTickets.length * this.childTicketType.price : 0;
    // # infant * priceInfant +
    this.subTotal += this.departingInfantTickets ? this.departingInfantTickets.length * this.infantTicketType.price : 0;

    // Return ticket one
    if (this.props.cachedState.returnForm) {
      this.returnTicket1 = this.props.ticketProducts.find(
        (ticket: any) => ticket.id === this.props.cachedState.returnForm.ticketId,
      );
    }

    // get all adult departure tickets
    this.return1AdultTicketType =
      this.returnTicket1 &&
      this.returnTicket1.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Adult"));
    this.returning1AdultTickets =
      this.return1AdultTicketType &&
      this.props.cachedState.returnForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return1AdultTicketType.id,
      );

    // get all child departure tickets
    this.return1ChildTicketType =
      this.returnTicket1 &&
      this.returnTicket1.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Child"));
    this.returning1ChildTickets =
      this.return1ChildTicketType &&
      this.props.cachedState.returnForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return1ChildTicketType.id,
      );

    // get all infant departure tickets
    this.return1InfantTicketType =
      this.returnTicket1 &&
      this.returnTicket1.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Infant"));
    this.returning1InfantTickets =
      this.return1InfantTicketType &&
      this.props.cachedState.returnForm.passengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return1InfantTicketType.id,
      );

    // console.log("this.return1InfantTicketType:", this.return1InfantTicketType);

    // calc subtotal
    this.return1SubTotal = 0;
    // # adults * priceAdult +
    this.return1SubTotal +=
      this.returning1AdultTickets && this.returning1AdultTickets.length
        ? this.returning1AdultTickets.length * this.return1AdultTicketType.price
        : 0;
    // # children * priceChildren +
    this.return1SubTotal +=
      this.returning1ChildTickets && this.returning1ChildTickets.length
        ? this.returning1ChildTickets.length * this.return1ChildTicketType.price
        : 0;
    // # infant * priceInfant +
    this.return1SubTotal +=
      this.returning1InfantTickets && this.returning1InfantTickets.length
        ? this.returning1InfantTickets.length * this.infantTicketType.price
        : 0;

    // Return ticket two
    if (this.props.cachedState.returnForm) {
      this.returnTicket2 = this.props.ticketProducts.find(
        (ticket: any) => ticket.id === this.props.cachedState.returnForm.extraTicketId,
      );
    }

    // get all adult departure tickets
    this.return2AdultTicketType =
      this.returnTicket2 &&
      this.returnTicket2.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Adult"));
    this.returning2AdultTickets =
      this.return2AdultTicketType &&
      this.props.cachedState.returnForm.extraPassengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return2AdultTicketType.id,
      );

    // get all child departure tickets
    this.return2ChildTicketType =
      this.returnTicket2 &&
      this.returnTicket2.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Child"));
    this.returning2ChildTickets =
      this.return2ChildTicketType &&
      this.props.cachedState.returnForm.extraPassengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return2ChildTicketType.id,
      );

    // get all infant departure tickets
    this.return2InfantTicketType =
      this.returnTicket2 &&
      this.returnTicket2.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Infant"));
    this.returning2InfantTickets =
      this.return2InfantTicketType &&
      this.props.cachedState.returnForm.extraPassengerTickets.filter(
        (passTicket: PassengerTicket) => passTicket.type === this.return2InfantTicketType.id,
      );

    // calc subtotal
    this.return2SubTotal = 0;
    // # adults * priceAdult +
    this.return2SubTotal +=
      this.returning2AdultTickets && this.returning2AdultTickets.length
        ? this.returning2AdultTickets.length * this.return2AdultTicketType.price
        : 0;
    // # children * priceChildren +
    this.return2SubTotal +=
      this.returning2ChildTickets && this.returning2ChildTickets.length
        ? this.returning2ChildTickets.length * this.return2ChildTicketType.price
        : 0;
    // # infant * priceInfant +
    this.return2SubTotal +=
      this.returning2InfantTickets && this.returning2InfantTickets.length
        ? this.returning2InfantTickets.length * this.return2InfantTicketType.price
        : 0;
  };

  handleTabChange(e: any, value: number) {
    this.setState({
      activeTab: value,
    });
  }

  onContinueToCheckout() {
    // scroll to top of tabs
    (this.checkoutTabsRef as any).current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // set the checkout tab as the active tab
    this.setState({
      activeTab: 1,
    });
  }

  onBack() {
    // set the selected activeStep
    this.props.updateParentState({
      activeStep: BookNowSteps.Return,
    });
  }

  // submit departure form
  onCheckoutFormSubmit(values: CheckoutFormValues) {
    console.log("checkout submit values:", values);

    // const cachedUpdate = {
    //   lastActiveStep: BookNowSteps.Return,
    //   returnForm: {
    //     ...values,
    //   },
    //   departureForm: {
    //     ...this.props.cachedState.departureForm,
    //   },
    // };
    // set the selected activeStep
    // this.props.updateParentState({
    //   activeStep: BookNowSteps.Return,
    //   cachedState: cachedUpdate,
    // });
  }

  renderReviewOrderDeparture(
    departTicket: any,
    departingAdultTickets: any,
    adultTicketType: any,
    departingChildTickets: any,
    childTicketType: any,
    departingInfantTickets: any,
    infantTicketType: any,
    subTotal: number,
  ) {
    return (
      <Paper className="bg-light py-4 my-4">
        <hr className="w-75 border-secondary" />

        <div className="text-center">
          <Icon fontSize="large" className={classNames(classes.icon, "fa 2x fa-ticket")} color="primary" />
          <Typography component="strong" variant="title">
            Departure Ticket
          </Typography>

          <hr className="w-75 border-secondary" />
        </div>

        {/* Departure Details */}
        <div className="container">
          <h5>
            <strong>Departing {departTicket.departsLocName} </strong>
          </h5>
          <h5 className="text-right">
            <small className="pb-2 border-bottom border-dark">
              on {moment(this.props.cachedState.departureForm.departureDate).format("MMM DD, YYYY")} @{" "}
              {departTicket.departsTime}
            </small>
          </h5>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" component="th" align="left" style={{ width: "50%" }}>
                  Passengers
                </TableCell>
                <TableCell component="th" padding="none" align="center" style={{ width: "15%" }}>
                  Qty
                </TableCell>
                <TableCell component="th" padding="none" align="right" style={{ width: "35%" }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Adult Row */}
              {departingAdultTickets && departingAdultTickets.length ? (
                <TableRow>
                  <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                    {adultTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{departingAdultTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(adultTicketType.price * departingAdultTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Child Row */}
              {departingChildTickets && departingChildTickets.length ? (
                <TableRow>
                  <TableCell padding="none" component="td" align="left" style={{ width: "50%" }}>
                    {childTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{departingChildTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(childTicketType.price * departingChildTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Infant Row */}
              {departingInfantTickets && departingInfantTickets.length ? (
                <TableRow>
                  <TableCell padding="none" component="td" align="left" style={{ width: "50%" }}>
                    {infantTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{departingInfantTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(infantTicketType.price * departingInfantTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    {new Intl.NumberFormat("en-CDN", {
                      style: "currency",
                      currency: "USD",
                      currencyDisplay: "symbol",
                    }).format(subTotal)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Pickup Location */}
            {this.props.cachedState.departureForm.pickupLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Pickup Location: </strong> <br />
                    <em className="ml-2">{this.props.cachedState.departureForm.pickupLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}
            {/* Dropoff Location */}
            {this.props.cachedState.departureForm.dropoffLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Dropoff Location: </strong>
                    <br />
                    <em className="ml-2">{this.props.cachedState.departureForm.dropoffLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}
            {/* Estimated Arrival Time */}
            <li className="list-group-item bg-transparent">
              <h5 className="">
                <small className="">
                  <strong>Estimated Arrival Time: </strong>
                  <em className="ml-2">{departTicket.arrivesTime}</em>
                </small>
              </h5>
            </li>
            {/* Requires Wheelchair */}
            {this.props.cachedState.departureForm.requiresWheelchair ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Wheelchair Reserved: </strong>
                    <em className="ml-2">
                      <i className="text-success fa fa-check-square" />
                    </em>
                  </small>
                </h5>
              </li>
            ) : null}
          </ul>
        </div>
      </Paper>
    );
  }

  renderReviewOrderReturnOne(
    returnTicket1: any,
    returning1AdultTickets: any,
    return1AdultTicketType: any,
    returning1ChildTickets: any,
    return1ChildTicketType: any,
    returning1InfantTickets: any,
    return1InfantTicketType: any,
    return1SubTotal: number,
  ): JSX.Element {
    return (
      <Paper className="bg-light py-4 my-4">
        <hr className="w-75 border-secondary" />

        <div className="text-center">
          <Icon fontSize="large" className={classNames(classes.icon, "fa 2x fa-ticket")} color="primary" />
          <Typography component="strong" variant="title">
            Return Ticket{" "}
            {this.props.cachedState.returnForm.ticketId && this.props.cachedState.returnForm.extraTicketId
              ? "One"
              : null}
          </Typography>

          <hr className="w-75 border-secondary" />
        </div>

        {/* Return Details */}
        <div className="container">
          <h5>
            <strong>Departing {returnTicket1 && returnTicket1.departsLocName} </strong>
          </h5>
          <h5 className="text-right">
            <small className="pb-1 border-bottom border-dark">
              on {moment(this.props.cachedState.returnForm.departureDate).format("MMM DD, YYYY")} @{" "}
              {returnTicket1 && returnTicket1.departsTime}
            </small>
          </h5>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                  Passengers
                </TableCell>
                <TableCell component="th" align="center" padding="none" style={{ width: "15%" }}>
                  Qty
                </TableCell>
                <TableCell align="right" component="th" padding="none" style={{ width: "35%" }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Adult Row */}
              {returning1AdultTickets && returning1AdultTickets.length ? (
                <TableRow>
                  <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                    {return1AdultTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning1AdultTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return1AdultTicketType.price * returning1AdultTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Child Row */}
              {returning1ChildTickets && returning1ChildTickets.length ? (
                <TableRow>
                  <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                    {return1ChildTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning1ChildTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return1ChildTicketType.price * returning1ChildTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Infant Row */}
              {returning1InfantTickets && returning1InfantTickets.length ? (
                <TableRow>
                  <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                    {return1InfantTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning1InfantTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return1InfantTicketType.price * returning1InfantTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    {new Intl.NumberFormat("en-CDN", {
                      style: "currency",
                      currency: "USD",
                      currencyDisplay: "symbol",
                    }).format(return1SubTotal)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Selected Pickup */}
            {this.props.cachedState.returnForm.pickupLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Pickup Location: </strong>{" "}
                    <em className="ml-2">{this.props.cachedState.returnForm.pickupLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}
            {/* Selected Dropoff */}
            {this.props.cachedState.returnForm.dropoffLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Dropoff Location: </strong>
                    <br />
                    <em className="ml-2">{this.props.cachedState.returnForm.dropoffLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}
            {/* Estimated Arrival Time */}
            <li className="list-group-item bg-transparent">
              <h5 className="">
                <small className="">
                  <strong>Estimated Arrival Time: </strong>
                  <em className="ml-2">{returnTicket1.arrivesTime}</em>
                </small>
              </h5>
            </li>
            {/* Requires Wheelchair */}
            {this.props.cachedState.returnForm.requiresWheelchair ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Wheelchair Reserved: </strong>
                    <em className="ml-2">
                      <i className="text-success fa fa-check-square" />
                    </em>
                  </small>
                </h5>
              </li>
            ) : null}
          </ul>
        </div>
      </Paper>
    );
  }

  renderReviewOrderReturnTwo(
    returnTicket2: any,
    returning2AdultTickets: any,
    return2AdultTicketType: any,
    returning2ChildTickets: any,
    return2ChildTicketType: any,
    returning2InfantTickets: any,
    return2InfantTicketType: any,
    return2SubTotal: number,
  ): JSX.Element {
    return (
      <Paper className="bg-light py-4 my-4">
        <hr className="w-75 border-secondary" />

        <div className="text-center">
          <Icon fontSize="large" className={classNames(classes.icon, "fa 2x fa-ticket")} color="primary" />
          <Typography component="strong" variant="title">
            Return Ticket{" "}
            {this.props.cachedState.returnForm.ticketId && this.props.cachedState.returnForm.extraTicketId
              ? "Two"
              : null}
          </Typography>

          <hr className="w-75 border-secondary" />
        </div>

        {/* Departure Details */}
        <div className="container">
          <h5>
            <strong>Departing {returnTicket2 && returnTicket2.departsLocName} </strong>
          </h5>
          <h5 className="text-right">
            <small className="pb-1 border-bottom border-dark">
              on {moment(this.props.cachedState.returnForm.extraDepartureDate).format("MMM DD, YYYY")} @{" "}
              {returnTicket2 && returnTicket2.departsTime}
            </small>
          </h5>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                  Passengers
                </TableCell>
                <TableCell component="th" align="center" padding="none" style={{ width: "15%" }}>
                  Qty
                </TableCell>
                <TableCell align="right" component="th" padding="none" style={{ width: "35%" }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Adult Row */}
              {returning2AdultTickets && returning2AdultTickets.length ? (
                <TableRow>
                  <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "50%" }}>
                    {return2AdultTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning2AdultTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return2AdultTicketType.price * returning2AdultTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Child Row */}
              {returning2ChildTickets && returning2ChildTickets.length ? (
                <TableRow>
                  <TableCell component="th" scope="row" align="left" padding="none">
                    {return2ChildTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning2ChildTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return2ChildTicketType.price * returning2ChildTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Infant Row */}
              {returning2InfantTickets && returning2InfantTickets.length ? (
                <TableRow>
                  <TableCell component="th" scope="row" align="left" padding="none">
                    {return2InfantTicketType.age}
                  </TableCell>
                  <TableCell component="td" align="center" padding="none" style={{ width: "15%" }}>
                    x{returning2InfantTickets.length}
                  </TableCell>
                  <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                    <strong>
                      {new Intl.NumberFormat("en-CDN", {
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "symbol",
                      }).format(return2InfantTicketType.price * returning2InfantTickets.length)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    {new Intl.NumberFormat("en-CDN", {
                      style: "currency",
                      currency: "USD",
                      currencyDisplay: "symbol",
                    }).format(return2SubTotal)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Selected Pickup */}
            {this.props.cachedState.returnForm.extraPickupLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Pickup Location: </strong>{" "}
                    <em className="ml-2">{this.props.cachedState.returnForm.extraPickupLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}
            {/* Selected Dropoff */}
            {this.props.cachedState.returnForm.extraDropoffLocation ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Selected Dropoff Location: </strong>
                    <br />
                    <em className="ml-2">{this.props.cachedState.returnForm.extraDropoffLocation}</em>
                  </small>
                </h5>
              </li>
            ) : null}

            {/* Estimated Arrival Time */}
            <li className="list-group-item bg-transparent">
              <h5 className="">
                <small className="">
                  <strong>Estimated Arrival Time: </strong>
                  <em className="ml-2">{returnTicket2.arrivesTime}</em>
                </small>
              </h5>
            </li>
            {/* Requires Wheelchair */}
            {this.props.cachedState.returnForm.extraRequiresWheelchair ? (
              <li className="list-group-item bg-transparent">
                <h5 className="">
                  <small className="">
                    <strong>Wheelchair Reserved: </strong>
                    <em className="ml-2">
                      <i className="text-success fa fa-check-square" />
                    </em>
                  </small>
                </h5>
              </li>
            ) : null}
          </ul>
        </div>
      </Paper>
    );
  }

  renderCheckoutTab(formikBag: FormikProps<CheckoutFormValues>): JSX.Element {
    return (
      <React.Fragment>
        <h2>
          <small>Payment Details:</small>
        </h2>
        {/* <button type="button" onClick={() => this.testShit(formikBag)}>
          Test Shit
        </button> */}
        {/* Total Amount Due */}
        <h5 className="text-right">
          <span className="pb-2 border-secondary border-bottom">
            <strong>
              <small>Total Amount Due: </small>
            </strong>
            <span className="ml-2 mb-2">
              {new Intl.NumberFormat("en-CDN", {
                style: "currency",
                currency: "USD",
                currencyDisplay: "symbol",
              }).format(this.getTotalAmountDue())}
            </span>
          </span>
        </h5>

        <div className="row">
          <div className="col">
            <FormControl className="w-100" margin="normal">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor={`payeeName-required`}>
                Payee Name <sup>*</sup>
              </InputLabel>
              <Input
                type="text"
                error={!!formikBag.errors.payeeName && formikBag.touched.payeeName}
                value={formikBag.values.payeeName}
                onChange={formikBag.handleChange}
                onBlur={formikBag.handleBlur}
                name={`payeeName`}
                inputProps={{
                  id: `payeeName-required`,
                }}
              />
              {!!formikBag.errors.payeeName && formikBag.values.payeeName.length ? (
                <FormHelperText className={formikBag.touched.payeeName ? "text-danger" : ""}>
                  {formikBag.errors.payeeName}
                </FormHelperText>
              ) : null}
            </FormControl>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <FormControl className="w-100" margin="normal">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor={`payeeEmail-required`}>
                Payee Email <sup>*</sup>
              </InputLabel>
              <Input
                type="email"
                error={!!formikBag.errors.payeeEmail && formikBag.touched.payeeEmail}
                value={formikBag.values.payeeEmail}
                onChange={formikBag.handleChange}
                onBlur={formikBag.handleBlur}
                name={`payeeEmail`}
                inputProps={{
                  id: `payeeEmail-required`,
                }}
              />
              {!!formikBag.errors.payeeEmail && formikBag.values.payeeEmail.length ? (
                <FormHelperText className={formikBag.touched.payeeEmail ? "text-danger" : ""}>
                  {formikBag.errors.payeeEmail}
                </FormHelperText>
              ) : null}
            </FormControl>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <FormControl className="w-100" margin="normal">
              {/* className={classes.formControl} */}
              <InputLabel htmlFor={`payeePhone-required`}>
                Payee Phone # <sup>*</sup>
              </InputLabel>
              <Input
                type="tel"
                error={!!formikBag.errors.payeePhone && formikBag.touched.payeePhone}
                value={formikBag.values.payeePhone}
                onChange={formikBag.handleChange}
                onBlur={formikBag.handleBlur}
                name={`payeePhone`}
                inputProps={{
                  id: `payeePhone-required`,
                }}
              />
              {!!formikBag.errors.payeePhone && formikBag.values.payeePhone.length ? (
                <FormHelperText className={formikBag.touched.payeePhone ? "text-danger" : ""}>
                  {formikBag.errors.payeePhone}
                </FormHelperText>
              ) : null}
            </FormControl>
          </div>
        </div>

        {/* Credit Card Element */}
        <div className="row my-4">
          <div className="col justify-content-center d-flex">
            <FormControl>
              {this.props.appData ? (
                <StripeCheckout
                  currency="CAD"
                  stripeKey="pk_test_96M7DAWZBxn5eZDIn2dNtUEe"
                  amount={this.getTotalAmountDue() * 100}
                  name={this.props.appData.app.name}
                  locale="auto"
                  email={formikBag.values.payeeEmail}
                  description={this.props.appData.app.slogan}
                  image={logoThumb}
                  token={(token: any) => this.onStripeCheckout(token, formikBag)}
                  allowRememberMe={false}
                >
                  <Button btnType="button" theme="primary" disabled={!formikBag.isValid}>
                    Pay with Credit Card
                  </Button>
                </StripeCheckout>
              ) : null}
            </FormControl>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getTotalAmountDue(): number {
    return this.subTotal + this.return1SubTotal + this.return2SubTotal;
  }

  renderReviewOrderTab(): JSX.Element {
    return (
      <React.Fragment>
        {this.departTicket ? (
          <React.Fragment>
            <h2>
              <small>Trip Summary Details:</small>
            </h2>

            {/* Departure */}
            {this.props.cachedState.departureForm.ticketId
              ? this.renderReviewOrderDeparture(
                  this.departTicket,
                  this.departingAdultTickets,
                  this.adultTicketType,
                  this.departingChildTickets,
                  this.childTicketType,
                  this.departingInfantTickets,
                  this.infantTicketType,
                  this.subTotal,
                )
              : null}

            {/* show return ticket only if noReturnNeeded is not checked, or if one of the return tickets has been selected */}
            {this.props.cachedState.returnForm &&
            (!this.props.cachedState.returnForm.noReturnNeeded ||
              (this.props.cachedState.returnForm.ticketId || this.props.cachedState.returnForm.extraTicketId)) ? (
              <React.Fragment>
                {/* Return One */}
                {this.props.cachedState.returnForm.ticketId
                  ? this.renderReviewOrderReturnOne(
                      this.returnTicket1,
                      this.returning1AdultTickets,
                      this.return1AdultTicketType,
                      this.returning1ChildTickets,
                      this.return1ChildTicketType,
                      this.returning1InfantTickets,
                      this.return1InfantTicketType,
                      this.return1SubTotal,
                    )
                  : null}
                {/* Return Two */}
                {this.props.cachedState.returnForm.extraTicketId
                  ? this.renderReviewOrderReturnTwo(
                      this.returnTicket2,
                      this.returning2AdultTickets,
                      this.return2AdultTicketType,
                      this.returning2ChildTickets,
                      this.return2ChildTicketType,
                      this.returning2InfantTickets,
                      this.return2InfantTicketType,
                      this.return2SubTotal,
                    )
                  : null}
              </React.Fragment>
            ) : // no departure ticket selected
            null}

            <div className="row mt-4">
              <button className="btn btn-link pull-left ml-2" onClick={this.onBack}>
                <i className="fa fa-3x fa-chevron-circle-left text-secondary" />
              </button>
              <Button classes="mx-auto" theme="secondary" btnType="button" click={this.onContinueToCheckout}>
                Continue to Checkout
              </Button>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }

  onKeyboardChange(
    e: React.ChangeEvent<any>,
    formikBag: FormikProps<CheckoutFormValues>,
    fieldName: keyof CheckoutFormValues,
  ): void {
    formikBag.setFieldValue(fieldName, (e.target as HTMLSelectElement).value);
  }

  resendOrderConfirmationEmail(): void {
    this.setState({
      resendingConfirmationEmail: true,
    });

    API.post("stripe", "/resend-order-confirmation-email", {
      body: {
        charge: {
          payeeName: this.state.checkoutSuccessOrder.payeeName,
          payeePhone: this.state.checkoutSuccessOrder.payeePhone,
          payeeEmail: this.state.checkoutSuccessOrder.payeeEmail,
          departure: {
            ...this.state.checkoutSuccessOrder.departure,
          },
          return: {
            ...this.state.checkoutSuccessOrder.return,
          },
          ticketProds: this.props.ticketProducts,
        },
      },
    })
      .then((res: any) => {
        console.log("res:", res);
        this.setState({
          resendingConfirmationEmail: false,
          resendConfirmationSuccess: true,
        });
      })
      .catch((err: any) => {
        console.log("err:", err);
        this.setState({
          resendingConfirmationEmail: false,
        });
      });

    // return fetch("http://localhost:3001/resend-order-confirmation-email", {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     charge: {
    //       payeeName: this.state.checkoutSuccessOrder.payeeName,
    //       payeePhone: this.state.checkoutSuccessOrder.payeePhone,
    //       payeeEmail: this.state.checkoutSuccessOrder.payeeEmail,
    //       departure: {
    //         ...this.state.checkoutSuccessOrder.departure,
    //       },
    //       return: {
    //         ...this.state.checkoutSuccessOrder.return,
    //       },
    //       ticketProds: this.props.ticketProducts,
    //     },
    //   }),
    // });
  }

  testShit(formikBag: FormikProps<CheckoutFormValues>) {
    this.setState({
      checkingOut: true,
    });

    this.createTransactionAndTicketSales(formikBag)
      .then((res: any) => {
        console.log("res:", res);
      })
      .catch((err: any) => {
        console.log("err:", err);
      });

    // fetch("http://localhost:3001/resend-order-confirmation-email", {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     charge: {
    //       currency: "CAD",
    //       amount: this.getTotalAmountDue() * 100,
    //       description: "Bus Ticket Booking",
    //       payeeName: formikBag.values.payeeName,
    //       payeePhone: formikBag.values.payeePhone,
    //       payeeEmail: formikBag.values.payeeEmail,
    //       departure: {
    //         ...this.props.cachedState.departureForm,
    //       },
    //       return: {
    //         ...this.props.cachedState.returnForm,
    //       },
    //       ticketProds: this.props.ticketProducts,
    //     },
    //   }),
    // })
    //   .then((res: any) => {
    //     console.log("res:", res);
    //   })
    //   .catch((err: any) => {
    //     console.log("err:", err);
    //   });
  }

  render() {
    return (
      <div>
        {this.state.validatingOrder ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {this.state.checkingOut ? (
              // Checking Out / Processing CC
              <Spinner />
            ) : (
              <React.Fragment>
                <div>
                  {this.state.checkoutSuccess ? (
                    // Checkout Success
                    <div className="alert alert-success mt-4">
                      <h2 className="alert-title text-center">Trip Booked!</h2>
                      <hr />
                      <p>
                        Your bus seats are officially reserved! We have sent you an email that includes your receipt as
                        well as your tickets. You will be required to provide this email as well as one piece of
                        government issued ID for each traveller in order to board the bus. If you do not receive the
                        email within a few minutes, you can resend the email using the following link.
                      </p>
                      <div className="text-center">
                        <Button
                            kind="link"
                            to="/more-info"
                            theme="primary"
                          >
                          Review Travel Policies
                        </Button>
                        <Button
                          btnType="button"
                          theme="secondary"
                          click={this.resendOrderConfirmationEmail}
                          disabled={this.state.resendingConfirmationEmail}
                        >
                          Resend Confirmation Email{" "}
                          {this.state.resendingConfirmationEmail ? (
                            <i className="fa fa-spinner text-primary fa-pulse" />
                          ) : null}
                          {this.state.resendConfirmationSuccess ? <i className="fa fa-check text-success" /> : null}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Formik // Checkout Form
                      initialValues={{
                        payeeName: "",
                        payeeEmail: "",
                        payeePhone: "",
                      }}
                      onSubmit={(values: CheckoutFormValues) => this.onCheckoutFormSubmit(values)}
                      validationSchema={Yup.object().shape({
                        payeeName: Yup.string()
                          .required("Required")
                          .min(3, "Please provide your first and last name"),
                        payeeEmail: Yup.string()
                          .email("Please provide a valid email address")
                          .required("Required"),
                        payeePhone: Yup.string()
                          .required("Required")
                          .test("payeePhoneIsOnlyNumbers", "Please provide a valid 10 digit phone number", (value) =>
                            new RegExp(/^\d{10}$/g).test(value),
                          ),
                      })}
                      render={(formikBag: FormikProps<CheckoutFormValues>) => {
                        return (
                          <React.Fragment>
                            {/* <button type="button" onClick={() => this.testShit(formikBag)}>
                              Test Shit
                            </button> */}
                            <div ref={this.checkoutTabsRef}>
                              <Steps activeStep={this.props.activeStep} clicked={this.props.updateParentState} />
                            </div>
                            <React.Fragment>
                              {this.state.validateOrderErrors ? (
                                <React.Fragment>
                                  <div className="alert alert-danger">
                                    <h4 className="alert-title">There is a problem with your ticket selection.</h4>
                                    <hr />

                                    {/* departure ticket errors */}
                                    {this.state.validateOrderErrors.departureForm.length ? (
                                      <div>
                                        <h5>Departure Ticket</h5>
                                        <ul>
                                          {this.state.validateOrderErrors.departureForm.map(
                                            (errorMsg: string, index: number) => {
                                              return <li key={index}>{errorMsg}</li>;
                                            },
                                          )}
                                        </ul>
                                      </div>
                                    ) : null}

                                    {/* return ticket one errors */}
                                    {this.state.validateOrderErrors.returnForm.length ? (
                                      <div>
                                        <h5>Return Ticket</h5>
                                        <ul>
                                          {this.state.validateOrderErrors.returnForm.map(
                                            (errorMsg: string, index: number) => {
                                              return <li key={index}>{errorMsg}</li>;
                                            },
                                          )}
                                        </ul>
                                      </div>
                                    ) : null}

                                    {/* return ticket two errors */}
                                    {this.state.validateOrderErrors.returnExtraForm.length ? (
                                      <div>
                                        <h5>Return Ticket Two</h5>
                                        <ul>
                                          {this.state.validateOrderErrors.returnExtraForm.map(
                                            (errorMsg: string, index: number) => {
                                              return <li key={index}>{errorMsg}</li>;
                                            },
                                          )}
                                        </ul>
                                      </div>
                                    ) : null}
                                  </div>
                                  <button className="btn btn-link ml-2" onClick={this.onBack}>
                                    <i className="fa fa-3x fa-chevron-circle-left text-secondary" />
                                  </button>
                                </React.Fragment>
                              ) : null}
                            </React.Fragment>
                            {this.state.validateOrderSuccess ? (
                              <div>
                                {this.props.ticketProducts.length ? (
                                  <React.Fragment>
                                    <AppBar className="mb-2" position="static" color="default">
                                      <Tabs
                                        value={this.state.activeTab}
                                        onChange={this.handleTabChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                      >
                                        <Tab label="Review Order" icon={<ReceiptIcon />} />
                                        <Tab label="Checkout" icon={<CreditCardIcon />} />
                                      </Tabs>
                                    </AppBar>
                                    {this.state.activeTab === 0 && (
                                      <TabContent className="w-100" style={{ animationDuration: "450ms" }}>
                                        {this.renderReviewOrderTab()}
                                      </TabContent>
                                    )}

                                    {this.state.activeTab === 1 && (
                                      <TabContent className="w-100" style={{ animationDuration: "450ms" }}>
                                        {this.renderCheckoutTab(formikBag)}
                                      </TabContent>
                                    )}
                                  </React.Fragment>
                                ) : (
                                  <Spinner />
                                )}
                              </div>
                            ) : null}
                            <React.Fragment />
                          </React.Fragment>
                        );
                      }}
                    />
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    appData: state.appData,
  };
}

export default connect(mapStateToProps)(CheckoutForm);
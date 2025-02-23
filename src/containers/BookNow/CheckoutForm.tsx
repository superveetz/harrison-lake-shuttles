import * as React from "react";
import * as Yup from "yup";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import { Link } from "react-router-dom";
import { scrollToTop } from "../../shared/util";
import { Formik, FormikProps } from "formik";
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
  Switch,
  FormControlLabel,
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
  reviewedPolicies: boolean;
}

export interface PromoCodeFormValues {
  promoCode: string;
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
  checkoutFail: boolean;
  checkoutSuccess: boolean;
  validatingOrder: boolean;
  validateOrderSuccess: boolean;
  validateOrderErrors: null | OrderErrors;
  checkoutSuccessOrder: any;
  resendingConfirmationEmail: boolean;
  resendConfirmationSuccess: boolean;
  promoCodeApplied: boolean;
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

const GST_TAX_AMOUNT: number = 0.05;
const PST_TAX_AMOUNT: number = 0.07;

// CheckoutForm Class
class CheckoutForm extends React.Component<CheckoutFormProps & CheckoutFormReduxProps, {}> {
  public state: CheckoutFormState = {
    activeTab: 0,
    checkingOut: false,
    checkoutFail: false,
    checkoutSuccess: false,
    validatingOrder: true,
    validateOrderSuccess: false,
    validateOrderErrors: null,
    checkoutSuccessOrder: null,
    resendingConfirmationEmail: false,
    resendConfirmationSuccess: false,
    promoCodeApplied: false
  };

  private checkoutTabsRef: React.Ref<HTMLDivElement>;

  private promoCodeAmountSaved: number = 0;
  private promoCodeDiscountPerc: number = 0.1;

  private departTicket: any;
  private adultTicketType: any;
  private departingAdultTickets: PassengerTicket[] = [];
  private childTicketType: any;
  private departingChildTickets: PassengerTicket[] = [];
  private infantTicketType: any;
  private departingInfantTickets: PassengerTicket[] = [];
  private taxSubTotal: number = 0;
  private taxPstSubTotal: number = 0;
  private subTotal: number = 0;

  private returnTicket1: any;
  private return1AdultTicketType: any;
  private returning1AdultTickets: PassengerTicket[] = [];
  private return1ChildTicketType: any;
  private returning1ChildTickets: PassengerTicket[] = [];
  private return1InfantTicketType: any;
  private returning1InfantTickets: PassengerTicket[] = [];
  private returning1TaxSubTotal: number = 0;
  private returning1TaxPSTSubTotal: number = 0;
  private return1SubTotal: number = 0;

  private returnTicket2: any;
  private return2AdultTicketType: any;
  private returning2AdultTickets: PassengerTicket[] = [];
  private return2ChildTicketType: any;
  private returning2ChildTickets: PassengerTicket[] = [];
  private return2InfantTicketType: any;
  private returning2InfantTickets: PassengerTicket[] = [];
  private returning2TaxSubTotal: number = 0;
  private returning2TaxPSTSubTotal: number = 0;
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
    this.onPromoCodeFormSubmit = this.onPromoCodeFormSubmit.bind(this);

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
      this.validateOrder().finally(() => { });
    }
  }

  private validateOrder(): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      // validate selected order
      const orderErrors: OrderErrors = this.validateFrontEndErrors();
      // update state
      const hasFrontEndErrors =
        orderErrors.departureForm.length || orderErrors.returnForm.length || orderErrors.returnExtraForm.length;

      if (hasFrontEndErrors) {
        // has front end errors
        this.setState({
          validatingOrder: false,
          validateOrderErrors: orderErrors,
          validateOrderSuccess: false,
        });
        return reject(false);
      }

      // validate order against schedule
      const promiseArray = [
        this.validateTicket(
          this.props.cachedState.departureForm.departureDate,
          this.props.cachedState.departureForm.ticketId,
          this.props.cachedState.departureForm.passengerTickets.length,
          this.props.cachedState.departureForm.requiresWheelchair,
        ),
      ];

      if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.ticketId) {
        // add return form validation
        promiseArray.push(
          this.validateTicket(
            this.props.cachedState.returnForm.departureDate,
            this.props.cachedState.returnForm.ticketId,
            this.props.cachedState.returnForm.passengerTickets.length,
            this.props.cachedState.returnForm.requiresWheelchair,
          ),
        );
      }

      if (this.props.cachedState.returnForm && this.props.cachedState.returnForm.extraTicketId) {
        // add extra return form validation
        promiseArray.push(
          this.validateTicket(
            this.props.cachedState.returnForm.extraDepartureDate,
            this.props.cachedState.returnForm.extraTicketId,
            this.props.cachedState.returnForm.extraPassengerTickets.length,
            this.props.cachedState.returnForm.extraRequiresWheelchair,
          ),
        );
      }

      Promise.all(promiseArray).then(([depErrs, returnErrs, returnExtraErrs]) => {
        // any errs
        if (depErrs.length || (returnErrs && returnErrs.length) || (returnExtraErrs && returnExtraErrs.length)) {
          const orderErrs: OrderErrors = {
            departureForm: depErrs,
            returnForm: returnErrs ? returnErrs : [],
            returnExtraForm: returnExtraErrs ? returnExtraErrs : [],
          };

          this.setState({
            validatingOrder: false,
            validateOrderErrors: orderErrs,
            validateOrderSuccess: false,
          });

          return reject(false);
        } else {
          // all ok
          this.setState({
            validatingOrder: false,
            validateOrderSuccess: true,
          });
          return resolve(true);
        }
      });
    });
  }

  async validateTicket(
    departureDate: string,
    ticketId: string,
    seatsRequested: number = 0,
    requiresWheelchair: boolean,
  ): Promise<string[]> {
    const errors: string[] = [];

    if (!ticketId || !departureDate || !seatsRequested) return errors;

    // validate against schedule
    return await ScheduleService.findScheduleForRoute(departureDate, ticketId).then((scheduleForRoute: any) => {
      // console.log("scheduleForRoute:", scheduleForRoute);

      const scheduleForRouteDateFormatted = moment(departureDate).format("MMM DD, YYYY");
      if (!scheduleForRoute) {
        // no route exists yet
        return errors;
      }

      if (scheduleForRoute.closed) {
        // schedule is closed for the day
        errors.push(
          `Unfortunately the bus is receiving scheduled maintenance on ${scheduleForRouteDateFormatted}. Please try a different departure date.`,
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
      moment(this.props.cachedState.returnForm.departureDate).format("YYYY-MM-DD") ===
      moment(this.props.cachedState.returnForm.extraDepartureDate).format("YYYY-MM-DD")
    ) {
      errors.returnExtraForm.push(
        "Whoops, it appears you've tried to reserve a wheelchair more than once for the same date and route. We only have one wheelchair seat on the bus.",
      );
    }

    return errors;
  }

  private processStripeCharge(token: any, formikBag: FormikProps<CheckoutFormValues>): Promise<any> {
    return API.post("apihlsreststripeprod", "/process-transaction", {
      body: {
        stripeToken: token,
        charge: {
          currency: "CAD",
          // if you change amount, make sure you change it everywhere
          amount: this.getTotalAmountDue() * 100,
          description: "Bus Ticket Booking",
          payeeName: formikBag.values.payeeName,
          discountApplied: this.state.promoCodeApplied,
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

    // return fetch("http://localhost:3000/process-transaction", {
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
    //       discountApplied: this.state.promoCodeApplied,
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
    setTimeout(() => {
      scrollToTop();
    }, 150);

    this.validateOrder()
      .then(() => {
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
            // create transaction and tickets
            this.createTransactionAndTicketSales(formikBag)
              .then((res: any) => {
                // set loading to false, show success page
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
              checkoutFail: true,
            });
            console.log("err:", err);
          });
      })
      .catch((err: any) => {
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
      this.departTicket.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Youth"));
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

    // apply promo code
    if (this.state.promoCodeApplied) {
      const amountSaved = this.subTotal * this.promoCodeDiscountPerc;
      this.promoCodeAmountSaved += amountSaved;
      this.subTotal -= amountSaved;
    }

    // calc tax on subtotal
    this.taxSubTotal = this.subTotal * GST_TAX_AMOUNT;
    this.taxPstSubTotal = this.subTotal * PST_TAX_AMOUNT;
    // append tax to subtotal
    this.subTotal += this.taxSubTotal;
    this.subTotal += this.taxPstSubTotal;

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
      this.returnTicket1.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Youth"));
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

    // apply promo code
    if (this.state.promoCodeApplied) {
      const amountSaved = this.return1SubTotal * this.promoCodeDiscountPerc;
      this.promoCodeAmountSaved += amountSaved;
      this.return1SubTotal -= amountSaved;
    }

    // calc tax on subtotal
    this.returning1TaxSubTotal = this.return1SubTotal * GST_TAX_AMOUNT;
    this.returning1TaxPSTSubTotal = this.return1SubTotal * PST_TAX_AMOUNT;
    // append tax to subtotal
    this.return1SubTotal += this.returning1TaxSubTotal;
    this.return1SubTotal += this.returning1TaxPSTSubTotal;

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
      this.returnTicket2.ticketTypes.items.find((ticketType: any) => ticketType.age.includes("Youth"));
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

    // apply promo code
    if (this.state.promoCodeApplied) {
      const amountSaved = this.return1SubTotal * this.promoCodeDiscountPerc;
      this.promoCodeAmountSaved += amountSaved;
      this.return1SubTotal -= amountSaved;
    }

    // calc tax on subtotal
    this.returning2TaxSubTotal = this.return2SubTotal * GST_TAX_AMOUNT;
    this.returning2TaxPSTSubTotal = this.return2SubTotal * PST_TAX_AMOUNT;
    // append tax to subtotal
    this.return2SubTotal += this.returning2TaxSubTotal;
    this.return2SubTotal += this.returning2TaxPSTSubTotal;
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
  onCheckoutFormSubmit(_values: CheckoutFormValues) {
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

  // submit promo code form
  onPromoCodeFormSubmit(values: PromoCodeFormValues) {
    if (values.promoCode.trim().toLowerCase() === "hotelsharrison") {
      this.setState({
        promoCodeApplied: true
      }, () => {
        // update prices
        this.initReviewOrderData();
        this.forceUpdate();
      });
    }
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
    taxSubTotal: number,
    taxPSTSubTotal: number,
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
                      ${(adultTicketType.price * departingAdultTickets.length).toFixed(2)}
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
                      ${(childTicketType.price * departingChildTickets.length).toFixed(2)}
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
                      ${(infantTicketType.price * departingInfantTickets.length).toFixed(2)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Tax Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>GST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${(taxSubTotal).toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>PST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${(taxPSTSubTotal).toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${subTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Estimated Arrival Time */}
            <li className="list-group-item bg-transparent">
              <div className="row">
                {/* Pickup Location */}
                {this.props.cachedState.departureForm.pickupLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Pickup Location: </strong> <br />
                        <em className="ml-2">{this.props.cachedState.departureForm.pickupLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}

                <div className="col-md">
                  <h5 className="">
                    <small className="">
                      <strong>Arriving at {departTicket.arrivesLocName}: </strong>
                      <br />
                      <em className="ml-2">
                        <u>Estimated Arrival Time</u>: {departTicket.arrivesTime}
                      </em>
                      <br />
                      <em className="ml-2">(varies depending on traffic)</em>
                    </small>
                  </h5>
                </div>

                {/* Dropoff Location */}
                {this.props.cachedState.departureForm.dropoffLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Dropoff Location: </strong>
                        <br />
                        <em className="ml-2">{this.props.cachedState.departureForm.dropoffLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}
                {/* Requires Wheelchair */}
                {this.props.cachedState.departureForm.requiresWheelchair ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Wheelchair Reserved: </strong>
                        <em className="ml-2">
                          <i className="text-success fa fa-check-square" />
                        </em>
                      </small>
                    </h5>
                  </div>
                ) : null}
              </div>
            </li>
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
    return1TaxSubTotal: number,
    return1TaxPSTSubTotal: number,
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
                      ${(return1AdultTicketType.price * returning1AdultTickets.length).toFixed(2)}
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
                      ${(return1ChildTicketType.price * returning1ChildTickets.length).toFixed(2)}
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
                      ${(return1InfantTicketType.price * returning1InfantTickets.length).toFixed(2)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Tax Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>GST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return1TaxSubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>PST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return1TaxPSTSubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return1SubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Arrival Location */}
            <li className="list-group-item bg-transparent">
              <div className="row">
                {/* Selected Pickup */}
                {this.props.cachedState.returnForm.pickupLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Pickup Location: </strong>
                        <br />
                        <em className="ml-2">{this.props.cachedState.returnForm.pickupLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}

                <div className="col-md">
                  <h5 className="">
                    <small className="">
                      <strong>Arriving at {returnTicket1.arrivesLocName}: </strong>
                      <br />
                      <em className="ml-2">
                        <u>Estimated Arrival Time</u>: {returnTicket1.arrivesTime}
                      </em>
                      <br />
                      <em className="ml-2">(varies depending on traffic)</em>
                    </small>
                  </h5>
                </div>

                {/* Selected Dropoff */}
                {this.props.cachedState.returnForm.dropoffLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Dropoff Location: </strong>
                        <br />
                        <em className="ml-2">{this.props.cachedState.returnForm.dropoffLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}

                {/* Requires Wheelchair */}
                {this.props.cachedState.returnForm.requiresWheelchair ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Wheelchair Reserved: </strong>
                        <em className="ml-2">
                          <i className="text-success fa fa-check-square" />
                        </em>
                      </small>
                    </h5>
                  </div>
                ) : null}
              </div>
            </li>
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
    return2TaxSubTotal: number,
    return2TaxPSTSubTotal: number,
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
                      ${(return2AdultTicketType.price * returning2AdultTickets.length).toFixed(2)}
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
                      ${(return2ChildTicketType.price * returning2ChildTickets.length).toFixed(2)}
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
                      ${(return2InfantTicketType.price * returning2InfantTickets.length).toFixed(2)}
                    </strong>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Tax Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>GST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return2TaxSubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>PST: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return2TaxPSTSubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>

              {/* Subtotal Row */}
              <TableRow>
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "10%" }} />
                <TableCell component="td" scope="row" align="left" padding="none" style={{ width: "55%" }}>
                  <strong>Subtotal: </strong>
                </TableCell>
                <TableCell align="right" component="td" padding="none" style={{ width: "35%" }}>
                  <strong>
                    ${return2SubTotal.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <ul className="list-group list-group-flush">
            {/* Estimated Arrival Time */}
            <li className="list-group-item bg-transparent">
              <div className="row">
                {/* Selected Pickup */}
                {this.props.cachedState.returnForm.extraPickupLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Pickup Location: </strong>
                        <br />
                        <em className="ml-2">{this.props.cachedState.returnForm.extraPickupLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}

                <div className="col-md">
                  <h5 className="">
                    <small className="">
                      <strong>Arriving at {returnTicket2.arrivesLocName}: </strong>
                      <br />
                      <em className="ml-2">
                        <u>Estimated Arrival Time</u>: {returnTicket2.arrivesTime}
                      </em>
                      <br />
                      <em className="ml-2">(varies depending on traffic)</em>
                    </small>
                  </h5>
                </div>
                {/* Selected Dropoff */}
                {this.props.cachedState.returnForm.extraDropoffLocation ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Selected Dropoff Location: </strong>
                        <br />
                        <em className="ml-2">{this.props.cachedState.returnForm.extraDropoffLocation}</em>
                      </small>
                    </h5>
                  </div>
                ) : null}
                {/* Requires Wheelchair */}
                {this.props.cachedState.returnForm.extraRequiresWheelchair ? (
                  <div className="col-md">
                    <h5 className="">
                      <small className="">
                        <strong>Wheelchair Reserved: </strong>
                        <em className="ml-2">
                          <i className="text-success fa fa-check-square" />
                        </em>
                      </small>
                    </h5>
                  </div>
                ) : null}
              </div>
            </li>
          </ul>
        </div>
      </Paper>
    );
  }

  renderCheckoutTab(): JSX.Element {
    return (
      <React.Fragment>
        <div className="mb-4">
          {/* Total Amount Due */}
          <h2 className="text-left">
            <span>
              <small>
                Total Amount Due:
            </small>
              <span className={[classes.TotalPriceWrapper, "ml-2 mb-2 float-right border-bottom border-secondary"].join(' ')} id="total-price">
                ${this.getTotalAmountDue().toFixed(2)}

                {this.state.promoCodeApplied ? (
                  <span className={[classes.PromoCodeDiscount, "p-1", "alert alert-success"].join(" ")}>
                    You Saved - ${this.promoCodeAmountSaved.toFixed(2)}
                  </span>
                ) : null}
              </span>
            </span>
          </h2>

          <Formik // Promo Code Form
            initialValues={{
              promoCode: "",
            }}
            onSubmit={(values: PromoCodeFormValues) => this.onPromoCodeFormSubmit(values)}
            validationSchema={Yup.object().shape({
              promoCode: Yup.string()
                .max(256, "Too Long"),
            })}
            render={(formikBag: FormikProps<PromoCodeFormValues>) => {
              return (
                <form onSubmit={formikBag.handleSubmit}>
                  <div className="row w-100">
                    <div className="col-9">
                      <FormControl className="w-100" margin="normal">
                        {/* className={classes.formControl} */}
                        <InputLabel htmlFor={`promoCode-required`}>
                          Enter Promo Code
                      </InputLabel>
                        <Input
                          type="text"
                          error={!!formikBag.errors.promoCode && formikBag.touched.promoCode}
                          value={formikBag.values.promoCode}
                          onChange={formikBag.handleChange}
                          onBlur={formikBag.handleBlur}
                          name={`promoCode`}
                          inputProps={{
                            id: `promoCode-required`,
                          }}
                        />
                        {!!formikBag.errors.promoCode && formikBag.values.promoCode.length ? (
                          <FormHelperText className={formikBag.touched.promoCode ? "text-danger" : ""}>
                            {formikBag.errors.promoCode}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                    <div className="col-3">
                      <Button size="xs" theme="secondary" style={{ marginTop: "25px" }} btnType="submit">
                        Apply
                    </Button>
                    </div>
                  </div>
                </form>
              )
            }}
          />
        </div>
        {/* End Total Amount Due + Promo Code Form */}

        <Formik // Checkout Form
          initialValues={{
            payeeName: "",
            payeeEmail: "",
            payeePhone: "",
            reviewedPolicies: false,
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
            reviewedPolicies: Yup.boolean().test(
              "reviewedPoliciesIsTrue",
              "You must agree to the terms and conditions.",
              (value) => value === true,
            ),
          })}
          render={(formikBag: FormikProps<CheckoutFormValues>) => {
            return (
              <div>
                <h2>
                  <small>
                    Payment Details:<sup>*</sup>
                  </small>
                </h2>

                {this.state.checkoutFail ? (
                  <div className="alert alert-danger">
                    <h5 className="alert-title">Problem Processing Transaction</h5>
                    <p>
                      It appears there was a problem processing a transaction with the provided card. If this is a prepaid card,
                      then we likely do not accept this type of credit card. If this is not a prepaid card, then there may have
                      been insufficient funds to complete the transaction. Either way, your card should not have been charged.
            </p>
                  </div>
                ) : null}

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

                <div className="row">
                  <div className="col">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formikBag.values.reviewedPolicies}
                          onChange={(e: React.ChangeEvent<any>) => {
                            // update noReturnNeeded
                            this.onKeyboardChange(
                              { target: { value: e.target.checked } } as any,
                              formikBag,
                              "reviewedPolicies",
                            );
                          }}
                          value={true}
                          color="primary"
                        />
                      }
                      label={
                        <span className="text-dark">
                          I confirm that I have read, understand and agree, to the rules and travel polices described in the{" "}
                          <Link to="/more-info">More Info</Link> section.
                </span>
                      }
                    />
                  </div>
                </div>

                {/* Credit Card Element */}
                <div className="row my-4">
                  <div className="col justify-content-center d-flex">
                    <FormControl>
                      {this.props.appData ? (
                        <StripeCheckout
                          currency="CAD"
                          // test key: pk_test_96M7DAWZBxn5eZDIn2dNtUEe
                          // live key: pk_live_YQxjcmag19n5L5DOhD9yOll100DtIj0viP
                          stripeKey="pk_live_YQxjcmag19n5L5DOhD9yOll100DtIj0viP"
                          // if you change amount, make sure you change it everywhere
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
              </div>
            )
          }}
        />
      </React.Fragment>
    );
  }

  getTotalAmountDue(): number {
    // return 1;
    return this.subTotal + this.return1SubTotal + this.return2SubTotal;
  }

  renderReviewOrderTab(): JSX.Element {
    // console.log("this.childTicketType:", this.childTicketType);

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
                this.taxSubTotal,
                this.taxPstSubTotal,
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
                      this.returning1TaxSubTotal,
                      this.returning1TaxPSTSubTotal,
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
                      this.returning2TaxSubTotal,
                      this.returning2TaxPSTSubTotal,
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

    API.post("apihlsreststripeprod", "/resend-order-confirmation-email", {
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
        // console.log("res:", res);
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

    // fetch("http://localhost:3001/resend-order-confirmation-email", {
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
                            <Button classes="mt-2" kind="link" to="/more-info" theme="primary">
                              Review Travel Policies
                        </Button>
                            <Button
                              classes="mt-2"
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
                              reviewedPolicies: false,
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
                              reviewedPolicies: Yup.boolean().test(
                                "reviewedPoliciesIsTrue",
                                "testing!",
                                (value) => value === true,
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
                                              {this.renderCheckoutTab()}
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

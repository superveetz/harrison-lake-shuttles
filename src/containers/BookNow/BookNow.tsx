import * as React from "react";
import * as queries from "../../graphql/queries";
import { scrollToTop } from "../../shared/util";
import { AppDataStore } from "../../store/reducers/app-data";
import { API, graphqlOperation, Auth } from "aws-amplify";
import credentials from "../../credentials";

import PageHeader from "../../components/UI/PageHeader/PageHeader";
import Spinner from "../../components/UI/Spinner/Spinner";

import DepartureForm, { DepartureFormValues } from "./DepartureForm";
import ReturnForm, { ReturnFormValues } from "./ReturnForm";
import CheckoutForm, { CheckoutFormValues } from "./CheckoutForm";

export interface IBookNowState {
  activeStep: BookNowSteps;
  cachedState: CachedState;
  ticketProducts: any;
}

export enum BookNowSteps {
  Departure = 0,
  Return = 1,
  Checkout = 2,
  OrderComplete = 3,
}

export interface PassengerTicket {
  name: string;
  type: string;
}

export interface CachedState {
  lastActiveStep: BookNowSteps;
  departureForm: DepartureFormValues;
  returnForm: ReturnFormValues;
  // checkoutForm: CheckoutFormValues;
}

export interface BookNowMethods {
  updateParentState(updatedState: Partial<IBookNowState>): void;
}

export interface BookNowProps {
  appData: AppDataStore;
}

class BookNow extends React.Component<BookNowProps, IBookNowState> implements BookNowMethods {
  constructor(props: any) {
    super(props);
    const cachedStateString: string | null = localStorage.getItem("order");
    const cachedState: CachedState = cachedStateString
      ? JSON.parse(cachedStateString)
      : {
          lastActiveStep: BookNowSteps.Departure,
          departureForm: {
            ticketId: "",
            passengerTickets: [{ name: "", type: "" }],
            departureDate: new Date(),
            numberOfPassengers: 1,
          },
        };

    // init state
    this.state = {
      activeStep: cachedState.lastActiveStep,
      cachedState: cachedState,
      ticketProducts: [],
    };

    // bind methods
    this.fetchTicketProducts = this.fetchTicketProducts.bind(this);
    this.updateParentState = this.updateParentState.bind(this);
  }

  async componentWillMount() {
    // ensure authenticated session
    try {
      await Auth.currentAuthenticatedUser();
    } catch (err) {
      // login as guest if not authenticated
      await Auth.signIn(credentials.guestUsername, credentials.guestPassword);
    }

    // query for products
    let products: any = null;
    try {
      const res: any = await API.graphql(
        graphqlOperation(`query ListTickets(
        $filter: ModelTicketFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listTickets(filter: $filter, limit: $limit, nextToken: $nextToken) {
          items {
            id
            orderNum
            departsLong
            arrivesLong
            departsLocName
            departsLocStreet
            departsLocCity
            departsLocPostal
            departsTime
            departsDesc
            arrivesLocName
            arrivesLocStreet
            arrivesLocCity
            arrivesLocPostal
            arrivesTime
            arrivesDesc
            transitDesc
            restBreakLocations
            ticketTypes {
              items {
                id
                age
                price
              }
            }
          }
          nextToken
        }
      }`),
      );
      products = res.data.listTickets.items;
    } catch (err) {
      console.log("err:", err);
      // todo, send me an email
      products = [];
    }

    // update state
    this.setState({
      ticketProducts: products.sort((a: any, b: any) => {
        if (a.orderNum < b.orderNum) return -1;
        else if (a.orderNum > b.orderNum) return 1;
        else return 0;
      }),
    });
  }

  componentDidMount() {
    scrollToTop();
  }

  async fetchTicketProducts() {
    // ensure authenticated session
    try {
      await Auth.currentAuthenticatedUser();
    } catch (err) {
      // login as guest if not authenticated
      await Auth.signIn(credentials.guestUsername, credentials.guestPassword);
    }

    let ticketProducts = null;

    try {
      ticketProducts = API.graphql(graphqlOperation(queries.listTickets));
    } catch (err) {
      console.log("err:", err);
    }

    this.setState({
      ticketProducts: ticketProducts,
    });
  }

  updateParentState(updatedState: IBookNowState): void {
    this.setState({
      ...updatedState,
    });

    // update local storage
    if (updatedState.cachedState) {
      localStorage.setItem(
        "order",
        JSON.stringify({
          ...updatedState.cachedState,
        }),
      );
    }
  }

  private getPageContent(step: BookNowSteps) {
    // show dynamic page
    let pageContent = null;

    switch (step) {
      case BookNowSteps.Departure:
        pageContent = (
          <DepartureForm
            ticketProducts={this.state.ticketProducts}
            activeStep={this.state.activeStep}
            cachedState={this.state.cachedState}
            updateParentState={this.updateParentState}
          />
        );
        break;

      case BookNowSteps.Return:
        pageContent = (
          <ReturnForm
            ticketProducts={this.state.ticketProducts}
            activeStep={this.state.activeStep}
            cachedState={this.state.cachedState}
            updateParentState={this.updateParentState}
          />
        );
        break;

      case BookNowSteps.Checkout:
        pageContent = (
          <CheckoutForm
            ticketProducts={this.state.ticketProducts}
            activeStep={this.state.activeStep}
            cachedState={this.state.cachedState}
            updateParentState={this.updateParentState}
          />
        );
        break;

      default:
        pageContent = <Spinner />;
    }

    return pageContent;
  }

  render() {
    const pageContent = this.getPageContent(this.state.activeStep);

    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Bus Ticket Bookings</PageHeader>

        {pageContent}
      </div>
    );
  }
}

export default BookNow;

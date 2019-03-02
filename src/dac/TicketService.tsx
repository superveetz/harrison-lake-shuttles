import { API, graphqlOperation, Auth } from "aws-amplify";
import credentials from "../credentials";

import AuthService from "./AuthService";

interface TicketServiceStaticMethods {
  fetchTicketProducts(): Promise<any>;
}

let TicketService: TicketServiceStaticMethods;
TicketService = class TicketService {
  public static async fetchTicketProducts(): Promise<any> {
    // ensure authenticated session
    try {
      await Auth.currentAuthenticatedUser();
    } catch (err) {
      // login as guest if not authenticated
      await Auth.signIn(credentials.guestUsername, credentials.guestPassword);
    }

    // query for products
    let products: any = null;
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

    // destructure
    products = res.data.listTickets.items;
    // sort them
    products.sort((a: any, b: any) => {
      if (a.orderNum < b.orderNum) return -1;
      else if (a.orderNum > b.orderNum) return 1;
      else return 0;
    });

    return products;
  }
};

export default TicketService;

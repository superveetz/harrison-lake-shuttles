/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateAppInput = {
  id?: string | null,
  name: string,
  slogan?: string | null,
  infoEmail: string,
  companyStreetAddress?: string | null,
  companyCity?: string | null,
  companyProvState?: string | null,
  companyPostalZip?: string | null,
  companyStartYear?: string | null,
};

export type UpdateAppInput = {
  id: string,
  name?: string | null,
  slogan?: string | null,
  infoEmail?: string | null,
  companyStreetAddress?: string | null,
  companyCity?: string | null,
  companyProvState?: string | null,
  companyPostalZip?: string | null,
  companyStartYear?: string | null,
};

export type DeleteAppInput = {
  id?: string | null,
};

export type CreateTicketTypeInput = {
  id?: string | null,
  age: string,
  price: number,
  ticketTicketTypesId?: string | null,
};

export type UpdateTicketTypeInput = {
  id: string,
  age?: string | null,
  price?: number | null,
  ticketTicketTypesId?: string | null,
};

export type DeleteTicketTypeInput = {
  id?: string | null,
};

export type CreateTicketInput = {
  id?: string | null,
  orderNum?: number | null,
  departsLong?: string | null,
  arrivesLong?: string | null,
  departsLocName?: string | null,
  departsLocStreet?: string | null,
  departsLocCity?: string | null,
  departsLocPostal?: string | null,
  departsTime?: string | null,
  departsDesc?: string | null,
  arrivesLocName?: string | null,
  arrivesLocStreet?: string | null,
  arrivesLocCity?: string | null,
  arrivesLocPostal?: string | null,
  arrivesTime?: string | null,
  arrivesDesc?: string | null,
  transitDesc?: string | null,
  restBreakLocations?: Array< string | null > | null,
};

export type UpdateTicketInput = {
  id: string,
  orderNum?: number | null,
  departsLong?: string | null,
  arrivesLong?: string | null,
  departsLocName?: string | null,
  departsLocStreet?: string | null,
  departsLocCity?: string | null,
  departsLocPostal?: string | null,
  departsTime?: string | null,
  departsDesc?: string | null,
  arrivesLocName?: string | null,
  arrivesLocStreet?: string | null,
  arrivesLocCity?: string | null,
  arrivesLocPostal?: string | null,
  arrivesTime?: string | null,
  arrivesDesc?: string | null,
  transitDesc?: string | null,
  restBreakLocations?: Array< string | null > | null,
};

export type DeleteTicketInput = {
  id?: string | null,
};

export type CreateTicketSaleTypeInput = {
  id?: string | null,
  age: string,
  travellerName: string,
  price: number,
  ticketSaleTypeTicketId?: string | null,
};

export type UpdateTicketSaleTypeInput = {
  id: string,
  age?: string | null,
  travellerName?: string | null,
  price?: number | null,
  ticketSaleTypeTicketId?: string | null,
};

export type DeleteTicketSaleTypeInput = {
  id?: string | null,
};

export type CreateTicketSaleInput = {
  id?: string | null,
  arrivesDropoffLoc?: string | null,
  departsPickupLoc?: string | null,
  requiresWheelchair: boolean,
  ticketSaleTypeId: string,
  ticketSaleTransactionId?: string | null,
  ticketSaleScheduleId?: string | null,
};

export type UpdateTicketSaleInput = {
  id: string,
  arrivesDropoffLoc?: string | null,
  departsPickupLoc?: string | null,
  requiresWheelchair?: boolean | null,
  ticketSaleTypeId?: string | null,
  ticketSaleTransactionId?: string | null,
  ticketSaleScheduleId?: string | null,
};

export type DeleteTicketSaleInput = {
  id?: string | null,
};

export type CreateTransactionInput = {
  id?: string | null,
  payeeName: string,
  payeeEmail: string,
  payeePhone: string,
  totalPaid: number,
};

export type UpdateTransactionInput = {
  id: string,
  payeeName?: string | null,
  payeeEmail?: string | null,
  payeePhone?: string | null,
  totalPaid?: number | null,
};

export type DeleteTransactionInput = {
  id?: string | null,
};

export type CreateScheduleInput = {
  id?: string | null,
  date: string,
  closed?: boolean | null,
  scheduleDepartureTicketId: string,
};

export type UpdateScheduleInput = {
  id: string,
  date?: string | null,
  closed?: boolean | null,
  scheduleDepartureTicketId?: string | null,
};

export type DeleteScheduleInput = {
  id?: string | null,
};

export type CreateReservedSeatInput = {
  id?: string | null,
  name: string,
  note?: string | null,
  requiresWheelchair?: boolean | null,
  scheduleReservedSeatsId?: string | null,
};

export type UpdateReservedSeatInput = {
  id: string,
  name?: string | null,
  note?: string | null,
  requiresWheelchair?: boolean | null,
  scheduleReservedSeatsId?: string | null,
};

export type DeleteReservedSeatInput = {
  id?: string | null,
};

export type ModelAppFilterInput = {
  id?: ModelIDFilterInput | null,
  name?: ModelStringFilterInput | null,
  slogan?: ModelStringFilterInput | null,
  infoEmail?: ModelStringFilterInput | null,
  companyStreetAddress?: ModelStringFilterInput | null,
  companyCity?: ModelStringFilterInput | null,
  companyProvState?: ModelStringFilterInput | null,
  companyPostalZip?: ModelStringFilterInput | null,
  companyStartYear?: ModelStringFilterInput | null,
  and?: Array< ModelAppFilterInput | null > | null,
  or?: Array< ModelAppFilterInput | null > | null,
  not?: ModelAppFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelTicketTypeFilterInput = {
  id?: ModelIDFilterInput | null,
  age?: ModelStringFilterInput | null,
  price?: ModelFloatFilterInput | null,
  and?: Array< ModelTicketTypeFilterInput | null > | null,
  or?: Array< ModelTicketTypeFilterInput | null > | null,
  not?: ModelTicketTypeFilterInput | null,
};

export type ModelFloatFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type ModelTicketFilterInput = {
  id?: ModelIDFilterInput | null,
  orderNum?: ModelIntFilterInput | null,
  departsLong?: ModelStringFilterInput | null,
  arrivesLong?: ModelStringFilterInput | null,
  departsLocName?: ModelStringFilterInput | null,
  departsLocStreet?: ModelStringFilterInput | null,
  departsLocCity?: ModelStringFilterInput | null,
  departsLocPostal?: ModelStringFilterInput | null,
  departsTime?: ModelStringFilterInput | null,
  departsDesc?: ModelStringFilterInput | null,
  arrivesLocName?: ModelStringFilterInput | null,
  arrivesLocStreet?: ModelStringFilterInput | null,
  arrivesLocCity?: ModelStringFilterInput | null,
  arrivesLocPostal?: ModelStringFilterInput | null,
  arrivesTime?: ModelStringFilterInput | null,
  arrivesDesc?: ModelStringFilterInput | null,
  transitDesc?: ModelStringFilterInput | null,
  restBreakLocations?: ModelStringFilterInput | null,
  and?: Array< ModelTicketFilterInput | null > | null,
  or?: Array< ModelTicketFilterInput | null > | null,
  not?: ModelTicketFilterInput | null,
};

export type ModelIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type ModelTicketSaleTypeFilterInput = {
  id?: ModelIDFilterInput | null,
  age?: ModelStringFilterInput | null,
  travellerName?: ModelStringFilterInput | null,
  price?: ModelFloatFilterInput | null,
  and?: Array< ModelTicketSaleTypeFilterInput | null > | null,
  or?: Array< ModelTicketSaleTypeFilterInput | null > | null,
  not?: ModelTicketSaleTypeFilterInput | null,
};

export type ModelTicketSaleFilterInput = {
  id?: ModelIDFilterInput | null,
  arrivesDropoffLoc?: ModelStringFilterInput | null,
  departsPickupLoc?: ModelStringFilterInput | null,
  requiresWheelchair?: ModelBooleanFilterInput | null,
  and?: Array< ModelTicketSaleFilterInput | null > | null,
  or?: Array< ModelTicketSaleFilterInput | null > | null,
  not?: ModelTicketSaleFilterInput | null,
};

export type ModelBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelTransactionFilterInput = {
  id?: ModelIDFilterInput | null,
  payeeName?: ModelStringFilterInput | null,
  payeeEmail?: ModelStringFilterInput | null,
  payeePhone?: ModelStringFilterInput | null,
  totalPaid?: ModelFloatFilterInput | null,
  and?: Array< ModelTransactionFilterInput | null > | null,
  or?: Array< ModelTransactionFilterInput | null > | null,
  not?: ModelTransactionFilterInput | null,
};

export type ModelScheduleFilterInput = {
  id?: ModelIDFilterInput | null,
  date?: ModelStringFilterInput | null,
  closed?: ModelBooleanFilterInput | null,
  and?: Array< ModelScheduleFilterInput | null > | null,
  or?: Array< ModelScheduleFilterInput | null > | null,
  not?: ModelScheduleFilterInput | null,
};

export type ModelReservedSeatFilterInput = {
  id?: ModelIDFilterInput | null,
  name?: ModelStringFilterInput | null,
  note?: ModelStringFilterInput | null,
  requiresWheelchair?: ModelBooleanFilterInput | null,
  and?: Array< ModelReservedSeatFilterInput | null > | null,
  or?: Array< ModelReservedSeatFilterInput | null > | null,
  not?: ModelReservedSeatFilterInput | null,
};

export type CreateAppMutationVariables = {
  input: CreateAppInput,
};

export type CreateAppMutation = {
  createApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type UpdateAppMutationVariables = {
  input: UpdateAppInput,
};

export type UpdateAppMutation = {
  updateApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type DeleteAppMutationVariables = {
  input: DeleteAppInput,
};

export type DeleteAppMutation = {
  deleteApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type CreateTicketTypeMutationVariables = {
  input: CreateTicketTypeInput,
};

export type CreateTicketTypeMutation = {
  createTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type UpdateTicketTypeMutationVariables = {
  input: UpdateTicketTypeInput,
};

export type UpdateTicketTypeMutation = {
  updateTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type DeleteTicketTypeMutationVariables = {
  input: DeleteTicketTypeInput,
};

export type DeleteTicketTypeMutation = {
  deleteTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type CreateTicketMutationVariables = {
  input: CreateTicketInput,
};

export type CreateTicketMutation = {
  createTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateTicketMutationVariables = {
  input: UpdateTicketInput,
};

export type UpdateTicketMutation = {
  updateTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteTicketMutationVariables = {
  input: DeleteTicketInput,
};

export type DeleteTicketMutation = {
  deleteTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateTicketSaleTypeMutationVariables = {
  input: CreateTicketSaleTypeInput,
};

export type CreateTicketSaleTypeMutation = {
  createTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type UpdateTicketSaleTypeMutationVariables = {
  input: UpdateTicketSaleTypeInput,
};

export type UpdateTicketSaleTypeMutation = {
  updateTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type DeleteTicketSaleTypeMutationVariables = {
  input: DeleteTicketSaleTypeInput,
};

export type DeleteTicketSaleTypeMutation = {
  deleteTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type CreateTicketSaleMutationVariables = {
  input: CreateTicketSaleInput,
};

export type CreateTicketSaleMutation = {
  createTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type UpdateTicketSaleMutationVariables = {
  input: UpdateTicketSaleInput,
};

export type UpdateTicketSaleMutation = {
  updateTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type DeleteTicketSaleMutationVariables = {
  input: DeleteTicketSaleInput,
};

export type DeleteTicketSaleMutation = {
  deleteTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type CreateTransactionMutationVariables = {
  input: CreateTransactionInput,
};

export type CreateTransactionMutation = {
  createTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateTransactionMutationVariables = {
  input: UpdateTransactionInput,
};

export type UpdateTransactionMutation = {
  updateTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteTransactionMutationVariables = {
  input: DeleteTransactionInput,
};

export type DeleteTransactionMutation = {
  deleteTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateScheduleMutationVariables = {
  input: CreateScheduleInput,
};

export type CreateScheduleMutation = {
  createSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type UpdateScheduleMutationVariables = {
  input: UpdateScheduleInput,
};

export type UpdateScheduleMutation = {
  updateSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type DeleteScheduleMutationVariables = {
  input: DeleteScheduleInput,
};

export type DeleteScheduleMutation = {
  deleteSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type CreateReservedSeatMutationVariables = {
  input: CreateReservedSeatInput,
};

export type CreateReservedSeatMutation = {
  createReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type UpdateReservedSeatMutationVariables = {
  input: UpdateReservedSeatInput,
};

export type UpdateReservedSeatMutation = {
  updateReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type DeleteReservedSeatMutationVariables = {
  input: DeleteReservedSeatInput,
};

export type DeleteReservedSeatMutation = {
  deleteReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type GetAppQueryVariables = {
  id: string,
};

export type GetAppQuery = {
  getApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type ListAppsQueryVariables = {
  filter?: ModelAppFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAppsQuery = {
  listApps:  {
    __typename: "ModelAppConnection",
    items:  Array< {
      __typename: "App",
      id: string,
      name: string,
      slogan: string | null,
      infoEmail: string,
      companyStreetAddress: string | null,
      companyCity: string | null,
      companyProvState: string | null,
      companyPostalZip: string | null,
      companyStartYear: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTicketTypeQueryVariables = {
  id: string,
};

export type GetTicketTypeQuery = {
  getTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type ListTicketTypesQueryVariables = {
  filter?: ModelTicketTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTicketTypesQuery = {
  listTicketTypes:  {
    __typename: "ModelTicketTypeConnection",
    items:  Array< {
      __typename: "TicketType",
      id: string,
      age: string,
      price: number,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTicketQueryVariables = {
  id: string,
};

export type GetTicketQuery = {
  getTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListTicketsQueryVariables = {
  filter?: ModelTicketFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTicketsQuery = {
  listTickets:  {
    __typename: "ModelTicketConnection",
    items:  Array< {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTicketSaleTypeQueryVariables = {
  id: string,
};

export type GetTicketSaleTypeQuery = {
  getTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type ListTicketSaleTypesQueryVariables = {
  filter?: ModelTicketSaleTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTicketSaleTypesQuery = {
  listTicketSaleTypes:  {
    __typename: "ModelTicketSaleTypeConnection",
    items:  Array< {
      __typename: "TicketSaleType",
      id: string,
      age: string,
      travellerName: string,
      price: number,
      ticket:  {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTicketSaleQueryVariables = {
  id: string,
};

export type GetTicketSaleQuery = {
  getTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type ListTicketSalesQueryVariables = {
  filter?: ModelTicketSaleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTicketSalesQuery = {
  listTicketSales:  {
    __typename: "ModelTicketSaleConnection",
    items:  Array< {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTransactionQueryVariables = {
  id: string,
};

export type GetTransactionQuery = {
  getTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransactionsQuery = {
  listTransactions:  {
    __typename: "ModelTransactionConnection",
    items:  Array< {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetScheduleQueryVariables = {
  id: string,
};

export type GetScheduleQuery = {
  getSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type ListSchedulesQueryVariables = {
  filter?: ModelScheduleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSchedulesQuery = {
  listSchedules:  {
    __typename: "ModelScheduleConnection",
    items:  Array< {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetReservedSeatQueryVariables = {
  id: string,
};

export type GetReservedSeatQuery = {
  getReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type ListReservedSeatsQueryVariables = {
  filter?: ModelReservedSeatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReservedSeatsQuery = {
  listReservedSeats:  {
    __typename: "ModelReservedSeatConnection",
    items:  Array< {
      __typename: "ReservedSeat",
      id: string,
      name: string,
      note: string | null,
      requiresWheelchair: boolean | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateAppSubscription = {
  onCreateApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type OnUpdateAppSubscription = {
  onUpdateApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type OnDeleteAppSubscription = {
  onDeleteApp:  {
    __typename: "App",
    id: string,
    name: string,
    slogan: string | null,
    infoEmail: string,
    companyStreetAddress: string | null,
    companyCity: string | null,
    companyProvState: string | null,
    companyPostalZip: string | null,
    companyStartYear: string | null,
  } | null,
};

export type OnCreateTicketTypeSubscription = {
  onCreateTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type OnUpdateTicketTypeSubscription = {
  onUpdateTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type OnDeleteTicketTypeSubscription = {
  onDeleteTicketType:  {
    __typename: "TicketType",
    id: string,
    age: string,
    price: number,
  } | null,
};

export type OnCreateTicketSubscription = {
  onCreateTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateTicketSubscription = {
  onUpdateTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteTicketSubscription = {
  onDeleteTicket:  {
    __typename: "Ticket",
    id: string,
    orderNum: number | null,
    departsLong: string | null,
    arrivesLong: string | null,
    departsLocName: string | null,
    departsLocStreet: string | null,
    departsLocCity: string | null,
    departsLocPostal: string | null,
    departsTime: string | null,
    departsDesc: string | null,
    arrivesLocName: string | null,
    arrivesLocStreet: string | null,
    arrivesLocCity: string | null,
    arrivesLocPostal: string | null,
    arrivesTime: string | null,
    arrivesDesc: string | null,
    transitDesc: string | null,
    restBreakLocations: Array< string | null > | null,
    ticketTypes:  {
      __typename: "ModelTicketTypeConnection",
      items:  Array< {
        __typename: "TicketType",
        id: string,
        age: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateTicketSaleTypeSubscription = {
  onCreateTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type OnUpdateTicketSaleTypeSubscription = {
  onUpdateTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type OnDeleteTicketSaleTypeSubscription = {
  onDeleteTicketSaleType:  {
    __typename: "TicketSaleType",
    id: string,
    age: string,
    travellerName: string,
    price: number,
    ticket:  {
      __typename: "TicketSale",
      id: string,
      type:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      arrivesDropoffLoc: string | null,
      departsPickupLoc: string | null,
      requiresWheelchair: boolean,
      ticketTypes:  {
        __typename: "ModelTicketSaleTypeConnection",
        nextToken: string | null,
      } | null,
      transaction:  {
        __typename: "Transaction",
        id: string,
        payeeName: string,
        payeeEmail: string,
        payeePhone: string,
        totalPaid: number,
      } | null,
      schedule:  {
        __typename: "Schedule",
        id: string,
        date: string,
        closed: boolean | null,
      } | null,
    } | null,
  } | null,
};

export type OnCreateTicketSaleSubscription = {
  onCreateTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type OnUpdateTicketSaleSubscription = {
  onUpdateTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type OnDeleteTicketSaleSubscription = {
  onDeleteTicketSale:  {
    __typename: "TicketSale",
    id: string,
    type:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    arrivesDropoffLoc: string | null,
    departsPickupLoc: string | null,
    requiresWheelchair: boolean,
    ticketTypes:  {
      __typename: "ModelTicketSaleTypeConnection",
      items:  Array< {
        __typename: "TicketSaleType",
        id: string,
        age: string,
        travellerName: string,
        price: number,
      } | null > | null,
      nextToken: string | null,
    } | null,
    transaction:  {
      __typename: "Transaction",
      id: string,
      payeeName: string,
      payeeEmail: string,
      payeePhone: string,
      totalPaid: number,
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
    } | null,
    schedule:  {
      __typename: "Schedule",
      id: string,
      date: string,
      departureTicket:  {
        __typename: "Ticket",
        id: string,
        orderNum: number | null,
        departsLong: string | null,
        arrivesLong: string | null,
        departsLocName: string | null,
        departsLocStreet: string | null,
        departsLocCity: string | null,
        departsLocPostal: string | null,
        departsTime: string | null,
        departsDesc: string | null,
        arrivesLocName: string | null,
        arrivesLocStreet: string | null,
        arrivesLocCity: string | null,
        arrivesLocPostal: string | null,
        arrivesTime: string | null,
        arrivesDesc: string | null,
        transitDesc: string | null,
        restBreakLocations: Array< string | null > | null,
      },
      tickets:  {
        __typename: "ModelTicketSaleConnection",
        nextToken: string | null,
      } | null,
      reservedSeats:  {
        __typename: "ModelReservedSeatConnection",
        nextToken: string | null,
      } | null,
      closed: boolean | null,
    } | null,
  } | null,
};

export type OnCreateTransactionSubscription = {
  onCreateTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateTransactionSubscription = {
  onUpdateTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteTransactionSubscription = {
  onDeleteTransaction:  {
    __typename: "Transaction",
    id: string,
    payeeName: string,
    payeeEmail: string,
    payeePhone: string,
    totalPaid: number,
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateScheduleSubscription = {
  onCreateSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type OnUpdateScheduleSubscription = {
  onUpdateSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type OnDeleteScheduleSubscription = {
  onDeleteSchedule:  {
    __typename: "Schedule",
    id: string,
    date: string,
    departureTicket:  {
      __typename: "Ticket",
      id: string,
      orderNum: number | null,
      departsLong: string | null,
      arrivesLong: string | null,
      departsLocName: string | null,
      departsLocStreet: string | null,
      departsLocCity: string | null,
      departsLocPostal: string | null,
      departsTime: string | null,
      departsDesc: string | null,
      arrivesLocName: string | null,
      arrivesLocStreet: string | null,
      arrivesLocCity: string | null,
      arrivesLocPostal: string | null,
      arrivesTime: string | null,
      arrivesDesc: string | null,
      transitDesc: string | null,
      restBreakLocations: Array< string | null > | null,
      ticketTypes:  {
        __typename: "ModelTicketTypeConnection",
        nextToken: string | null,
      } | null,
    },
    tickets:  {
      __typename: "ModelTicketSaleConnection",
      items:  Array< {
        __typename: "TicketSale",
        id: string,
        arrivesDropoffLoc: string | null,
        departsPickupLoc: string | null,
        requiresWheelchair: boolean,
      } | null > | null,
      nextToken: string | null,
    } | null,
    reservedSeats:  {
      __typename: "ModelReservedSeatConnection",
      items:  Array< {
        __typename: "ReservedSeat",
        id: string,
        name: string,
        note: string | null,
        requiresWheelchair: boolean | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
    closed: boolean | null,
  } | null,
};

export type OnCreateReservedSeatSubscription = {
  onCreateReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type OnUpdateReservedSeatSubscription = {
  onUpdateReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

export type OnDeleteReservedSeatSubscription = {
  onDeleteReservedSeat:  {
    __typename: "ReservedSeat",
    id: string,
    name: string,
    note: string | null,
    requiresWheelchair: boolean | null,
  } | null,
};

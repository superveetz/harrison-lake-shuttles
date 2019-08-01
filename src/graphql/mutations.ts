// tslint:disable
// this is an auto generated file. This will be overwritten

export const createApp = `mutation CreateApp($input: CreateAppInput!) {
  createApp(input: $input) {
    id
    name
    slogan
    infoEmail
    companyStreetAddress
    companyCity
    companyProvState
    companyPostalZip
    companyStartYear
  }
}
`;
export const updateApp = `mutation UpdateApp($input: UpdateAppInput!) {
  updateApp(input: $input) {
    id
    name
    slogan
    infoEmail
    companyStreetAddress
    companyCity
    companyProvState
    companyPostalZip
    companyStartYear
  }
}
`;
export const deleteApp = `mutation DeleteApp($input: DeleteAppInput!) {
  deleteApp(input: $input) {
    id
    name
    slogan
    infoEmail
    companyStreetAddress
    companyCity
    companyProvState
    companyPostalZip
    companyStartYear
  }
}
`;
export const createTicketType = `mutation CreateTicketType($input: CreateTicketTypeInput!) {
  createTicketType(input: $input) {
    id
    age
    price
  }
}
`;
export const updateTicketType = `mutation UpdateTicketType($input: UpdateTicketTypeInput!) {
  updateTicketType(input: $input) {
    id
    age
    price
  }
}
`;
export const deleteTicketType = `mutation DeleteTicketType($input: DeleteTicketTypeInput!) {
  deleteTicketType(input: $input) {
    id
    age
    price
  }
}
`;
export const createTicket = `mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
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
      nextToken
    }
  }
}
`;
export const updateTicket = `mutation UpdateTicket($input: UpdateTicketInput!) {
  updateTicket(input: $input) {
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
      nextToken
    }
  }
}
`;
export const deleteTicket = `mutation DeleteTicket($input: DeleteTicketInput!) {
  deleteTicket(input: $input) {
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
      nextToken
    }
  }
}
`;
export const createTicketSaleType = `mutation CreateTicketSaleType($input: CreateTicketSaleTypeInput!) {
  createTicketSaleType(input: $input) {
    id
    age
    travellerName
    price
    ticket {
      id
      type {
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
      }
      arrivesDropoffLoc
      departsPickupLoc
      requiresWheelchair
      ticketTypes {
        nextToken
      }
      transaction {
        id
        payeeName
        payeeEmail
        payeePhone
        totalPaid
      }
      schedule {
        id
        date
        closed
      }
    }
  }
}
`;
export const updateTicketSaleType = `mutation UpdateTicketSaleType($input: UpdateTicketSaleTypeInput!) {
  updateTicketSaleType(input: $input) {
    id
    age
    travellerName
    price
    ticket {
      id
      type {
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
      }
      arrivesDropoffLoc
      departsPickupLoc
      requiresWheelchair
      ticketTypes {
        nextToken
      }
      transaction {
        id
        payeeName
        payeeEmail
        payeePhone
        totalPaid
      }
      schedule {
        id
        date
        closed
      }
    }
  }
}
`;
export const deleteTicketSaleType = `mutation DeleteTicketSaleType($input: DeleteTicketSaleTypeInput!) {
  deleteTicketSaleType(input: $input) {
    id
    age
    travellerName
    price
    ticket {
      id
      type {
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
      }
      arrivesDropoffLoc
      departsPickupLoc
      requiresWheelchair
      ticketTypes {
        nextToken
      }
      transaction {
        id
        payeeName
        payeeEmail
        payeePhone
        totalPaid
      }
      schedule {
        id
        date
        closed
      }
    }
  }
}
`;
export const createTicketSale = `mutation CreateTicketSale($input: CreateTicketSaleInput!) {
  createTicketSale(input: $input) {
    id
    type {
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
        nextToken
      }
    }
    arrivesDropoffLoc
    departsPickupLoc
    requiresWheelchair
    ticketTypes {
      items {
        id
        age
        travellerName
        price
      }
      nextToken
    }
    transaction {
      id
      payeeName
      payeeEmail
      payeePhone
      totalPaid
      tickets {
        nextToken
      }
    }
    schedule {
      id
      date
      departureTicket {
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
      }
      tickets {
        nextToken
      }
      reservedSeats {
        nextToken
      }
      closed
    }
  }
}
`;
export const updateTicketSale = `mutation UpdateTicketSale($input: UpdateTicketSaleInput!) {
  updateTicketSale(input: $input) {
    id
    type {
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
        nextToken
      }
    }
    arrivesDropoffLoc
    departsPickupLoc
    requiresWheelchair
    ticketTypes {
      items {
        id
        age
        travellerName
        price
      }
      nextToken
    }
    transaction {
      id
      payeeName
      payeeEmail
      payeePhone
      totalPaid
      tickets {
        nextToken
      }
    }
    schedule {
      id
      date
      departureTicket {
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
      }
      tickets {
        nextToken
      }
      reservedSeats {
        nextToken
      }
      closed
    }
  }
}
`;
export const deleteTicketSale = `mutation DeleteTicketSale($input: DeleteTicketSaleInput!) {
  deleteTicketSale(input: $input) {
    id
    type {
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
        nextToken
      }
    }
    arrivesDropoffLoc
    departsPickupLoc
    requiresWheelchair
    ticketTypes {
      items {
        id
        age
        travellerName
        price
      }
      nextToken
    }
    transaction {
      id
      payeeName
      payeeEmail
      payeePhone
      totalPaid
      tickets {
        nextToken
      }
    }
    schedule {
      id
      date
      departureTicket {
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
      }
      tickets {
        nextToken
      }
      reservedSeats {
        nextToken
      }
      closed
    }
  }
}
`;
export const createTransaction = `mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    id
    payeeName
    payeeEmail
    payeePhone
    totalPaid
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
  }
}
`;
export const updateTransaction = `mutation UpdateTransaction($input: UpdateTransactionInput!) {
  updateTransaction(input: $input) {
    id
    payeeName
    payeeEmail
    payeePhone
    totalPaid
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
  }
}
`;
export const deleteTransaction = `mutation DeleteTransaction($input: DeleteTransactionInput!) {
  deleteTransaction(input: $input) {
    id
    payeeName
    payeeEmail
    payeePhone
    totalPaid
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
  }
}
`;
export const createSchedule = `mutation CreateSchedule($input: CreateScheduleInput!) {
  createSchedule(input: $input) {
    id
    date
    departureTicket {
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
        nextToken
      }
    }
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
    reservedSeats {
      items {
        id
        name
        note
        requiresWheelchair
      }
      nextToken
    }
    closed
  }
}
`;
export const updateSchedule = `mutation UpdateSchedule($input: UpdateScheduleInput!) {
  updateSchedule(input: $input) {
    id
    date
    departureTicket {
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
        nextToken
      }
    }
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
    reservedSeats {
      items {
        id
        name
        note
        requiresWheelchair
      }
      nextToken
    }
    closed
  }
}
`;
export const deleteSchedule = `mutation DeleteSchedule($input: DeleteScheduleInput!) {
  deleteSchedule(input: $input) {
    id
    date
    departureTicket {
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
        nextToken
      }
    }
    tickets {
      items {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
      nextToken
    }
    reservedSeats {
      items {
        id
        name
        note
        requiresWheelchair
      }
      nextToken
    }
    closed
  }
}
`;
export const createReservedSeat = `mutation CreateReservedSeat($input: CreateReservedSeatInput!) {
  createReservedSeat(input: $input) {
    id
    name
    note
    requiresWheelchair
  }
}
`;
export const updateReservedSeat = `mutation UpdateReservedSeat($input: UpdateReservedSeatInput!) {
  updateReservedSeat(input: $input) {
    id
    name
    note
    requiresWheelchair
  }
}
`;
export const deleteReservedSeat = `mutation DeleteReservedSeat($input: DeleteReservedSeatInput!) {
  deleteReservedSeat(input: $input) {
    id
    name
    note
    requiresWheelchair
  }
}
`;

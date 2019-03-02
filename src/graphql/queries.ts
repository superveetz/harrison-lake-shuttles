// tslint:disable
// this is an auto generated file. This will be overwritten

export const getApp = `query GetApp($id: ID!) {
  getApp(id: $id) {
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
export const listApps = `query ListApps($filter: ModelAppFilterInput, $limit: Int, $nextToken: String) {
  listApps(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getTicketType = `query GetTicketType($id: ID!) {
  getTicketType(id: $id) {
    id
    age
    price
    ticket {
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
  }
}
`;
export const listTicketTypes = `query ListTicketTypes(
  $filter: ModelTicketTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listTicketTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      age
      price
      ticket {
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
    }
    nextToken
  }
}
`;
export const getTicketSaleType = `query GetTicketSaleType($id: ID!) {
  getTicketSaleType(id: $id) {
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
export const listTicketSaleTypes = `query ListTicketSaleTypes(
  $filter: ModelTicketSaleTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listTicketSaleTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      age
      travellerName
      price
      ticket {
        id
        arrivesDropoffLoc
        departsPickupLoc
        requiresWheelchair
      }
    }
    nextToken
  }
}
`;
export const getTicket = `query GetTicket($id: ID!) {
  getTicket(id: $id) {
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
export const listTickets = `query ListTickets(
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
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getTicketSale = `query GetTicketSale($id: ID!) {
  getTicketSale(id: $id) {
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
export const listTicketSales = `query ListTicketSales(
  $filter: ModelTicketSaleFilterInput
  $limit: Int
  $nextToken: String
) {
  listTicketSales(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getTransaction = `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
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
export const listTransactions = `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      payeeName
      payeeEmail
      payeePhone
      totalPaid
      tickets {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getSchedule = `query GetSchedule($id: ID!) {
  getSchedule(id: $id) {
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
export const listSchedules = `query ListSchedules(
  $filter: ModelScheduleFilterInput
  $limit: Int
  $nextToken: String
) {
  listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getReservedSeat = `query GetReservedSeat($id: ID!) {
  getReservedSeat(id: $id) {
    id
    name
    note
    requiresWheelchair
  }
}
`;
export const listReservedSeats = `query ListReservedSeats(
  $filter: ModelReservedSeatFilterInput
  $limit: Int
  $nextToken: String
) {
  listReservedSeats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      note
      requiresWheelchair
    }
    nextToken
  }
}
`;

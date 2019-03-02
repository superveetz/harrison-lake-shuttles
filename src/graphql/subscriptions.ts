// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateApp = `subscription OnCreateApp {
  onCreateApp {
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
export const onUpdateApp = `subscription OnUpdateApp {
  onUpdateApp {
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
export const onDeleteApp = `subscription OnDeleteApp {
  onDeleteApp {
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
export const onCreateTicketType = `subscription OnCreateTicketType {
  onCreateTicketType {
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
export const onUpdateTicketType = `subscription OnUpdateTicketType {
  onUpdateTicketType {
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
export const onDeleteTicketType = `subscription OnDeleteTicketType {
  onDeleteTicketType {
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
export const onCreateTicketSaleType = `subscription OnCreateTicketSaleType {
  onCreateTicketSaleType {
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
export const onUpdateTicketSaleType = `subscription OnUpdateTicketSaleType {
  onUpdateTicketSaleType {
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
export const onDeleteTicketSaleType = `subscription OnDeleteTicketSaleType {
  onDeleteTicketSaleType {
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
export const onCreateTicket = `subscription OnCreateTicket {
  onCreateTicket {
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
export const onUpdateTicket = `subscription OnUpdateTicket {
  onUpdateTicket {
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
export const onDeleteTicket = `subscription OnDeleteTicket {
  onDeleteTicket {
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
export const onCreateTicketSale = `subscription OnCreateTicketSale {
  onCreateTicketSale {
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
export const onUpdateTicketSale = `subscription OnUpdateTicketSale {
  onUpdateTicketSale {
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
export const onDeleteTicketSale = `subscription OnDeleteTicketSale {
  onDeleteTicketSale {
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
export const onCreateTransaction = `subscription OnCreateTransaction {
  onCreateTransaction {
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
export const onUpdateTransaction = `subscription OnUpdateTransaction {
  onUpdateTransaction {
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
export const onDeleteTransaction = `subscription OnDeleteTransaction {
  onDeleteTransaction {
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
export const onCreateSchedule = `subscription OnCreateSchedule {
  onCreateSchedule {
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
export const onUpdateSchedule = `subscription OnUpdateSchedule {
  onUpdateSchedule {
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
export const onDeleteSchedule = `subscription OnDeleteSchedule {
  onDeleteSchedule {
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
export const onCreateReservedSeat = `subscription OnCreateReservedSeat {
  onCreateReservedSeat {
    id
    name
    note
    requiresWheelchair
  }
}
`;
export const onUpdateReservedSeat = `subscription OnUpdateReservedSeat {
  onUpdateReservedSeat {
    id
    name
    note
    requiresWheelchair
  }
}
`;
export const onDeleteReservedSeat = `subscription OnDeleteReservedSeat {
  onDeleteReservedSeat {
    id
    name
    note
    requiresWheelchair
  }
}
`;

import * as mutations from "../graphql/mutations";
import { API, graphqlOperation, Auth } from "aws-amplify";
import credentials from "../credentials";
import moment from "moment";

import AuthService from "./AuthService";
import Schedule from "../containers/Admin/Schedule/Schedule";

interface ScheduleServiceStaticMethods {
  tallyTotalScheduleTravellers(scheduleTickets: any[], reservedSeats: any[]): number;
  fetchAllSchedules(): Promise<any>;
  createSchedule(newSchedule: any): Promise<any>;
  fetchSchedule(scheduleId: string): Promise<any>;
  updateSchedule(schedule: any): Promise<any>;
  deleteSchedule(scheduleId: string): Promise<any>;
  findScheduleForRoute(date: string, departureTicketId: string): Promise<any>;
  doesScheduleReqWheelchair(schedule: any): boolean;
  batchCreateReservedSeats(schedules: any[], scheduleId: string): Promise<any>;
  batchUpdateReservedSeats(schedules: any[]): Promise<any>;
  batchDeleteReservedSeats(schedules: any[]): Promise<any>;
}

let ScheduleService: ScheduleServiceStaticMethods;
ScheduleService = class ScheduleService {
  private static scheduleData: any[] = [];
  private static nextToken: string | null = "";

  constructor() {}

  static tallyTotalScheduleTravellers(scheduleTickets: any[] = [], reservedSeats: any[] = []): number {
    let totalTravellers: number = 0;

    // tally tickets
    if (scheduleTickets && scheduleTickets.length) {
      scheduleTickets.forEach((scheduleTicket: any) => {
        if (scheduleTicket.ticketTypes && scheduleTicket.ticketTypes.items && scheduleTicket.ticketTypes.items.length) {
          totalTravellers += scheduleTicket.ticketTypes.items.length;
        }
      });
    }

    // tally reserved seats
    if (reservedSeats && reservedSeats.length) totalTravellers += reservedSeats.length;

    return totalTravellers;
  }

  static async updateSchedule(schedule: any): Promise<any> {
    // ensure authenticated session
    await AuthService.ensureAuthSession();

    // update the schedule
    const scheduleUpdated: any = await API.graphql(
      graphqlOperation(mutations.updateSchedule, {
        input: {
          id: schedule.id,
          date: schedule.date,
          closed: schedule.closed,
          scheduleDepartureTicketId: schedule.departureTicketId,
        },
      }),
    );

    // update the reserved tickets
    // in order to determine which reserved tickets were deleted,
    // we need to query for the reserved tickets of the schedule and diff them
    const oldSchedule = await this.fetchSchedule(schedule.id);

    const oldReservedSeats: any[] = oldSchedule.reservedSeats.items;

    // determine which reserved seats should be deleted
    // reduce the submitted reserved seats to an array of ids or empty ids
    const dontDeleteReservedSeatIds = (schedule.reservedSeats as any[]).reduce((accumulator: any[], curr: any) => {
      if (curr.id) {
        accumulator.push(curr.id);
      }
      return accumulator;
    }, []);
    // console.log("dontDeleteReservedSeatIds:", dontDeleteReservedSeatIds);

    // go through each of the existing reserved seats and filter out the ones that
    // exist in dontDeleteReservedSeatIds
    const oldReservedSeatsToUpdate = schedule.reservedSeats.filter((newReserved: any) => {
      return newReserved.id || dontDeleteReservedSeatIds.indexOf(newReserved.id) !== -1;
    });
    // console.log("oldReservedSeatsToUpdate:", oldReservedSeatsToUpdate);

    // go through each of the existing reserved seats and filter out the ones that
    // don't exist in dontDeleteReservedSeatIds
    const oldReservedSeatsToDelete = oldReservedSeats.filter((oldReserved: any) => {
      return dontDeleteReservedSeatIds.indexOf(oldReserved.id) === -1;
    });
    // console.log("oldReservedSeatsToDelete:", oldReservedSeatsToDelete);

    // go through each of the submitted reserved setas and filter out the ones that
    // have no id
    const newReservedSeatsToCreate = schedule.reservedSeats.filter((newReserved: any) => {
      return !newReserved.id;
    });
    // console.log("newReservedSeatsToCreate:", newReservedSeatsToCreate);

    const batchedReservedSeatsCreated = await this.batchCreateReservedSeats(
      newReservedSeatsToCreate,
      scheduleUpdated.data.updateSchedule.id,
    );
    // console.log("batchedReservedSeatsCreated:", batchedReservedSeatsCreated);

    const batchedReservedSeatsUpdated = await this.batchUpdateReservedSeats(oldReservedSeatsToUpdate);
    // console.log("batchedReservedSeatsUpdated:", batchedReservedSeatsUpdated);

    const batchReservedSeatsDeleted = await this.batchDeleteReservedSeats(oldReservedSeatsToDelete);
    // console.log("batchReservedSeatsDeleted:", batchReservedSeatsDeleted);

    return scheduleUpdated.data.updateSchedule;
  }

  static async deleteSchedule(scheduleId: string): Promise<any> {
    // ensure authenticated session
    await AuthService.ensureAuthSession();

    // update the schedule
    const scheduleDeleted: any = await API.graphql(
      graphqlOperation(mutations.deleteSchedule, {
        input: {
          id: scheduleId,
        },
      }),
    );

    return scheduleDeleted;
  }

  static async batchCreateReservedSeats(reservedSeatsToCreate: any[], scheduleId: string): Promise<any> {
    return await Promise.all(
      reservedSeatsToCreate.map(async (reservedSeatToCreate: any) => {
        return await API.graphql(
          graphqlOperation(mutations.createReservedSeat, {
            input: {
              name: reservedSeatToCreate.name,
              note: reservedSeatToCreate.note ? reservedSeatToCreate.note : null,
              requiresWheelchair: reservedSeatToCreate.requiresWheelchair,
              scheduleReservedSeatsId: scheduleId,
            },
          }),
        );
      }),
    );
  }

  static async batchUpdateReservedSeats(reservedSeatsToUpdate: any[]): Promise<any> {
    return await Promise.all(
      reservedSeatsToUpdate.map(async (reservedSeatToUpdate: any) => {
        return await API.graphql(
          graphqlOperation(mutations.updateReservedSeat, {
            input: {
              id: reservedSeatToUpdate.id,
              name: reservedSeatToUpdate.name,
              note: reservedSeatToUpdate.note ? reservedSeatToUpdate.note : null,
              requiresWheelchair: reservedSeatToUpdate.requiresWheelchair,
            },
          }),
        );
      }),
    );
  }

  static async batchDeleteReservedSeats(reservedSeatsToDelete: any[]): Promise<any> {
    return await Promise.all(
      reservedSeatsToDelete.map(async (reservedSeatToDelete: any) => {
        return await API.graphql(
          graphqlOperation(mutations.deleteReservedSeat, {
            input: {
              id: reservedSeatToDelete.id,
            },
          }),
        );
      }),
    );
  }

  static doesScheduleReqWheelchair(schedule: any): boolean {
    // console.log("schedule:", schedule);

    const reqWheelChairTickets = schedule.tickets.items.find((ticket: any) => ticket.requiresWheelchair);
    // console.log("reqWheelChairTickets:", reqWheelChairTickets);

    const reqWheelChairReservedSeats = schedule.reservedSeats.items.find(
      (reservedSeat: any) => reservedSeat.requiresWheelchair,
    );
    // console.log("reqWheelChairReservedSeats:", reqWheelChairReservedSeats);

    return !!(reqWheelChairTickets || reqWheelChairReservedSeats);
  }

  static async findScheduleForRoute(date: string, departureTicketId: string): Promise<any> {
    // ensure authenticated session
    await AuthService.ensureAuthSession();
    // console.log("moment(date).format('YYYY-MM-DD'):", moment(date).format("YYYY-MM-DD"));

    // fetch all schedules for this date
    const filteredSchedules: any = await this.fetchAllSchedules({
      date: {
        eq: moment(date).format("YYYY-MM-DD"),
      },
    });

    // filter the results by the selected departure ticket
    const schedulesExist: any[] = filteredSchedules.filter(
      (schedule: any) => schedule.departureTicket.id === departureTicketId,
    );

    // return first schedule or undefined
    return schedulesExist[0];
  }

  static async fetchSchedule(scheduleId: string): Promise<any> {
    // ensure authenticated session
    await AuthService.ensureAuthSession();

    // fetch the schedule by id
    const res: any = await API.graphql(
      graphqlOperation(
        `query GetSchedule($id: ID!) {
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
              transaction {
                id
                payeeName
                payeeEmail
                payeePhone
                totalPaid
              }
              ticketTypes {
                items {
                  id
                  travellerName
                  age
                  price
                }
              }
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
          }
          closed
        }
      }
    `,
        { id: scheduleId },
      ),
    );

    // console.log("res:", res);
    return res.data.getSchedule;
  }

  static async createSchedule(newSchedule: any): Promise<any> {
    // ensure authenticated session
    await AuthService.ensureAuthSession();

    // init schedule
    const scheduleDTO = {
      date: moment(newSchedule.date).format("YYYY-MM-DD"),
      scheduleDepartureTicketId: newSchedule.departureTicketId,
      closed: newSchedule.closed,
    };

    // save the schedule
    const scheduleCreated: any = await API.graphql(graphqlOperation(mutations.createSchedule, { input: scheduleDTO }));
    // console.log("scheduleCreated:", scheduleCreated);

    // save the reserved tickets
    if (newSchedule.reservedSeats && newSchedule.reservedSeats.length) {
      // ticket sale exists, create ticket types
      await Promise.all(
        newSchedule.reservedSeats.map(async (reservedSeat: any) => {
          const reservedSeatCreated: any = await API.graphql(
            graphqlOperation(mutations.createReservedSeat, {
              input: {
                name: reservedSeat.name,
                requiresWheelchair: reservedSeat.requiresWheelchair,
                note: reservedSeat.note ? reservedSeat.note : null,
                scheduleReservedSeatsId: scheduleCreated.data.createSchedule.id,
              },
            }),
          );
        }),
      );
    }

    return scheduleCreated.data.createSchedule;
  }

  static async fetchAllSchedules(filter?: any): Promise<any> {
    // reset our loaded schedule data
    this.scheduleData = [];

    // ensure authenticated session
    await AuthService.ensureAuthSession();

    // load all of the data
    await this.loadAllScheduleDataRecursively(filter);

    // return data
    return this.scheduleData;
  }

  static async loadAllScheduleDataRecursively(filter?: any): Promise<any> {
    const res: any = await API.graphql(
      graphqlOperation(
        `query ListSchedules(
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
              items {
                id
                ticketTypes {
                  items {
                    id
                  }
                }
              }
            }
            reservedSeats {
              items {
                id
                requiresWheelchair
              }
            }
            closed
          }
          nextToken
        }
      }
      `,
        {
          filter: filter ? filter : undefined,
          limit: 200,
          nextToken: this.nextToken ? this.nextToken : undefined,
        },
      ),
    );

    // set next token
    this.nextToken = res.data.listSchedules.nextToken;
    // console.log("this.nextToken:", this.nextToken);

    // determine if there are any left to load
    if (this.nextToken === null) {
      // we are done
      this.scheduleData = this.scheduleData.concat(res.data.listSchedules.items);
      return true;
    } else {
      // concat data and carry on
      this.scheduleData = this.scheduleData.concat(res.data.listSchedules.items);
      return await this.loadAllScheduleDataRecursively(filter);
    }
  }
};

export default ScheduleService;

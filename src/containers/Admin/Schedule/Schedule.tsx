import * as React from "react";
import { scrollToTop } from "../../../shared/util";
import * as queries from "../../../graphql/queries";
import { arrayOfObjToRows } from "../../../shared/util";
import { Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { API, graphqlOperation } from "aws-amplify";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import PageHeader from "../../../components/UI/PageHeader/PageHeader";

import moment from "moment";
import _ from "lodash";
import ScheduleService from "../../../dac/ScheduleService";

interface ScheduleState {
  schedulesData: any[];
  cleanSchedulesData: any[];
  rowsPerPage: number;
}

interface ScheduleProps {}

class Schedule extends React.Component<ScheduleProps, ScheduleState> {
  public state: ScheduleState = {
    schedulesData: [],
    cleanSchedulesData: [],
    rowsPerPage: 100,
  };

  constructor(props: any) {
    super(props);

    // this.onTableChange = this.onTableChange.bind(this);
    this.onTableSortByColumn = this.onTableSortByColumn.bind(this);
    this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
    this.sortTableByDate = this.sortTableByDate.bind(this);
    this.sortTableByColumnAlphabetically = this.sortTableByColumnAlphabetically.bind(this);
    this.sortTableByColumnNumerically = this.sortTableByColumnNumerically.bind(this);
    this.renderCustomToolbar = this.renderCustomToolbar.bind(this);
  }

  private columnNames: any[] = [
    {
      name: "View",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <Button size="xs" theme="secondary" kind="link" to={`/admin/schedule/details/${value}`}>
              Details
            </Button>
          );
        },
      },
    },
    {
      name: "Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: any, tableMeta: any, updatevalue: any) => {
          return moment(value).format("MMM DD, YYYY");
        },
        // sortDirection: "desc",
      },
    },
    {
      name: "Trip",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <i>
              {value[0]} &rarr; {value[1]}
            </i>
          );
        },
      },
    },
    {
      name: "# Travellers",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "Closed",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  componentDidMount() {
    scrollToTop();

    // load schedule data
    ScheduleService.fetchAllSchedules()
      .then((schedules: any[]) => {
        console.log("fetched all schedules:", schedules);
        this.setState(
          {
            cleanSchedulesData: schedules,
          },
          () => {
            this.sortTableByDate("descending");
          },
        );
      })
      .catch((err: any) => {
        console.log("err:", err);
      });
  }

  prepSchedulesForDisplay(schedules: any[]): any[] {
    return schedules.map((schedule: any, scheduleIndex: number) => {
      return {
        id: schedule.id ? schedule.id : "",
        date: schedule.date ? schedule.date : "",
        trip: [schedule.departureTicket.departsLocName, schedule.departureTicket.arrivesLocName],
        tickets: ScheduleService.tallyTotalScheduleTravellers(schedule.tickets.items, schedule.reservedSeats.items),
        closed: schedule.closed ? "Yes" : "No",
      };
    });
  }

  sortTableByDate(direction: string) {
    const sortedSchedulesData = this.state.cleanSchedulesData.slice().sort((a: any, b: any) => {
      const timeLeft = moment(a.date).format("YYYY-MM-DD");
      const timeRight = moment(b.date).format("YYYY-MM-DD");

      if (direction === "ascending") {
        return moment(timeLeft).diff(moment(timeRight));
      } else {
        return moment(timeRight).diff(moment(timeLeft));
      }
    });

    const preppedSchedules = this.prepSchedulesForDisplay(sortedSchedulesData);
    const schedulesToRows = arrayOfObjToRows(preppedSchedules);
    this.setState({
      cleanSchedulesData: sortedSchedulesData.slice(),
      schedulesData: schedulesToRows.slice(),
    });
  }

  sortTableByColumnAlphabetically(changedColumn: string, direction: string) {
    const sortedSchedulesData = this.state.cleanSchedulesData.sort((a: any, b: any) => {
      const stringA = _.get(a, changedColumn);
      const stringB = _.get(b, changedColumn);

      if (direction === "ascending") {
        if (stringA < stringB) {
          return -1;
        } else if (stringB < stringA) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (stringA > stringB) {
          return -1;
        } else if (stringB > stringA) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    const preppedSchedules = this.prepSchedulesForDisplay(sortedSchedulesData);
    const schedulesToRows = arrayOfObjToRows(preppedSchedules);

    this.setState({
      cleanSchedulesData: sortedSchedulesData,
      schedulesData: schedulesToRows,
    });
  }

  sortTableByColumnNumerically(changedColumn: string, direction: string) {
    const sortedSchedulesData = this.state.cleanSchedulesData.sort((a: any, b: any) => {
      const intA = parseInt(_.get(a, changedColumn));
      const intB = parseInt(_.get(b, changedColumn));

      if (direction === "ascending") {
        if (intA < intB) {
          return -1;
        } else if (intB < intA) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (intA > intB) {
          return -1;
        } else if (intB > intA) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    const preppedSchedules = this.prepSchedulesForDisplay(sortedSchedulesData);
    const schedulesToRows = arrayOfObjToRows(preppedSchedules);

    this.setState({
      cleanSchedulesData: sortedSchedulesData,
      schedulesData: schedulesToRows,
    });
  }

  onChangeRowsPerPage(numberOfRows: number) {
    this.setState({ rowsPerPage: numberOfRows });
  }

  onTableSortByColumn(changedColumn: string, direction: string) {
    switch (changedColumn) {
      case "Date":
        return this.sortTableByDate(direction);
      case "Trip":
        return this.sortTableByColumnAlphabetically("departureTicket.departsLocName", direction);
      case "# Passengers":
        return this.sortTableByColumnNumerically("tickets.items.length", direction);
      case "Closed":
        return this.sortTableByColumnAlphabetically("closed", direction);
    }

    console.log("MISSED SORT KEY");
  }

  renderCustomToolbar() {
    return (
      <div className="btn-group">
        <Button size="xs" kind="link" to="/admin/schedule/save" theme="primary">
          Create Schedule
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid py-4">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <PageHeader>Schedule </PageHeader>
        </div>

        {this.state.schedulesData.length ? (
          <MUIDataTable
            title={"Scheduled Trips"}
            data={this.state.schedulesData}
            columns={this.columnNames}
            options={{
              // onTableChange: this.onTableChange,
              customToolbar: this.renderCustomToolbar,
              onColumnSortChange: this.onTableSortByColumn,
              onChangeRowsPerPage: this.onChangeRowsPerPage,
              selectableRows: false,
              filterType: "dropdown",
              rowsPerPageOptions: [15, 50, 100],
              rowHover: false,
              responsive: "scroll",
              rowsPerPage: 100,
              pagination: true,
              page: 0,
              serverSide: false,
              count: this.state.schedulesData.length,
              search: false,
              filter: false,
              sortFilterList: false,
            }}
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default Schedule;

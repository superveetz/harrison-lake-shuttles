import * as React from "react";
import { scrollToTop } from "../../shared/util";
import { Route, Switch, NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import TicketService from "../../dac/TicketService";
import ScheduleService from "../../dac/ScheduleService";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

// import theme dependencies
import "./Admin.css";

import Dashboard from "./Dashboard/Dashboard";
import Schedule from "./Schedule/Schedule";
import ScheduleDetails from "./ScheduleDetails/ScheduleDetails";
import ScheduleSave from "./ScheduleSave/ScheduleSave";

interface AdminState {
  sideNavToggled: boolean;
  ticketProducts: any[];
}

interface AdminProps extends RouteComponentProps<any> {}

class Admin extends React.Component<AdminProps, AdminState> {
  public state: AdminState = {
    sideNavToggled: false,
    ticketProducts: [],
  };

  constructor(props: any) {
    super(props);

    // bind funcs
    this.onToggleSideNav = this.onToggleSideNav.bind(this);
  }

  componentDidMount() {
    scrollToTop();
    // load ticket products
    TicketService.fetchTicketProducts()
      .then((products: any[]) => {
        console.log("products:", products);
        this.setState({
          ticketProducts: products,
        });
      })
      .catch((err: any) => {
        console.log("err:", err);
      });
  }

  onToggleSideNav() {
    this.setState((prevState: AdminState) => {
      return {
        sideNavToggled: !prevState.sideNavToggled,
      };
    });
  }

  handleDrawerToggle() {}

  render() {
    const drawer = (
      <div>
        <Divider />
        <List>
          <NavLink to="/admin" onClick={this.onToggleSideNav}>
            <ListItem button key="Dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>

          <NavLink to="/admin/schedule" onClick={this.onToggleSideNav}>
            <ListItem button key="Schedule">
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Schedule" />
            </ListItem>
          </NavLink>
        </List>
      </div>
    );

    const routes = (
      <Switch>
        <Route exact={true} path="/admin" component={Dashboard} />
        <Route exact={true} path="/admin/schedule" render={() => <Schedule />} />
        <Route
          path="/admin/schedule/save/:scheduleId?"
          render={() => <ScheduleSave ticketProducts={this.state.ticketProducts} />}
        />
        <Route exact={true} path="/admin/schedule/details/:scheduleId" component={ScheduleDetails} />
      </Switch>
    );

    return (
      <div id="admin">
        <AppBar position="fixed" color="secondary" className="admin-navbar-toggle">
          <Toolbar>
            <IconButton color="inherit" aria-label="Open drawer" onClick={this.onToggleSideNav}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div id="wrapper">
          <nav>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden xlUp implementation="css">
              <Drawer variant="temporary" anchor="left" open={this.state.sideNavToggled} onClose={this.onToggleSideNav}>
                {drawer}
              </Drawer>
            </Hidden>
            {/* <Hidden lgUp implementation="css">
              <Drawer variant="permanent" open>
                {drawer}
              </Drawer>
            </Hidden> */}
          </nav>

          <div id="content-wrapper" className="d-flex flex-column">
            {/* admin routes */}
            <div id="content" className="container">
              {routes}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Admin as any);

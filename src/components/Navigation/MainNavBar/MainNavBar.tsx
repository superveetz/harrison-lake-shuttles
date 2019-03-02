import * as React from "react";
import { withRouter } from "react-router-dom";
import HeaderNav from "./HeaderNav/HeaderNav";
import MobileNavMenu from "./MobileNavMenu/MobileNavMenu";

class MainNavBar extends React.Component<any, any> {
  mobileNavAnimationTime = 350;

  state = {
    mobileNavMenu: {
      isHidden: true,
      opened: false,
      animating: false,
    },
    navLinks: [
      { path: "/book-now", text: "Book Now", classes: "btn btn-outline-primary text-white" },
      { path: "/", text: "Home", exact: true, classes: "btn btn-link text-white" },
      { path: "/about", text: "About", classes: "btn btn-link text-white" },
      { path: "/bus-routes", text: "Bus Routes", classes: "btn btn-link text-white" },
      { path: "/fares", text: "Fares", classes: "btn btn-link text-white" },
      { path: "/more-info", text: "More Info", classes: "btn btn-link text-white" },
      { path: "/contact", text: "Contact", classes: "btn btn-link text-white" },
    ],
  };

  componentDidMount() {}

  linkClickedHandler = (newPath: string) => {
    if (this.state.mobileNavMenu.animating || !this.state.mobileNavMenu.opened) return;

    this.props.history.push(newPath);

    this.setState({
      mobileNavMenu: {
        isHidden: false,
        opened: false,
        animating: true,
      },
    });

    setTimeout(() => {
      this.setState((prevState: any) => {
        return {
          mobileNavMenu: {
            ...prevState.mobileNavMenu,
            animating: false,
          },
        };
      });
    }, this.mobileNavAnimationTime);
  };

  mobileNavMenuToggleHandler = () => {
    if (this.state.mobileNavMenu.animating) return;
    console.log("movile toggle nav clicked");

    this.setState((prevState: any) => {
      return {
        mobileNavMenu: {
          isHidden: false,
          opened: !prevState.mobileNavMenu.opened,
          animating: true,
        },
      };
    });

    setTimeout(() => {
      this.setState((prevState: any) => {
        return {
          mobileNavMenu: {
            ...prevState.mobileNavMenu,
            animating: false,
          },
        };
      });
    }, this.mobileNavAnimationTime);
  };

  render() {
    return (
      <React.Fragment>
        <HeaderNav
          showMobileNav={this.state.mobileNavMenu.opened}
          navLinks={this.state.navLinks}
          mobileNavToggled={this.mobileNavMenuToggleHandler}
        />

        <MobileNavMenu
          navLinks={this.state.navLinks}
          show={this.state.mobileNavMenu.opened}
          animating={this.state.mobileNavMenu.animating}
          mobileNavToggled={this.mobileNavMenuToggleHandler}
          isHidden={this.state.mobileNavMenu.isHidden}
          linkClicked={this.linkClickedHandler}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(MainNavBar);

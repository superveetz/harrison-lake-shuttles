import * as React from "react";
import { NavLink } from "react-router-dom";

const classes: any = require("./HeaderNav.module.css");

import MobileNavToggle from "./MobileNavToggle/MobileNavToggle";
import Logo from "../../../UI/Logo/Logo";

interface HeaderNavState {
  animateClass: string;
  animationOccurring: boolean;
}

class HeaderNav extends React.Component<any, HeaderNavState> {
  private headerRef: React.RefObject<HTMLDivElement> = React.createRef();
  private rootElem = document.querySelector("#root");
  private lastScrollAmount = 70;
  private animationTimeout = 500;
  private animationTimeoutRef: any;

  public state: HeaderNavState = {
    animateClass: "slideInDown",
    animationOccurring: false,
  };

  componentDidMount() {
    if (this.rootElem) {
      this.rootElem.addEventListener("scroll", this.onRootScroll.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.rootElem) {
      this.rootElem.removeEventListener("scroll", this.onRootScroll.bind(this));
    }
  }

  onRootScroll() {
    const scrollAmount = this.rootElem ? this.rootElem.scrollTop : 0;

    if (scrollAmount > this.lastScrollAmount) {
      if (scrollAmount < 70) return;

      // scrolling down
      if (!this.state.animationOccurring) {
        // doesn't have an animating class
        if (this.state.animateClass !== "slideOutUp") {
          this.setState({
            animateClass: "slideOutUp",
            animationOccurring: true,
          });

          // after a little while, set the animation occurring to false
          this.animationTimeoutRef = setTimeout(() => {
            this.setState({
              animationOccurring: false,
            });
          }, this.animationTimeout);
        }
      }
    } else {
      // scrolling up
      if (!this.state.animationOccurring) {
        // doesn't have an animating class
        if (this.state.animateClass !== "slideInDown") {
          this.setState({
            animateClass: "slideInDown",
            animationOccurring: true,
          });

          // after a little while, set the animation occuring to false
          this.animationTimeoutRef = setTimeout(() => {
            this.setState({
              animationOccurring: false,
            });
          }, this.animationTimeout);
        }
      } else if (scrollAmount < 70) {
        // at top of the screen
        if (!this.state.animationOccurring) {
          if (this.state.animateClass !== "slideInDown") {
            this.setState({
              animateClass: "slideInDown",
              animationOccurring: true,
            });

            this.animationTimeoutRef = setTimeout(() => {
              this.setState({
                animationOccurring: false,
              });
            }, this.animationTimeout);
          }
        } else {
          if (this.state.animateClass !== "slideInDown") {
            if (this.animationTimeoutRef) clearTimeout(this.animationTimeoutRef);
            setTimeout(() => {
              this.setState({
                animateClass: "slideInDown",
                animationOccurring: true,
              });
            }, this.animationTimeout);

            this.animationTimeoutRef = setTimeout(() => {
              this.setState({
                animationOccurring: false,
              });
            }, this.animationTimeout);
          }
        }
      }
    }

    // set last scroll amount
    this.lastScrollAmount = scrollAmount;
  }

  render() {
    const navLinks = this.props.navLinks.map((navLink: any) => {
      return (
        <li key={navLink.path} className="nav-item ml-3">
          <NavLink
            className={["nav-link", navLink.classes].join(" ")}
            activeClassName={classes.Active}
            onClick={this.props.linkClicked}
            to={navLink.path}
            exact={navLink.exact}
          >
            <strong>{navLink.text}</strong>
          </NavLink>
        </li>
      );
    });

    return (
      <header className={[classes.HeaderNav].join(" ")} ref={this.headerRef}>
        <nav
          className={[
            "navbar navbar-expand-lg navbar-light fixed-top",
            classes.Nav,
            "animated",
            this.state.animateClass,
          ].join(" ")}
        >
          <div className="container">
            <NavLink className="navbar-brand" style={{ margin: "0" }} to="/">
              <Logo />
            </NavLink>

            <MobileNavToggle showMobileNav={this.props.showMobileNav} onToggle={this.props.mobileNavToggled} />

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">{navLinks}</ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default HeaderNav;

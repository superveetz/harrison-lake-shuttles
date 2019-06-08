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
  private willAnimateDown: boolean = true;
  private willAnimateUp: boolean = false;
  private scrollUpAnimationRef: number = 0;
  private scrollDownAnimationRef: number = 0;
  private animationOccurring: boolean = false;

  public state: HeaderNavState = {
    animateClass: "slideInDown",
    animationOccurring: false,
  };

  constructor(props: any) {
    super(props);

    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.initDelayedScrollDownAnimation = this.initDelayedScrollDownAnimation.bind(this);
    this.initScrollDownAnimation = this.initScrollDownAnimation.bind(this);
    this.initDelayedScrollUpAnimation = this.initDelayedScrollUpAnimation.bind(this);
    this.initScrollUpAnimation = this.initScrollUpAnimation.bind(this);
  }

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

  handleScrollDown(scrollAmount: number): void {
    if (this.scrollUpAnimationRef) clearTimeout(this.scrollUpAnimationRef);
    this.willAnimateDown = false;

    // if the nav is already hidden, return
    if (this.state.animateClass === "slideOutUp" || this.willAnimateUp) return;

    // if an animation is already occuring, set a timeout and apply then hide animation after
    if (this.animationOccurring) {
      this.willAnimateUp = true;
      return this.initDelayedScrollDownAnimation();
    } else {
      // no animation occuring, so free to start animation right away
      this.willAnimateUp = true;
      return this.initScrollDownAnimation();
    }
  }

  initScrollDownAnimation(): void {
    this.animationOccurring = true;
    this.setState(
      {
        animateClass: "slideOutUp",
      },
      () => {
        // flag animationOccuring false after another animationTimeout
        setTimeout(() => {
          this.willAnimateUp = false;
          this.animationOccurring = false;
        }, this.animationTimeout);
      },
    );
  }

  initDelayedScrollDownAnimation(): void {
    this.scrollDownAnimationRef = window.setTimeout(() => {
      this.initScrollDownAnimation();
    }, this.animationTimeout); // wait atleast the length of the animation before proccing
  }

  handleScrollUp(scrollAmount: number): void {
    if (this.scrollDownAnimationRef) clearTimeout(this.scrollDownAnimationRef);
    this.willAnimateUp = false;

    // if the nav is already hidden, return
    if (this.state.animateClass === "slideInDown" || this.willAnimateDown) return;

    // if an animation is already occuring, set a timeout and apply then hide animation after
    if (this.animationOccurring) {
      this.willAnimateDown = true;
      return this.initDelayedScrollUpAnimation();
    } else {
      // no animation occuring, so free to start animation right away
      this.willAnimateDown = true;
      this.initScrollUpAnimation();
    }
  }

  initDelayedScrollUpAnimation(): void {
    this.scrollUpAnimationRef = window.setTimeout(() => {
      this.initScrollUpAnimation();
    }, this.animationTimeout); // wait atleast the length of the animation before proccing
  }

  initScrollUpAnimation(): void {
    this.animationOccurring = true;
    this.setState(
      {
        animateClass: "slideInDown",
      },
      () => {
        // flag animationOccuring false after another animationTimeout
        setTimeout(() => {
          this.animationOccurring = false;
          this.willAnimateDown = false;
        }, this.animationTimeout);
      },
    );
  }

  onRootScroll() {
    const scrollAmount = this.rootElem ? this.rootElem.scrollTop : 0;

    if (scrollAmount > this.lastScrollAmount) {
      // scrolling down
      this.handleScrollDown(scrollAmount);
    } else {
      // scrolling up
      this.handleScrollUp(scrollAmount);
    }

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

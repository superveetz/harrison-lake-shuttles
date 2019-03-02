import * as React from "react";
import { withRouter } from "react-router-dom";

const classes: any = require("./MobileNavMenu.module.css");

import MobileNavToggle from "../HeaderNav/MobileNavToggle/MobileNavToggle";

class MobileNavMenu extends React.Component<any, any> {
    render() {
        const menuItemOpenCloseClass = this.props.show
            ? [classes.Open, "animated fadeInUp"]
            : [classes.Close, "animated fadeOutDown"];
        const navLinkItems = this.props.navLinks.map((navLink: any, index: number) => {
            let activeClass = "";
            if (
                (navLink.exact && navLink.path === this.props.history.location.pathname) ||
                (!navLink.exact && this.props.history.location.pathname.includes(navLink.path))
            ) {
                activeClass = classes.active;
            }
            return (
                <li key={navLink.path} className={menuItemOpenCloseClass.join(" ")}>
                    {index === 0 ? (
                        <MobileNavToggle showMobileNav={this.props.show} onToggle={this.props.mobileNavToggled} />
                    ) : null}
                    <button className={[activeClass].join(" ")} onClick={() => this.props.linkClicked(navLink.path)}>
                        <span>{navLink.text}</span>
                    </button>
                </li>
            );
        });

        let isHidden = "";
        if (this.props.isHidden || (!this.props.show && !this.props.animating)) {
            isHidden = "d-none";
        }

        return (
            <div className={[isHidden, "d-lg-none", classes.MobileNavMenu].join(" ")}>
                <ul className="list-unstyled">{navLinkItems}</ul>
            </div>
        );
    }
}

export default withRouter(MobileNavMenu);

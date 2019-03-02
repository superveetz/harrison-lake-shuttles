import * as React from "react";

const classes: any = require("./MobileNavToggle.module.css");

class MobileNavToggle extends React.Component<any, any> {
    render() {
        const activeClass = this.props.showMobileNav ? classes.open : "";
        return (
            <div
                onClick={this.props.onToggle}
                className={["d-lg-none", classes.MobileNavToggle, activeClass].join(" ")}
            >
                <span />
                <span />
                <span />
                <span />
            </div>
        );
    }
}

export default MobileNavToggle;

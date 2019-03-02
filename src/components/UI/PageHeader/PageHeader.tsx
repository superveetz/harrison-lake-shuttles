import * as React from "react";

const classes: any = require("./PageHeader.module.css");

import Aux from "../../../hoc/Auxillary/Auxillary";

interface PageHeaderProps {
    centered?: boolean;
    alignedRight?: boolean;
    invertColors?: boolean;
    classes?: string;
    elem?: string;
    children: any;
}

const pageHeader: React.SFC<PageHeaderProps> = (props) => {
    let centerClass = props.centered ? classes.Centered : "";
    let rightAligned = props.alignedRight ? classes.RightAligned : "";
    let headerClass = props.invertColors ? classes.InvertColors : classes.PageHeader;
    let headerElem = (
        <h2 className={[headerClass, rightAligned, centerClass, props.classes].join(" ")}>{props.children}</h2>
    );

    switch (props.elem) {
        case "h1":
            headerElem = (
                <h1 className={[headerClass, rightAligned, centerClass, props.classes].join(" ")}>{props.children}</h1>
            );
            break;

        case "h2":
            headerElem = (
                <h2 className={[headerClass, rightAligned, centerClass, props.classes].join(" ")}>{props.children}</h2>
            );
            break;

        case "h3":
            headerElem = (
                <h3 className={[headerClass, rightAligned, centerClass, props.classes].join(" ")}>{props.children}</h3>
            );
            break;

        case "h4":
            headerElem = (
                <h4 className={[headerClass, rightAligned, centerClass, props.classes].join(" ")}>{props.children}</h4>
            );
            break;
    }

    return <Aux>{headerElem}</Aux>;
};

export default pageHeader;

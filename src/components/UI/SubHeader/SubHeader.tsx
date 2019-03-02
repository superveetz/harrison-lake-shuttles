import * as React from "react";

const classes: any = require("./SubHeader.module.css");

interface SubHeaderProps {
    centered?: boolean;
    aligned?: "left" | "right" | "center";
    className?: string;
    elem?: string;
    children: any;
}

const subHeader: React.SFC<SubHeaderProps> = (props) => {
    // parse alignment class
    let alignmentClass = null;
    switch (props.aligned) {
        case "center":
            alignmentClass = classes.Centered;
            break;
        case "right":
            alignmentClass = classes.Right;
            break;
    }

    // parse element type
    let headerElem = null;
    switch (props.elem) {
        case "h1":
            headerElem = (
                <h1 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h1>
            );
            break;

        case "h2":
            headerElem = (
                <h2 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h2>
            );
            break;

        case "h3":
            headerElem = (
                <h3 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h3>
            );
            break;

        case "h4":
            headerElem = (
                <h4 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h4>
            );
            break;

        case "h5":
            headerElem = (
                <h5 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h5>
            );
            break;

        case "h6":
            headerElem = (
                <h6 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h6>
            );
            break;

        default:
            headerElem = (
                <h2 className={[classes.SubHeader, alignmentClass, props.className].join(" ")}>{props.children}</h2>
            );
    }

    return <React.Fragment>{headerElem}</React.Fragment>;
};

export default subHeader;

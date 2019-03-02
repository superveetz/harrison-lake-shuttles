import React from "react";

const classes: any = require("./Slide.module.css");

const slide = (props: any) => {
    let slideImage = null;
    if (props.image) {
        slideImage = <img className="img-responsive" src={props.image} alt={props.title} />;
    }

    return <figure className={classes.Slide}>{slideImage}</figure>;
};

export default slide;

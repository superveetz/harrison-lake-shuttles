import React from "react";

import logo from "../../../assets/img/logo.png";
import logoThumb from "../../../assets/img/logo-thumb.png";

const classes: any = require("./Logo.module.css");

const Logo = () => {
  return (
    <div className={classes.Logo}>
      <img className="d-none d-md-inline-block" src={logo} alt="Logo" />
      <img className="d-inline-block d-md-none" src={logoThumb} alt="Logo" />
    </div>
  );
};

export default Logo;

import * as React from "react";
import { Link } from "react-router-dom";

const classes: any = require("./Button.module.css");

interface ButtonProps {
  size?: string;
  kind?: string;
  classes?: string;
  disabled?: boolean;
  xl?: boolean;
  theme?: string;
  to?: string;
  btnType?: string;
  click?: React.MouseEventHandler;
  children: any;
  style?: React.CSSProperties;
}

const button = (props: ButtonProps) => {
  let button = null;
  let btnSize = props.size ? props.size : "btn-lg";
  let btnKind = props.kind ? props.kind : "button";
  let xtraClasses = props.classes ? props.classes : "";
  let btnClasses = ["btn", btnSize, xtraClasses];
  if (props.xl) btnClasses.push(classes.XL);
  let btnTheme = props.theme ? props.theme : "primary";
  let btnType = props.btnType ? props.btnType : "button";
  let btnDisabled = !props.disabled ? false : true;

  // determine classes
  switch (btnTheme) {
    case "primary":
      btnClasses.push(classes.Primary);
      break;

    case "secondary":
      btnClasses.push(classes.Secondary);
      break;

    case "danger":
      btnClasses.push(classes.Danger);
      break;
  }

  // create button elem
  switch (btnKind) {
    case "button":
      button = (
        <button className={btnClasses.join(" ")} type={btnType} onClick={props.click} disabled={btnDisabled} style={{
          ...props.style
        }}>
          {props.children}
        </button>
      );
      break;

    case "link": {
      button = (
        <Link className={btnClasses.join(" ")} to={props.to as string} style={{
          ...props.style
        }}>
          {props.children}
        </Link>
      );
    }
  }

  return <React.Fragment>{button}</React.Fragment>;
};

export default button;

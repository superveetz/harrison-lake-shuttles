import React from "react";

// css
const classes: any = require("./Spinner.module.css");

export enum SpinnerSizes {
  Xs = "xs",
  Sm = "sm",
  Md = "md",
  Lg = "lg",
  Xl = "xl",
}

export enum SpinnerType {
  Primary = "primary",
  Secondary = "secondary",
}

interface SpinnerProps {
  size?: keyof SpinnerSizes;
  type?: keyof SpinnerType;
}

const spinner: React.FunctionComponent<SpinnerProps> = (props: SpinnerProps) => {
  // spinner size
  let spinnerClass = null;
  switch (props.size) {
    case SpinnerSizes.Xl:
      spinnerClass = classes.Xl;
      break;

    case SpinnerSizes.Lg:
      spinnerClass = classes.Lg;
      break;

    case SpinnerSizes.Md:
      spinnerClass = classes.Md;
      break;

    case SpinnerSizes.Sm:
      spinnerClass = classes.Sm;
      break;

    case SpinnerSizes.Xs:
      spinnerClass = classes.Xs;
      break;

    default:
      spinnerClass = classes.Lg;
  }
  // spinner types
  const spinnerTypePrimary = <div className={[classes.Primary, spinnerClass].join(" ")}>Loading...</div>;
  const spinnerTypeSecondary = (
    <div className={[classes.Secondary, spinnerClass].join(" ")}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );

  // create spinner
  let spinner = null;
  switch (props.type) {
    case SpinnerType.Primary:
      spinner = spinnerTypePrimary;
      break;

    case SpinnerType.Secondary:
      spinner = spinnerTypeSecondary;
      break;

    default:
      spinner = spinnerTypePrimary;
  }

  return <React.Fragment>{spinner}</React.Fragment>;
};

export default spinner;

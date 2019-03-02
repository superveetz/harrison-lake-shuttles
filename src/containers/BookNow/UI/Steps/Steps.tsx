import * as React from "react";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

const classes: any = require("./Steps.module.css");
import { DepartureFormValues } from "../../DepartureForm";
import { ReturnFormValues } from "../../ReturnForm";
import { CheckoutFormValues } from "../../CheckoutForm";
import { BookNowSteps, IBookNowState, CachedState, BookNowMethods } from "../../BookNow";

interface StepsProps {
  activeStep: BookNowSteps;
  clicked: BookNowMethods["updateParentState"];
  formPayload?: DepartureFormValues | ReturnFormValues;
  cachedState?: CachedState;
  cachedStateKey?: keyof CachedState;
}

const steps: React.SFC<StepsProps> = (props: StepsProps) => {
  function getSteps(): string[] {
    return ["Departure", "Return", "Checkout"];
  }

  const steps = getSteps();

  return (
    <div>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map((label, index: BookNowSteps) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step
              className={classes.Step}
              key={label}
              {...stepProps}
              onClick={() => {
                if (props.cachedStateKey && props.clicked && props.cachedState && props.formPayload) {
                  props.clicked({
                    activeStep: index,
                    cachedState: {
                      ...props.cachedState,
                      lastActiveStep: index,
                      [props.cachedStateKey]: {
                        ...props.formPayload,
                      },
                    },
                  });
                } else {
                  props.clicked({
                    activeStep: index,
                  });
                }
              }}
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

export default steps;

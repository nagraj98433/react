import React, { Fragment } from "react";
import { themeColor } from "../../utilis/constants";
import { useLocation } from "react-router-dom";

function CustomStepper({ data }) {
  const location = useLocation();

  const activeStepperItem = {
    backgroundColor: themeColor.primary,
    color: "#fff",
    fontWeight: "500",
  };

  const notActiveStepperItem = {
    backgroundColor: themeColor.accent,
    color: themeColor.primary,
  };

  return (
    <div className="d-flex justify-content-around align-items-center gap-2 mx-3 mt-3">
      {data &&
        data.map((item, i) => {
          return (
            <Fragment key={item.id}>
              <div
                style={
                  item.active === location.pathname
                    ? activeStepperItem
                    : notActiveStepperItem
                }
                className="stepperItem rounded-pill px-2"
              >
                {item.name}
              </div>
              {data.length - i !== 1 && (
                <div className="position-relative d-none d-lg-block d-md-block">
                  <div className="getCentered stepper"></div>
                </div>
              )}
            </Fragment>
          );
        })}
    </div>
  );
}

export default CustomStepper;

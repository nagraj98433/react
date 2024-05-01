import React from "react";
import { Outlet } from "react-router-dom";
import LandingPageNavbar from "../components/navbar/LandingPageNavbar";

function Registeration() {
  return (
    <>
      <LandingPageNavbar />
      <div className="row g-0 justify-content-center mt-3">
        <div className="col-10 col-lg-4 col-md-6">
          <div className="registrationContainer border shadow-sm rounded">
            {/* <CustomStepper data={RegistrationStepperData} /> */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Registeration;

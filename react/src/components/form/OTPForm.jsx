import React, { useState } from "react";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { usePageLanguage } from "../../utilis/usePageLanguage";

function OTPForm() {
  const userCredential = useSelector((state) => state.userCredentialData.data);

  const pageStaticContent = usePageLanguage("verify");
  const navigate = useNavigate();
  const globalApiHandler = useGlobalApiHandler();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const handleVerification = async () => {
    const data = new FormData();

    data.append("email", userCredential?.email);
    data.append("code", otp);
    data.append("owner_id", userCredential?.owner_id);

    const otpData = {
      method: "put",
      url: BASE_URL + "api/authentication/",
      data: data,
    };

    const response = await globalApiHandler(otpData);

    if (response.success) {
      navigate("/registration/login?success=true");
    } else {
      setIsInvalid(true);
    }
  };

  return (
    <>
      <Toaster />
      <div className="row g-o px-4 my-3 animeRightToLeft">
        <div className="col-12 mb-2">
          <div className="registerHeading primary-text">
            <div>{pageStaticContent?.["00066"]}</div>
            <div
              style={{ fontWeight: "500", fontSize: "15px" }}
              className="secondary-text"
            >
              {pageStaticContent?.["00067"]}
            </div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00068"]}
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              type="number"
              required
              isInvalid={isInvalid}
              name="otp"
              value={otp}
              onWheel={(e) => e.target.blur()}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
            <Form.Control.Feedback type="invalid" className="formLabelText">
              {pageStaticContent?.["00069"]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12 mt-3">
          <CustomButton
            name={pageStaticContent?.["00070"]}
            bgColor={themeColor.primary}
            preIcon={<FaCircleCheck />}
            handleClick={handleVerification}
          />
        </div>
      </div>
    </>
  );
}

export default OTPForm;

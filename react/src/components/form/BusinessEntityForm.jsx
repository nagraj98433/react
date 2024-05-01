import React, { useState } from "react";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { GoCheckCircleFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import { userInfo } from "../../store/userSlice";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import toast, { Toaster } from "react-hot-toast";
import { usePageLanguage } from "../../utilis/usePageLanguage";

function BusinessEntityForm() {
  const userDetails = useSelector((state) => state.userData.data);

  const pageStaticContent = usePageLanguage("newbusiness");
  const navigate = useNavigate();
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInValid, setIsInValid] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!name.length) {
      setIsLoading(false);
      return setIsInValid(true);
    }
    const data = {
      owner_id: userDetails?.owner_id,
      name: name,
    };

    const businessData = {
      method: "post",
      url: BASE_URL + "api/business/registrations/",
      data: data,
    };

    const response = await globalApiHandler(businessData);

    if (response?.success) {
      let newObj = {
        access_token: userDetails?.access_token,
        expiration_time: userDetails?.expiration_time,
        owner_id: userDetails?.owner_id,
        refresh_token: userDetails?.refresh_token,
        profile: true,
        business_name: name,
      };

      dispatch(userInfo(newObj));
      setIsLoading(false);
      navigate("/main/dashboard");
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="row g-0 px-4 my-3 animeRightToLeft">
        <div className="col-12 mb-2">
          <div className="registerHeading primary-text">
            <div>{pageStaticContent?.["00071"]}</div>
            <div
              style={{ fontWeight: "500", fontSize: "15px" }}
              className="secondary-text"
            >
              {pageStaticContent?.["00072"]}
            </div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00073"]}
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              placeholder={pageStaticContent?.["00074"]}
              required
              isInvalid={isInValid}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />{" "}
            <Form.Control.Feedback type="invalid" className="formLabelText">
              {pageStaticContent?.["00075"]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12">
          <CustomButton
            name={pageStaticContent?.["00076"]}
            bgColor={themeColor.primary}
            preIcon={isLoading ? <Spinner /> : <GoCheckCircleFill />}
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default BusinessEntityForm;

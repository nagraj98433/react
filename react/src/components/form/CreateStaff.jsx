import React, { useEffect, useState } from "react";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form, InputGroup } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useStaffList } from "../../global_apis/useStaffList";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import { useMenuCatalogList } from "../../global_apis/useMenuCatalogList";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { handleUrl } from "../../store/staffSlice";
import { useParams } from "react-router-dom";

function CreateStaff() {
  const currencyCode = useSelector(
    (state) => state.activeItemData?.selectedRestaurant
  );

  const userDetails = useSelector((state) => state.userData.data);

  const dispatch = useDispatch();
  const globalApiHandler = useGlobalApiHandler();
  const getStaffList = useStaffList();
  const getMenuList = useMenuCatalogList();
  const params = useParams();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [form, setForm] = useState({
    name: "",
    password: "",
    username: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    password: false,
    username: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      username: !form.username.length,
      password: form.password.length < 4 || form.password.length > 18,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleStaffCreation = async () => {
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(form.password).toString(
      CryptoJS.enc.Hex
    );

    const data = {
      name: form.name,
      username: form.username?.toLocaleLowerCase(),
      password: form.password,
      hash_password: encryptedPassword,
      outlet_id: params?.outletId,
      owner_id: userDetails?.owner_id,
    };

    const apiData = {
      method: "post",
      url: BASE_URL + "api/employee/creation/",
      data: data,
    };

    const response = await globalApiHandler(apiData);
    if (response?.success) {
      const amazonUrlResult = getAmazonUrl("users");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("users");
        await getStaffList(requiredUrl?.get_url);
        toast.success(response?.message);
        dispatch(handleUrl(requiredUrl?.put_url));
      } else {
        await getStaffList();
        toast.success(response?.message);
      }
    } else if (
      !response?.success &&
      response?.message === "Username Already Exists."
    ) {
      toast.error(response?.message);
    } else {
      toast.error(response?.message);
    }
    setForm((prev) => ({
      ...prev,
      name: "",
      password: "",
      username: "",
    }));
    setIsLoading(false);
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    frontendValidation && handleStaffCreation();
  };

  return (
    <div className="row">
      <div className="col-12">
        <CustomTitle heading={"Create User"} />
        <div className="row">
          {/* {outletId && (
            <div className="col-12">
              <div className="primary-text fw-medium formLabelText mb-2">
                Restaurant Id :{" "}
                <span style={{ color: themeColor.primary }} className="fw-bold">
                  {params?.outletId}
                </span>
              </div>
            </div>
          )}{" "}
           */}
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter name"
                required
                isInvalid={isInvalid.name}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-1">
              <Form.Label className="primary-text fw-medium formLabelText">
                Username
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="customInputBoxText">
                  {currencyCode && currencyCode}.
                </InputGroup.Text>
                <Form.Control
                  className="customInputBoxText"
                  type="text"
                  placeholder="Enter username"
                  isInvalid={isInvalid.username}
                  name="username"
                  value={form.username?.toLocaleLowerCase()}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {form.username.length ? (
              <div className="customInputBoxText animeTopToBottom fw-medium d-flex align-items-center gap-1 mb-2">
                <div>username : </div>
                <div
                  style={{ color: themeColor.primary, fontSize: "15px" }}
                >{`${currencyCode && currencyCode}.${form.username}`}</div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Password
              </Form.Label>
              <InputGroup>
                <Form.Control
                  className="customInputBoxText"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  isInvalid={isInvalid.password}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEyeSlash style={{ color: themeColor.primary }} />
                  ) : (
                    <FaEye style={{ color: themeColor.primary }} />
                  )}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid" className="formLabelText">
                  Please enter password between 4 to 18 characters.
                </Form.Control.Feedback>
              </InputGroup>{" "}
            </Form.Group>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12 col-lg-2 col-md-4">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading ? <Spinner /> : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStaff;

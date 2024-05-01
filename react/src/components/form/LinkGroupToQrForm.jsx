import React, { useEffect, useState } from "react";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form, InputGroup } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useStaffListApi } from "../../global_apis/useStaffListApi";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";

import { useActiveItem } from "../../utilis/useActiveItem";
import { handleStaffList } from "../../store/staffSlice";
import { useParams } from "react-router-dom";

function LinkGroupToQrForm() {
  const dispatch = useDispatch();

  const activeRestaurant = useActiveItem();
  const restoName = activeRestaurant("restaurantName");

  const rolesList = useSelector((state) => state.rolesData.data);
  const userDetails = useSelector((state) => state.userData.data);

  const globalApiHandler = useGlobalApiHandler();
  const getStaffList = useStaffListApi();
  const params = useParams();

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    password: "",
    username: "",
    permission: [],
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    password: false,
    username: false,
    permission: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuArry = [
    { value: "John", label: "John" },
    { value: "Aidan", label: "Aidan" },
    { value: "Brayden", label: "Brayden" },
  ];
  const qrArry = [
    { value: "Table 1", label: "Table 1" },
    { value: "Table 2", label: "Table 2" },
    { value: "Table 3", label: "Table 3" },
  ];
  const orderFlowArry = [
    { value: "Offline", label: "Offline" },
    { value: "Online", label: "Online" },
  ];
  const lvlArry = [
    { value: "waiter", label: "waiter" },
    { value: "kitchen", label: "kitchen" },
    { value: "cashier", label: "cashier" },
  ];
  const grpArry = [
    { value: "Group 1", label: "Group 1" },
    { value: "Group 2", label: "Group 2" },
    { value: "Group 3", label: "Group 3" },
  ];
  const lvlAccessArry = [
    { value: "Read ", label: "Read" },
    { value: "Update", label: "Update" },
    { value: "Delete", label: "Delete" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExisitingRoles = () => {
    let rolesArray = [];
    for (let i = 0; i < rolesList.length; i++) {
      let newObj = {
        label: rolesList[i]?.name,
        value: rolesList[i]?.uuid,
        level: rolesList[i]?.permissions_level,
      };
      rolesArray.push(newObj);
    }
    setRoles(rolesArray);
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

    let rolesIdsArray = [];
    for (let i = 0; i < form.permission.length; i++) {
      rolesIdsArray.push(form.permission[i]?.value);
    }

    const data = {
      name: form.name,
      username: form.username,
      password: form.password,
      hash_password: encryptedPassword,
      permissions: rolesIdsArray,
      outlet_id: params?.outletId,
      business_entity: userDetails?.owner_id,
      outlet: restoName,

      level: form.permission.some((obj) => obj.level === "Grade 1")
        ? "Grade 1"
        : "Grade 2",
    };

    const apiData = {
      method: "post",
      url: BASE_URL + "api/employee/creation/",
      data: data,
    };

    const response = await globalApiHandler(apiData);
    setIsLoading(false);
    if (response?.success) {
      getStaffList();
      setForm((prev) => ({
        ...prev,
        name: "",
        password: "",
        username: "",
        permission: [],
      }));
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    // frontendValidation && handleStaffCreation();

    //dispatch(handleStaffList({ name: form.name, username: form.username }));
    toast.success("Data saved successfully");
    setForm((prev) => ({
      ...prev,
      name: "",
      username: "",
      password: "",
      permission: [],
    }));
  };

  return (
    <div className="row">
      <div className="col-12">
        <CustomTitle heading={"Linking Group to QR"} />
        <div className="row">
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Group
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select menus"
                options={grpArry}
                defaultValue={[grpArry[0]]}
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Order Flow
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select order flow"
                options={orderFlowArry}
                defaultValue={orderFlowArry[0]}
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select QR
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select QR"
                options={qrArry}
                isMulti
                defaultValue={qrArry[0]}
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Node
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select node"
                options={lvlArry}
                defaultValue={lvlArry[0]}
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Rights
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select rights"
                options={lvlAccessArry}
                isMulti
                defaultValue={[
                  lvlAccessArry[0],
                  lvlAccessArry[1],
                  lvlAccessArry[2],
                ]}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12 col-lg-3 col-md-4">
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

export default LinkGroupToQrForm;

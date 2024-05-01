import React, { useEffect, useState } from "react";
import { BASE_URL, grade2Access, themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useDispatch } from "react-redux";
import { getAccessRoles } from "../../store/userAccessSlice";
import { useSelector } from "react-redux";
import { useRoleListApi } from "../../global_apis/useRoleListApi";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useParams } from "react-router-dom";

function CreateRoles() {
  let userAccessList = useSelector((state) => state.accessData.data);

  const logindetail = useSelector((state) => state.userData.data);

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const getRolesList = useRoleListApi();
  const params = useParams();

  const [form, setForm] = useState({
    name: "",
    access: [],
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    access: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getAccess = async () => {
    const accessApiData = {
      method: "get",
      url: BASE_URL + `api/permission/get-permission/`,
    };

    const response = await globalApiHandler(accessApiData);

    if (response?.success) {
      let accessArray = [];
      let grade1Array = [];
      let grade2Array = [];
      for (let i = 0; i < response?.data.length; i++) {
        let newObj = {
          label: response?.data[i]?.name,
          value: response?.data[i]?.id,
        };
        if (grade2Access.includes(response?.data[i]?.name)) {
          newObj.level = "Grade 2";
          grade2Array.push(newObj);
        } else {
          newObj.level = "Grade 1";
          grade1Array.push(newObj);
        }
      }
      accessArray = [
        {
          label: "Grade 1",
          options: grade1Array,
        },
        {
          label: "Grade 2",
          options: grade2Array,
        },
      ];
      dispatch(getAccessRoles(accessArray));
    }
  };

  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      access: !form.access.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleRolesCreation = async () => {
    setIsLoading(true);

    const data = {
      name: form.name,
      permissions: form.access,
      permissions_level: form.access.some((obj) => obj.level === "Grade 1")
        ? "Grade 1"
        : "Grade 2",
      outlet: params?.outletId,
    };

    const apiData = {
      method: "post",
      url: BASE_URL + "api/permission/group-permission/",
      data: data,
    };

    const response = await globalApiHandler(apiData);

    if (response?.success) {
      setForm((prev) => ({ ...prev, name: "", access: [] }));
      toast.success(response?.message);
      setIsLoading(false);
      getRolesList();
    } else {
      toast.error(response?.message);
    }
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    frontendValidation && handleRolesCreation();
  };

  // useEffect(() => {
  //   getAccess();
  // }, []);

  return (
    <div className="row">
      <Toaster />
      <div className="col-12">
        <CustomTitle heading={"Create Roles For Staff"} />
        <div className="row">
          <div className="col-12">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Role Name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder={"Enter role name"}
                required
                isInvalid={isInvalid.name}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name of role.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Manage Access
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select access"
                options={
                  logindetail?.outlet_details?.user_level === "staff"
                    ? userAccessList[1]?.options || []
                    : userAccessList
                }
                isMulti
                value={form.access}
                onChange={(selectedData) =>
                  setForm((prev) => ({ ...prev, access: selectedData }))
                }
              />
              {isInvalid.access && (
                <div
                  style={{ fontSize: "14px", marginTop: "5px" }}
                  className="text-danger"
                >
                  Please select access.
                </div>
              )}
            </Form.Group>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12 col-lg-3 col-md-4">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading && <Spinner />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoles;

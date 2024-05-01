import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useRoleListApi } from "../../global_apis/useRoleListApi";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useParams } from "react-router-dom";

function UpdateRoles({ show, handleToggle, data }) {
  const userAccessList = useSelector((state) => state.accessData.data);

  const globalApiHandler = useGlobalApiHandler();
  const getRolesList = useRoleListApi();
  const params = useParams();

  const [form, setForm] = useState({
    name: "",
    permissions: [],
  });

  const [isInvalid, setIsInvalid] = useState({
    name: false,
    permissions: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);

    const payload = {
      name: form.name,
      permissions: form.permissions,
      outlet: params?.outletId,
      permissions_level: form.permissions.some((obj) => obj.level === "Grade 1")
        ? "Grade 1"
        : "Grade 2",
    };

    const apiData = {
      method: "put",
      url: BASE_URL + `api/permission/update/group/${data?.uuid}/`,
      data: payload,
    };

    const response = await globalApiHandler(apiData);
    setIsLoading(false);
    if (response?.success) {
      getRolesList();
      handleToggle();
    } else {
      handleToggle();
      toast.error(response?.message);
    }
  };

  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      permissions: !form.permissions.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    frontendValidation && handleUpdate();
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: data?.name ? data?.name : "",
      permissions: data?.permissions ? data?.permissions : [],
    }));
    return () =>
      setForm((prev) => ({
        ...prev,
        name: "",
        permissions: [],
      }));
  }, [data]);

  return (
    <Modal show={show} onHide={handleToggle}>
      <>
        <div className="mx-0 mx-lg-3 mx-md-3 p-3">
          <div className="row align-items-center mb-3">
            <div className="col-9 fw-medium">Update Role</div>
            {/* <div className="col-3 ms-auto">
              <CustomButton
                name={"Save"}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
                preIcon={isLoading && <Spinner />}
              />
            </div> */}
          </div>
          <div className="row">
            <div className="col-12 mb-2">
              <Form.Group className="mb-1">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Role Name
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  isInvalid={isInvalid.name}
                  type="text"
                  placeholder="Enter role name"
                  name="name"
                  readOnly
                />
                <Form.Control.Feedback type="invalid">
                  Please enter role name.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group className="mb-1">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Select rolewise access
                </Form.Label>
                <Select
                  className="customInputBoxText"
                  placeholder="Select rolwise access"
                  options={form.permissions}
                  isMulti
                  value={form.permissions}
                  onChange={(selectedData) => {
                    setForm((prev) => ({ ...prev, permissions: selectedData }));
                  }}
                />
                {isInvalid.permissions && (
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
        </div>
      </>
    </Modal>
  );
}

export default UpdateRoles;

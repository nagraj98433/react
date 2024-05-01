import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useDispatch } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useGroupList } from "../../global_apis/useGroupList";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import toast from "react-hot-toast";
import { handleGroupUrl } from "../../store/groupSlice";
import axios from "axios";
import Spinner from "../loaders/Spinner";

function GroupListModal({ show, handleToggle, data, staffList, groupList }) {
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const getGroupList = useGroupList();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const [form, setForm] = useState({
    grpName: "",
    grpStaffs: [],
  });
  const [isInvalid, setIsInvalid] = useState({
    grpName: false,
    grpStaffs: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleValidation = () => {
    const validations = {
      grpName: !form.grpName.length,
      grpStaffs: !form.grpStaffs.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const staffArry = staffList?.Users?.map((staff) => ({
    value: staff.user_id,
    label: staff.name,
  }));

  const handleGroupUpdate = async () => {
    setIsLoading(true);

    const grpStaffId = form.grpStaffs?.map((staff) => staff?.value);
    const updateGroupData = groupList?.usergroup.map((group) => {
      if (group.id === data?.id) {
        return {
          ...group,
          groupName: form.grpName,
          groupStaffs: grpStaffId,
        };
      }
      return group;
    });
    if (updateGroupData) {
      const amazonUrlResult = getAmazonUrl("usergroup");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("usergroup");
        dispatch(handleGroupUrl(requiredUrl));

        const createGroupUrl = await axios.put(requiredUrl?.put_url, {
          usergroup: updateGroupData,
        });
        if (createGroupUrl?.status === 200) {
          await getGroupList(requiredUrl?.get_url);
          toast.success("Group Updated successfully!");
          setForm((prev) => ({
            ...prev,
            grpName: "",
            grpStaffs: [],
          }));
        } else {
          toast.error("Group Updation failed!");
        }
      } else {
        const amazonUrlResult = getAmazonUrl("usergroup")?.url;
        const createGroupUrl = await axios.put(amazonUrlResult?.put_url, {
          usergroup: updateGroupData,
        });
        if (createGroupUrl?.status === 200) {
          await getGroupList(amazonUrlResult?.get_url);
          toast.success("Group Updated successfully!");
          setForm((prev) => ({
            ...prev,
            grpName: "",
            grpStaffs: [],
          }));
        } else {
          toast.error("Group Updation failed!");
        }
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    let frontendValidation = await handleValidation();
    if (frontendValidation) {
      await handleGroupUpdate();
      handleToggle();
    }
  };
  useEffect(() => {
    if (data) {
      const mappedStaffs = data.groupStaffs.map((staffId) => {
        const staff = staffList?.Users?.find(
          (data) => staffId === data?.user_id
        );
        return {
          value: staff?.user_id,
          label: staff?.name,
        };
      });
      setForm((prev) => ({
        ...prev,
        grpName: data.groupName,
        grpStaffs: mappedStaffs,
      }));
      console.log(form);
    }
  }, [data]);
  return (
    <Modal show={show} onHide={handleToggle} keyboard={false}>
      <Modal.Body>
        <div className="row justify-content-start">
          <div className="col-12 d-flex align-items-start">
            <CustomTitle heading={"Update Group List"} />
            <div className="ms-auto">
              <CustomButton
                name={"Update"}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
                preIcon={isLoading ? <Spinner /> : ""}
              />
            </div>
          </div>
          <div className="col-12 col-lg-10 col-md-10 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Group Name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter group name"
                required
                isInvalid={isInvalid.grpName}
                name="grpName"
                value={form.grpName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12col-lg-10 col-md-10 ">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Staffs
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select staff"
                options={staffArry}
                name="grpStaffs"
                isMulti
                isInvalid={isInvalid.grpStaffs}
                value={form.grpStaffs}
                onChange={(selectedOption) =>
                  setForm((prev) => ({ ...prev, grpStaffs: selectedOption }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Please select staff.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default GroupListModal;

import React, { useEffect, useState } from "react";
import { themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form, InputGroup } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import toast from "react-hot-toast";
import { useStaffListApi } from "../../global_apis/useStaffListApi";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";

import { useActiveItem } from "../../utilis/useActiveItem";
import { useParams } from "react-router-dom";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useGroupList } from "../../global_apis/useGroupList";
import axios from "axios";
import { handleGroupUrl } from "../../store/groupSlice";

function CreateGroups({ groupList, staffList, UpdateGroupPresignedUrl }) {
  const dispatch = useDispatch();
  const [id, setId] = useIdGenerator();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getGroupList = useGroupList();
  const params = useParams();

  const [grpStaffs, setGrpStaffs] = useState(groupList);
  const [form, setForm] = useState({
    grpName: "",
    grpStaffs: [],
  });
  const [isInvalid, setIsInvalid] = useState({
    grpName: false,
    grpStaffs: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const menuArry = staffList?.Users?.map((staff) => ({
    value: staff.user_id,
    label: staff.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = async () => {
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

  const handleGroupCreation = async () => {
    setIsLoading(true);
    setId();
    const grpStaffId =
      form.grpStaffs?.map((staff) => {
        return staff?.value;
      }) || [];
    const data = {
      id: id,
      groupName: form.grpName,
      groupStaffs: grpStaffId,
      partitionKey: params?.outletId,
      sortKey: `staffgroup#${id}`,
    };
    let updatedGroupList = { ...groupList };
    updatedGroupList = {
      ...updatedGroupList,
      usergroup: [...updatedGroupList?.usergroup, data],
    };
    setGrpStaffs(updatedGroupList);
    if (updatedGroupList) {
      const amazonUrlResult = getAmazonUrl("usergroup");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("usergroup");
        dispatch(handleGroupUrl(requiredUrl));

        const createGroupUrl = await axios.put(
          requiredUrl?.put_url,
          updatedGroupList
        );
        if (createGroupUrl?.status === 200) {
          await getGroupList(requiredUrl?.get_url);
          toast.success("Group Created successfully!");
        } else {
          toast.error("Group Creation failed!");
        }
      } else {
        const amazonUrlResult = getAmazonUrl("usergroup")?.url;
        const createGroupUrl = await axios.put(
          amazonUrlResult?.put_url,
          updatedGroupList
        );
        if (createGroupUrl?.status === 200) {
          await getGroupList(amazonUrlResult?.get_url);
          toast.success("Group Created successfully!");
        } else {
          toast.error("Group Creation failed!");
        }
      }
      setForm({
        grpName: "",
        grpStaffs: [],
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    let frontendValidation = await handleValidation(); // Wait for validation to complete
    if (frontendValidation) {
      handleGroupCreation(); // Proceed with group creation
    }
  };
  useEffect(() => {
    console.log(groupList);
  }, []);
  return (
    <div className="row">
      <div className="col-12">
        <CustomTitle heading={"Create Groups"} />
        <div className="row">
          <div className="col-12">
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
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Users
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select user"
                options={menuArry}
                name="grpStaffs"
                isMulti
                value={form.grpStaffs}
                isInvalid={isInvalid.grpStaffs}
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

export default CreateGroups;

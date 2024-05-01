import React, { Fragment, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import ProfileCircle from "../profileCircle/ProfileCircle";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useOrderFlowList } from "../../utilis/useOrderFlowList";
import axios from "axios";
import Spinner from "../loaders/Spinner";

function OrderFlowListModal({ show, handleToggle, flow, modalDataIndex }) {
  const staffGroupDetails = useSelector((state) => state.groupData.data);
  const orderFlowDetails = useSelector((state) => state.orderFlowData?.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOrderFlowList = useOrderFlowList();

  const [finalData, setFinalData] = useState({});
  const [staffgroupList, setStaffGroupList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const rolesArray = [
    { value: 0, label: "Waiter" },
    { value: 1, label: "Kitchen" },
    { value: 2, label: "Cashier" },
  ];

  const lvlAccessArry = [
    { value: "Read ", label: "Read" },
    { value: "Update", label: "Update" },
    { value: "Delete", label: "Delete" },
    { value: "Accept", label: "Accept" },
  ];

  const handleStaffGroupList = () => {
    if (!staffGroupDetails) {
      return;
    }
    let tempArray = [];
    for (let i = 0; i < staffGroupDetails?.staffgroup.length; i++) {
      let newObj = {
        label: staffGroupDetails?.staffgroup[i]?.groupName,
        value: staffGroupDetails?.staffgroup[i],
      };
      tempArray.push(newObj);
    }
    setStaffGroupList(tempArray);
  };

  const getSelectedRights = (selectedArray) => {
    if (!selectedArray?.length) {
      return [];
    }
    let tempArray = [];
    for (let i = 0; i < selectedArray.length; i++) {
      let filteredObject = lvlAccessArry.find(
        (right) => right?.value === selectedArray[i]
      );
      tempArray.push(filteredObject);
    }
    return tempArray;
  };

  const handleOrderFlowNameChange = (val) => {
    let copiedData = JSON.parse(JSON.stringify(finalData));
    copiedData.order_flow_name = val;

    setFinalData(copiedData);
  };

  const handleRoleChange = (e, index) => {
    let copiedData = JSON.parse(JSON.stringify(finalData));
    copiedData.nodes[index].node_role = e.value;

    setFinalData(copiedData);
  };

  const handleNodeNameChange = (val, index) => {
    let copiedData = JSON.parse(JSON.stringify(finalData));
    copiedData.nodes[index].node_name = val;

    setFinalData(copiedData);
  };

  const handleGroupChange = (e, nodeIndex, groupIndex) => {
    let copiedData = JSON.parse(JSON.stringify(finalData));
    copiedData.nodes[nodeIndex].node_group[groupIndex].node_group = {
      id: e.value?.id,
      staffs: e?.value?.groupStaffs,
    };

    setFinalData(copiedData);
  };

  const handleRightsChange = (e, nodeIndex, groupIndex) => {
    if (!e.length) {
      return false;
    }

    let copiedData = JSON.parse(JSON.stringify(finalData));

    let tempArray = [];

    for (let i = 0; i < e.length; i++) {
      tempArray.push(e[i].value);
    }

    copiedData.nodes[nodeIndex].node_group[groupIndex].node_rights = tempArray;

    setFinalData(copiedData);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let orderFlowUrl = null;
    orderFlowUrl = getAmazonUrl("orderflow");
    const isNotExpired = amazonUrlExpiryChecker(orderFlowUrl?.expiry);

    if (!isNotExpired) {
      orderFlowUrl = await fetchAmazonBucketUrls("orderflow");
    }
    let copiedData = JSON.parse(JSON.stringify(orderFlowDetails));

    copiedData[modalDataIndex] = finalData;

    const response = await axios.put(orderFlowUrl?.url?.put_url, copiedData);

    if (response?.status === 200) {
      await getOrderFlowList();
      handleToggle();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (flow) {
      setFinalData(flow);
      handleStaffGroupList();
    }

    return () => {
      setFinalData({});
    };
  }, [flow]);
  return (
    <Modal size="lg" show={show} onHide={handleToggle} keyboard={false}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className="primary-text fw-medium formLabelText">
            Order flow name
          </Form.Label>
          <Form.Control
            className="customInputBoxText"
            type="text"
            placeholder={"Enter order flow name"}
            value={finalData?.order_flow_name ? finalData?.order_flow_name : ""}
            onChange={(e) => handleOrderFlowNameChange(e.target.value)}
          />
        </Form.Group>
        {finalData &&
          finalData?.nodes?.map((node, index) => (
            <div
              key={node?.node_id}
              className="d-flex align-items-start justify-content-center gap-3 mb-3"
            >
              <div>
                <ProfileCircle size={25} name={index + 1} />
              </div>
              <div className="border rounded p-2 nodeSequence">
                <div className="row">
                  <div className="col-6">
                    <Form.Group className="mb-2">
                      <Form.Label className="primary-text fw-medium formLabelText">
                        Node name
                      </Form.Label>
                      <Form.Control
                        className="customInputBoxText"
                        type="text"
                        placeholder={"Enter order flow name"}
                        value={node?.node_name}
                        onChange={(e) =>
                          handleNodeNameChange(e.target.value, index)
                        }
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group className="mb-2">
                      <Form.Label className="primary-text fw-medium formLabelText">
                        Select role
                      </Form.Label>
                      <Select
                        className="customInputBoxText"
                        options={rolesArray}
                        value={rolesArray.find(
                          (role) => role.value === node?.node_role
                        )}
                        onChange={(e) => handleRoleChange(e, index)}
                      />
                    </Form.Group>
                  </div>
                  {finalData &&
                    node?.node_group?.map((grp, grpIndex) => (
                      <Fragment key={grpIndex}>
                        <div className="col-6">
                          <Form.Group className="mb-2">
                            <Form.Label className="primary-text fw-medium formLabelText">
                              Select group
                            </Form.Label>
                            <Select
                              className="customInputBoxText"
                              value={staffgroupList.find(
                                (staff) =>
                                  staff?.value?.id === grp?.node_group?.id
                              )}
                              options={staffgroupList}
                              onChange={(e) =>
                                handleGroupChange(e, index, grpIndex)
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className="col-6">
                          <Form.Group className="mb-2">
                            <Form.Label className="primary-text fw-medium formLabelText">
                              Select rights
                            </Form.Label>
                            <Select
                              className="customInputBoxText"
                              isMulti
                              options={lvlAccessArry}
                              value={getSelectedRights(grp?.node_rights)}
                              onChange={(e) =>
                                handleRightsChange(e, index, grpIndex)
                              }
                            />
                          </Form.Group>
                        </div>
                      </Fragment>
                    ))}
                </div>
              </div>
            </div>
          ))}
        <div className="row justify-content-center">
          <div className="col-3 mt-3">
            <CustomButton
              name={"Update"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading && <Spinner />}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default OrderFlowListModal;

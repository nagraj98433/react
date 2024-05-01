import React, { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MdAddCircle, MdClose } from "react-icons/md";
import { LuMinus } from "react-icons/lu";
import Select from "react-select";
import { themeColor } from "../../utilis/constants";
import GroupAndRights from "./GroupAndRights";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";

function OrderFlowNode({
  finalData,
  setFinalData,
  position,
  setIsEmpty,
  isCashierSelected,
  setIsCashierSelected,
}) {
  const [groupCount, setGroupCount] = useState(0);
  const [groupArray, setGroupArray] = useState([]);
  const [newId, setNewId] = useIdGenerator();
  const [nodeData, setNodeData] = useState({
    node_id: newId,
    node_name: "",
    node_role: "",
    node_group: [],
    urlLength: "",
    urlType: "",
  });
  const [grpArry, setGrpArry] = useState([]);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const globalApiHandler = useGlobalApiHandler();

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "13px",
    }),
  };

  const rolesArray = [
    { value: 0, label: "Waiter" },
    { value: 1, label: "Kitchen" },
    { value: 2, label: "Cashier" },
    { value: 3, label: "Customer" },
  ];
  const urlSizeArray = [
    { value: 0, label: "Short" },
    { value: 1, label: "Long" },
  ];
  const urlTypeArray = [
    { value: 0, label: "Secured" },
    { value: 1, label: "Open" },
  ];
  const rolesFilteredArray = [{ value: 2, label: "Cashier" }];

  const getStaffList = async () => {
    let stafflistUrl = null;
    stafflistUrl = getAmazonUrl("usergroup");
    const isNotExpired = amazonUrlExpiryChecker(stafflistUrl?.expiry);

    if (!isNotExpired) {
      stafflistUrl = await fetchAmazonBucketUrls("usergroup");
    }

    const apiData = {
      method: "get",
      url: stafflistUrl?.url?.get_url,
    };
    const response = await globalApiHandler(apiData);

    let staffgroupArray = [];
    if (response) {
      for (let i = 0; i < response?.usergroup.length; i++) {
        let newObj = {
          label: response?.usergroup[i]?.groupName,
          value: response?.usergroup[i],
        };
        staffgroupArray.push(newObj);
      }
    }

    setGrpArry(staffgroupArray);
  };

  const handleChange = () => {
    let newArray = [...finalData?.nodes];

    newArray[position] = nodeData;

    setFinalData((prev) => ({ ...prev, nodes: newArray }));
  };

  useEffect(() => {
    getStaffList();

    return () => {
      setNewId();
    };
  }, []);

  useEffect(() => {
    handleChange();
  }, [nodeData]);

  useEffect(() => {
    setGroupArray(Array.from({ length: groupCount }));
  }, [groupCount]);
  return (
    <div className="col-8 border rounded p-2 nodeSequence">
      <div className=" col-12 d-flex ">
        <Form.Group className="col-lg-3 col-md-6 col-12 px-2">
          <Form.Label className="primary-text fw-medium formLabelText">
            Node name
          </Form.Label>
          <Form.Control
            className="customInputBoxText"
            placeholder="Enter node name"
            value={nodeData.node_name}
            onChange={(e) => {
              setNodeData((prev) => ({ ...prev, node_name: e.target.value }));
            }}
            onBlur={(e) => setIsEmpty(e.target.value.length ? false : true)}
          />
        </Form.Group>
        <Form.Group className="col-lg-3 col-md-6 col-12 px-2">
          <Form.Label className="primary-text fw-medium formLabelText">
            Select role
          </Form.Label>
          <Select
            className="customInputBoxText"
            menuPortalTarget={document.body}
            styles={customStyles}
            options={
              isCashierSelected && position + 1 >= isCashierSelected
                ? isCashierSelected === position + 1
                  ? rolesArray
                  : rolesFilteredArray
                : rolesArray
            }
            value={rolesArray.find((grp) => grp.value === nodeData.node_role)}
            onChange={(e) => {
              setNodeData((prev) => ({ ...prev, node_role: e.value }));
              e.value === 2
                ? isCashierSelected === null &&
                  setIsCashierSelected(position + 1)
                : setIsCashierSelected(null);
            }}
            onBlur={(e) => {
              setIsEmpty(e.target.value ? false : true);
            }}
          />
        </Form.Group>
        <Form.Group className="col-lg-3 col-md-6 col-12 px-2">
          <Form.Label className="primary-text fw-medium formLabelText">
            Url Length
          </Form.Label>
          <Select
            className="customInputBoxText"
            menuPortalTarget={document.body}
            styles={customStyles}
            options={urlSizeArray}
            value={nodeData.urlLength}
            onChange={(e) => {
              setNodeData((prev) => ({ ...prev, urlLength: e }));
            }}
            onBlur={(e) => {
              setIsEmpty(e.target.value ? false : true);
            }}
          />
        </Form.Group>
        <Form.Group className="col-lg-3 col-md-6 col-12 px-2">
          <Form.Label className="primary-text fw-medium formLabelText">
            Url Type
          </Form.Label>
          <Select
            className="customInputBoxText"
            menuPortalTarget={document.body}
            styles={customStyles}
            options={urlTypeArray}
            value={nodeData.urlType}
            onChange={(e) => {
              setNodeData((prev) => ({ ...prev, urlType: e }));
            }}
            onBlur={(e) => {
              setIsEmpty(e.target.value ? false : true);
            }}
          />
        </Form.Group>
      </div>
      <div className="col-12 d-flex rounded mt-2">
        <GroupAndRights
          setNodeData={setNodeData}
          nodeData={nodeData}
          position={0}
          grpArry={grpArry}
          setIsEmpty={setIsEmpty}
        />
      </div>
      {groupArray.length ? (
        groupArray.map((item, index) => (
          <div key={index} className="d-flex align-items-end gap-3 mt-2">
            <GroupAndRights
              setNodeData={setNodeData}
              nodeData={nodeData}
              position={index + 1}
              grpArry={grpArry}
              setIsEmpty={setIsEmpty}
            />
            <MdClose
              size={"18px"}
              color={themeColor.primary}
              onClick={() => setGroupCount(groupCount - 1)}
            />
          </div>
        ))
      ) : (
        <div></div>
      )}
      <div className="mt-2">
        <MdAddCircle
          size={"20px"}
          color={themeColor.primary}
          onClick={() => setGroupCount(groupCount + 1)}
        />
      </div>
    </div>
  );
}

export default OrderFlowNode;

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useTaxList } from "../../utilis/useTaxList";
import { themeColor } from "../../utilis/constants";
import toast from "react-hot-toast";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import CustomTitle from "../heading/CustomTitle";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import Spinner from "../loaders/Spinner";
import Select from "react-select";
import { useOperationList } from "../../utilis/useOperationList";
import { useItemGroup } from "../../utilis/useItemGroup";
import { useGetSelectedMenu } from "../../utilis/useGetSelectedMenu";
import { useDispatch } from "react-redux";
import { handleAddExpression } from "../../store/menuSlice";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";

function TaxForm() {
  const taxDetails = useSelector((state) => state.taxData.data);
  const operationDetails = useSelector((state) => state.operationData.data);
  const itemGroupDetails = useSelector((state) => state.itemGroupData.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getTaxList = useTaxList();
  const getOperationList = useOperationList();
  const getItemGroupList = useItemGroup();
  const getSelectedMenu = useGetSelectedMenu();
  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();

  const [expressionName, setExpressionName] = useState("");
  const [expression, setExpression] = useState({});
  const [expressionList, setExpressionList] = useState([]);
  const [selectedItemGroup, setSelectedItemGroup] = useState({});
  const [itemGroupList, setItemGroupList] = useState([]);
  const [newId, setNewId] = useIdGenerator();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuFetch, setIsMenuFetch] = useState(false);

  const handleExpressionList = () => {
    if (!operationDetails?.expressions?.length) {
      return;
    }

    let tempArray = [];
    for (let i = 0; i < operationDetails?.expressions?.length; i++) {
      let newObj = {
        label: operationDetails?.expressions[i]?.expression_name,
        value: operationDetails?.expressions[i]?.expression_id,
      };
      tempArray.push(newObj);
    }
    setExpressionList(tempArray);
  };

  const handleItemGroupList = () => {
    if (!itemGroupDetails?.itemGroup?.length) {
      return;
    }

    let tempArray = [];
    for (let i = 0; i < itemGroupDetails?.itemGroup?.length; i++) {
      let newObj = {
        label: itemGroupDetails?.itemGroup[i]?.name,
        value: itemGroupDetails?.itemGroup[i],
      };
      tempArray.push(newObj);
    }
    setItemGroupList(tempArray);
  };

  const handleFetchMenu = async (grpData) => {
    setIsMenuFetch(true);
    if (!grpData) {
      setIsMenuFetch(false);
      return console.log("group not selected");
    }
    let menuId = grpData.value?.items[0]?.split("_")[0];

    if (!menuId) {
      setIsMenuFetch(false);
      return console.log("MenuId not found");
    }

    await getSelectedMenu(menuId);
    setIsMenuFetch(false);
  };

  const handleExpressionDispatch = (data) => {
    if (!data) {
      return console.log("Expression not selected");
    }

    if (!selectedItemGroup.hasOwnProperty("value")) {
      return console.log("Item group not selected");
    }

    dispatch(
      handleAddExpression({
        itemIds: selectedItemGroup.value?.items,
        expressionId: data?.value,
        expressionType: "taxExpressions",
      })
    );
  };

  const handleSubmit = async () => {
    if (
      !expressionName.length ||
      !expression.hasOwnProperty("value") ||
      !selectedItemGroup.hasOwnProperty("value")
    ) {
      return toast.error("All fields are mandatory");
    }

    setIsLoading(true);

    let newObj = {
      id: newId,
      name: expressionName,
      expression: expression?.value,
      itemGroup: selectedItemGroup.value?.id,
      catalogId: selectedItemGroup.value?.items[0]?.split("_")[0],
    };

    let taxUrl = null;
    taxUrl = getAmazonUrl("tax&charges");
    const isNotExpired = amazonUrlExpiryChecker(taxUrl?.expiry);

    if (!isNotExpired) {
      taxUrl = await fetchAmazonBucketUrls("tax&charges");
    }

    if (!taxUrl) return toast.error("Url not found");

    const copyObj = JSON.parse(JSON.stringify(taxDetails));

    copyObj?.["tax&charges"]?.push(newObj);

    const response = await axios.put(taxUrl?.url?.put_url, copyObj);

    if (response?.status === 200) {
      const payload = {
        catalogId: selectedItemGroup.value?.items[0]?.split("_")[0],
      };
      await updateMenu(payload);

      await getTaxList();
      setExpression({});
      setExpressionName("");
      setSelectedItemGroup({});
      setNewId();
    } else {
      toast.error("Something wents wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getOperationList();
    getItemGroupList();
  }, []);

  useEffect(() => {
    handleExpressionList();
  }, [operationDetails]);

  useEffect(() => {
    handleItemGroupList();
  }, [itemGroupDetails]);

  return (
    <div>
      <CustomTitle heading={"Create tax and other charges"} />
      <div className="row">
        <div className="col-8">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Tax name
            </Form.Label>
            <Form.Control
              placeholder="Enter tax name"
              className="customInputBoxText"
              value={expressionName}
              onChange={(e) => setExpressionName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Select item group
            </Form.Label>
            <Select
              value={
                selectedItemGroup.hasOwnProperty("value")
                  ? selectedItemGroup
                  : ""
              }
              onChange={(e) => {
                setSelectedItemGroup(e);
                handleFetchMenu(e);
              }}
              options={itemGroupList}
              className="customInputBoxText"
            />
          </Form.Group>
          {selectedItemGroup.hasOwnProperty("value") && (
            <>
              {isMenuFetch ? (
                <div className="text-end" style={{ fontSize: "12px" }}>
                  Menu is fetching. Please waiting...
                </div>
              ) : (
                <div
                  className="text-end"
                  style={{ fontSize: "12px", color: "#44ce42" }}
                >
                  Menu fetched successfully
                </div>
              )}
            </>
          )}
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Select expression
            </Form.Label>
            <Select
              value={expression.hasOwnProperty("value") ? expression : ""}
              onChange={(e) => {
                setExpression(e);
                handleExpressionDispatch(e);
              }}
              options={
                selectedItemGroup.hasOwnProperty("value") ? expressionList : []
              }
              className="customInputBoxText"
              isDisabled={isMenuFetch}
            />
          </Form.Group>
        </div>
      </div>
      <div className="mt-3 row">
        <div className="col-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={handleSubmit}
            preIcon={isLoading && <Spinner />}
            isDisable={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default TaxForm;

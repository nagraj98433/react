import React, { useEffect, useState } from "react";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useParams } from "react-router-dom";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useSelector } from "react-redux";
import axios from "axios";
import { useOrderFlowList } from "../../utilis/useOrderFlowList";
import OrderFlowNode from "./OrderFlowNode";
import ProfileCircle from "../profileCircle/ProfileCircle";
import { useGroupList } from "../../global_apis/useGroupList";

function CreateOrderFlow() {
  const orderFlowDetails = useSelector((state) => state.orderFlowData?.data);

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOrderFlowList = useOrderFlowList();
  const staffGroups = useGroupList();

  const [form, setForm] = useState({
    name: "",
    nodes: "",
  });
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newId, setNewId] = useIdGenerator();
  const [nodeArray, setNodeArray] = useState([]);
  const [finalData, setFinalData] = useState({
    order_flow_id: newId,
    order_flow_name: "",
    nodes: [],
  });
  const [isCashierSelected, setIsCashierSelected] = useState(null);

  const nodesCount = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log(isEmpty);
    if (isEmpty) {
      return toast.error("All fields are mandatory");
    }
    setIsLoading(true);
    let orderFlowUrl = null;
    orderFlowUrl = getAmazonUrl("orderflow");
    const isNotExpired = amazonUrlExpiryChecker(orderFlowUrl?.expiry);

    if (!isNotExpired) {
      orderFlowUrl = await fetchAmazonBucketUrls("orderflow");
    }

    const response = await axios.put(orderFlowUrl?.url?.put_url, [
      ...orderFlowDetails,
      finalData,
    ]);

    if (response?.status === 200) {
      await getOrderFlowList();
      setFinalData({
        order_flow_id: newId,
        order_flow_name: "",
        nodes: [],
      });
      setForm({
        name: "",
        nodes: "",
      });
      setNewId();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    staffGroups();
  }, []);

  useEffect(() => {
    setNodeArray(Array.from({ length: Number(form.nodes) }));
  }, [form.nodes]);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="col-12 col-lg-6 col-md-6">
            <CustomTitle heading={"Create Order Flow"} />
          </div>

          <div className="row mt-2">
            <div className="col-12 col-lg-3 col-md-5">
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Order Flow Name
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="text"
                  placeholder={"Enter order flow name"}
                  required
                  name="name"
                  value={form.name}
                  onBlur={(e) =>
                    setIsEmpty(e.target.value.length ? false : true)
                  }
                  onChange={(e) => {
                    handleChange(e);
                    setFinalData((prev) => ({
                      ...prev,
                      order_flow_name: e.target.value,
                    }));
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-12 col-lg-2 col-md-2">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Enter No. of Nodes
                </Form.Label>
                <Select
                  className="customInputBoxText"
                  options={nodesCount}
                  value={
                    form.nodes
                      ? {
                          label: form.nodes,
                          value: Number(form.nodes),
                        }
                      : ""
                  }
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, nodes: e.label }));
                    setIsEmpty(true);
                  }}
                />
              </Form.Group>
            </div>
          </div>
          <div>
            <div className="row mt-3">
              {nodeArray.length
                ? nodeArray.map((item, index) => (
                    <div key={index} className="col-12 mb-3">
                      <div className="w-100 animeTopToBottom d-flex align-items-start gap-4 fw-medium h3">
                        <div style={{ width: "20px" }}>
                          <ProfileCircle name={index + 1} size={30} />
                        </div>
                        <OrderFlowNode
                          finalData={finalData}
                          setFinalData={setFinalData}
                          position={index}
                          setIsEmpty={setIsEmpty}
                          isCashierSelected={isCashierSelected}
                          setIsCashierSelected={setIsCashierSelected}
                        />
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
      <div className="row col-6 my-3">
        <div className="col-5 col-lg-2 col-md-4">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={handleSubmit}
            preIcon={isLoading && <Spinner />}
          />
        </div>
      </div>
    </>
  );
}

export default CreateOrderFlow;

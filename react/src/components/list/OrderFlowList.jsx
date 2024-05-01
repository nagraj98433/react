import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { FaArrowRightLong } from "react-icons/fa6";
import OrderFlowListModal from "../modals/OrderFlowListModal";
import Accordion from "react-bootstrap/Accordion";
import { useOrderFlowList } from "../../utilis/useOrderFlowList";
import NotFound from "../notFound/NotFound";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useDispatch } from "react-redux";
import { orderFlowList } from "../../store/orderFlowSlice";
import axios from "axios";
import Spinner from "../loaders/Spinner";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";

function OrderFlowList() {
  const orderFlowDetails = useSelector((state) => state.orderFlowData.data);

  const getOrderFlowList = useOrderFlowList();
  const getAmazonUrl = useAmazonUrl();
  const apiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [selectedOrderFlow, setSelectedOrderFlow] = useState(null);
  const [modalDataIndex, setModalDataIndex] = useState(null);

  const toggleModal = () => setShowModal(!showModal);

  const handleDeleteOrderFlow = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(orderFlowDetails));

    if (!copiedObj) {
      return;
    }
    copiedObj?.splice(index, 1);

    let orderFlowUrl = null;
    orderFlowUrl = getAmazonUrl("orderflow");
    const isNotExpired = amazonUrlExpiryChecker(orderFlowUrl?.expiry);

    if (!isNotExpired) {
      orderFlowUrl = await fetchAmazonBucketUrls("orderflow");
    }

    const response = await axios.put(orderFlowUrl?.url?.put_url, copiedObj);

    if (response?.status === 200) {
      dispatch(orderFlowList(copiedObj));
    }
    setIsDelete(null);
  };

  useEffect(() => {
    getOrderFlowList(setIsLoading);
  }, []);
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Order Flow list</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-12 animeBottomToTop">
                {isLoading ? (
                  <VerticalListShimmer />
                ) : (
                  <ListGroup>
                    {orderFlowDetails?.length ? (
                      orderFlowDetails.map((flow, flowIndex) => (
                        <ListGroup.Item key={flow?.order_flow_id}>
                          <div className="d-flex justify-content-between align-items-start cursor-pointer w-100">
                            <div>
                              <div className="fw-medium primary-text userText">
                                {flow?.order_flow_name}
                              </div>
                              <div className="fw-medium secondary-text userNameText d-flex gap-2 flex-wrap w-100 ms-1">
                                {flow?.nodes?.length
                                  ? flow?.nodes.map((node, index) => {
                                      return (
                                        <div
                                          key={node?.node_id}
                                          className="d-flex gap-2"
                                        >
                                          <div className="text-nowrap">
                                            {node?.node_name}
                                          </div>
                                          {index + 1 !==
                                            flow?.nodes?.length && (
                                            <div>
                                              <FaArrowRightLong />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                  : ""}
                                <div></div>
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <MdEdit
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => {
                                  setSelectedOrderFlow(flow);
                                  setModalDataIndex(flowIndex);
                                  toggleModal();
                                }}
                              />
                              {isDelete === flow?.order_flow_id ? (
                                <Spinner />
                              ) : (
                                <MdDelete
                                  onClick={() => {
                                    setIsDelete(flow?.order_flow_id);
                                    handleDeleteOrderFlow(flowIndex);
                                  }}
                                  color={themeColor.primary}
                                  size={"15px"}
                                />
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <NotFound />
                    )}
                  </ListGroup>
                )}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <OrderFlowListModal
        show={showModal}
        handleToggle={toggleModal}
        flow={selectedOrderFlow}
        modalDataIndex={modalDataIndex}
      />
    </>
  );
}

export default OrderFlowList;

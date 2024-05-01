import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";
import UpdateStaff from "../modals/UpdateStaff";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import { useStaffListApi } from "../../global_apis/useStaffListApi";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { BASE_URL } from "../../utilis/constants";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { FaArrowRightLong } from "react-icons/fa6";
import Accordion from "react-bootstrap/Accordion";

function AssignQrList() {
  const globalApiHandler = useGlobalApiHandler();
  const staffList = useSelector((state) => state.staffData.data);

  const ownerLogin = useSelector((state) => state.userData.data);
  // const getStaffList = useStaffListApi();

  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinner, setSpinner] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeDeleteButton, setActiveDeleteButton] = useState(null);
  const toggleCreateStaffModal = (data) => {
    setSelectedUser(data);
    setShowCreateStaffModal(!showCreateStaffModal);
  };

  // const handleDelete = async (outletId, username, prime_id) => {
  //   setActiveDeleteButton(prime_id);
  //   const data = {
  //     method: "delete",
  //     url: BASE_URL + `api/delete/${outletId}/${username}/${prime_id}/`,
  //   };

  //   const response = await globalApiHandler(data);

  //   if (response?.success) {
  //     toast.success(response?.message);
  //     getStaffList();

  //     setActiveDeleteButton(null);
  //   } else {
  //     toast.error(response?.message);
  //   }
  // };
  // useEffect(() => {
  //   getStaffList(setIsLoading);
  // }, []);
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header> Groups Linked with QR</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-12 col-lg-8 col-md-10 animeBottomToTop">
                {isLoading ? (
                  <VerticalListShimmer />
                ) : (
                  <ListGroup>
                    <ListGroup.Item>
                      <div className="d-flex justify-content-between align-items-start cursor-pointer">
                        <div>
                          <div className="fw-medium primary-text userText">
                            {"Group 1"}
                          </div>
                          <div className="fw-medium secondary-text userNameText ms-1">
                            {"Table 1"} <FaArrowRightLong /> {"waiter"}{" "}
                            <FaArrowRightLong /> {"(Read-Update-Delete)"}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex justify-content-between align-items-start cursor-pointer">
                        <div>
                          <div className="fw-medium primary-text userText">
                            {"Group 2"}
                          </div>
                          <div className="fw-medium secondary-text userNameText ms-1">
                            {"Table 1"} <FaArrowRightLong /> {"kitchen"}{" "}
                            <FaArrowRightLong /> {"(Read-Update-Delete)"}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <UpdateStaff
        show={showCreateStaffModal}
        handleToggle={toggleCreateStaffModal}
        data={selectedUser}
      />
    </>
  );
}

export default AssignQrList;

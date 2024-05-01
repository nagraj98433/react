import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import StaffListModal from "../modals/StaffListModal";
import { useDispatch } from "react-redux";
import axios from "axios";
import { handleUrl } from "../../store/staffSlice";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useStaffList } from "../../global_apis/useStaffList";
import NotFound from "../notFound/NotFound";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import MemberListModal from "../modals/MemberListModal";

function MemberList({ staffList, UpdateStaffPresignedUrl }) {
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const getAllStaffList = useStaffList();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const globalApiHandler = useGlobalApiHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = async (staffDetails) => {
    setSelectedUser(staffDetails);
    setShowModal(!showModal);
  };

  const handleDeleteStaff = async (staff, index) => {
    setIsLoading(true);
    if (staffList && staffList?.Users && staffList?.Users?.length > 0) {
      const updatedStaffList = [...staffList?.Users];
      // Remove the staff object at the specified index
      updatedStaffList.splice(index, 1);
      // Update the state with the modified staff list
      const apiData = {
        method: "delete",
        url: BASE_URL + `api/delete/${staff?.username}/`,
      };
      const response = await globalApiHandler(apiData);
      if (response?.success) {
        const amazonUrlResult = await getAmazonUrl("users");
        const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);
        if (!isNotExpired) {
          const requiredUrl = await fetchAmazonBucketUrls("users");
          dispatch(handleUrl(requiredUrl?.put_url));
          const updateDataurl = await axios.put(requiredUrl?.put_url, {
            ...staffList,
            Users: updatedStaffList,
          });
          if (updateDataurl?.status === 200) {
            toast.success("User Deleted successfully!");
            getAllStaffList();
          } else {
            toast.error("User Deletion failed!");
          }
        } else {
          const amazonUrlResult = await getAmazonUrl("users")?.url?.put_url;
          dispatch(handleUrl(amazonUrlResult));
          const updateDataurl = await axios.put(amazonUrlResult, {
            ...staffList,
            Users: updatedStaffList,
          });
          if (updateDataurl?.status === 200) {
            toast.success("User Deleted successfully!");
            getAllStaffList();
          } else {
            toast.error("User Deletion failed!");
          }
        }
        setIsLoading(false);
      } else {
        toast.error(response?.message);
        setIsLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   if (staffList?.Users?.length > 0) {
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [staffList?.Users?.length > 0]);

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header> Unregistered User list</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-12 col-lg-8 col-md-10 animeBottomToTop">
                {isLoading ? (
                  <VerticalListShimmer />
                ) : (
                  <ListGroup>
                    {staffList && staffList?.Users?.length > 0 ? (
                      staffList?.Users?.filter(
                        (staffType) => staffType?.type === "unregistered"
                      ).map((staff, index) => (
                        <ListGroup.Item key={staff.user_id}>
                          <div className="d-flex justify-content-between align-items-start cursor-pointer">
                            <div className="fw-medium primary-text userText">
                              {staff.name}
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <MdEdit
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => toggleModal(staff)}
                              />
                              <MdDelete
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => handleDeleteStaff(staff, index)}
                              />
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
      <MemberListModal
        show={showModal}
        handleToggle={toggleModal}
        staffDetail={selectedUser}
        staffList={staffList}
        updatePresignedUrl={UpdateStaffPresignedUrl}
      />
    </>
  );
}

export default MemberList;

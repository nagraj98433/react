import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import GroupListModal from "../modals/GroupListModal";
import { useDispatch } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { handleGroupUrl } from "../../store/groupSlice";
import { useGroupList } from "../../global_apis/useGroupList";
import axios from "axios";
import NotFound from "../notFound/NotFound";

function GroupList({ staffList, groupList, UpdateGroupPresignedUrl }) {
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const getAllGroupList = useGroupList();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleUpdateGroupModal = (data) => {
    setSelectedUser(data);
    setShowUpdateGroupModal(!showUpdateGroupModal);
  };

  const handleDeleteGroup = async (index) => {
    setIsLoading(true);
    if (groupList?.usergroup.length > 0) {
      const updatedGroupList = [...groupList?.usergroup];
      updatedGroupList.splice(index, 1);

      const amazonUrlResult = await getAmazonUrl("staffgroup");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("usergroup");
        dispatch(handleGroupUrl(requiredUrl));
        const updateDataurl = await axios.put(requiredUrl?.put_url, {
          usergroup: updatedGroupList,
        });
        if (updateDataurl?.status === 200) {
          await getAllGroupList(requiredUrl?.get_url);
          toast.success("Group Deleted successfully!");
        } else {
          toast.error("Group Deletion failed!");
        }
      } else {
        const amazonUrlResult = await getAmazonUrl("usergroup")?.url;
        const updateDataurl = await axios.put(amazonUrlResult?.put_url, {
          usergroup: updatedGroupList,
        });
        if (updateDataurl?.status === 200) {
          await getAllGroupList(amazonUrlResult?.get_url);
          toast.success("Group Deleted successfully!");
        } else {
          toast.error("Group Deletion failed!");
          // console.error("Error uploading file:", updateDataurl);
        }
      }
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   if (groupList?.usergroup?.length > 0) {
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [groupList?.usergroup?.length > 0]);

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Group list</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-12 col-lg-8 col-md-10 animeBottomToTop">
                {isLoading ? (
                  <VerticalListShimmer />
                ) : (
                  <ListGroup>
                    {groupList && groupList?.usergroup?.length > 0 ? (
                      groupList?.usergroup.map((group, index) => (
                        <ListGroup.Item key={group.id}>
                          <div className="d-flex justify-content-between align-items-start cursor-pointer">
                            <div>
                              <div className="fw-medium primary-text userText">
                                {group.groupName}
                              </div>
                              <div className="fw-medium secondary-text userNameText ms-1">
                                {group &&
                                  group?.groupStaffs.map((groupId, index) => {
                                    const filteredStaff =
                                      staffList?.Users?.filter(
                                        (staff) => staff?.user_id === groupId
                                      );
                                    if (filteredStaff?.length > 0) {
                                      return `${filteredStaff[0].name}${
                                        index + 1 !== group?.groupStaffs?.length
                                          ? ", "
                                          : ""
                                      }`; // Assuming staff_id is unique, otherwise handle accordingly
                                    } else {
                                      return ""; // or whatever default value you want if staff is not found
                                    }
                                  })}
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <MdEdit
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => toggleUpdateGroupModal(group)}
                              />
                              <MdDelete
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => handleDeleteGroup(index)}
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
      <GroupListModal
        show={showUpdateGroupModal}
        handleToggle={toggleUpdateGroupModal}
        data={selectedUser}
        staffList={staffList}
        groupList={groupList}
        UpdateGroupPresignedUrl={UpdateGroupPresignedUrl}
      />
    </>
  );
}

export default GroupList;

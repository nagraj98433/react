import React, { useState, useEffect } from "react";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import CreateStaff from "../components/form/CreateStaff";
import StaffList from "../components/list/StaffList";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import CreateGroups from "../components/form/CreateGroups";
import GroupList from "../components/list/GroupList";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { useStaffList } from "../global_apis/useStaffList";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";
import { handleUrl } from "../store/staffSlice";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { handleGroupUrl } from "../store/groupSlice";
import { useGroupList } from "../global_apis/useGroupList";
import { Toaster } from "react-hot-toast";
import CreateMember from "../components/form/CreateMember";
import MemberList from "../components/list/MemberList";

function Staffs() {
  const dispatch = useDispatch();
  const breadcrumb = useBreadcrumbData();
  const getAmazonUrl = useAmazonUrl();
  const getAllStaffList = useStaffList();
  const getAllGroupList = useGroupList();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const staffList = useSelector((state) => state.staffData?.data);
  const groupList = useSelector((state) => state.groupData?.data);
  const UpdateStaffPresignedUrl = useSelector(
    (state) => state.staffData?.presignedUrl
  );
  const UpdateGroupPresignedUrl = useSelector(
    (state) => state.groupData?.presignedUrl
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("registered");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const getStaffList = async () => {
    setIsLoading(true);
    const amazonUrlResult = await getAmazonUrl("users");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("users");
      await getAllStaffList(requiredUrl?.get_url);
      dispatch(handleUrl(requiredUrl?.put_url));
    } else {
      const amazonUrlResult = await getAmazonUrl("users")?.url?.put_url;
      dispatch(handleUrl(amazonUrlResult));
      getAllStaffList();
    }

    setIsLoading(false);
  };
  const getGroupList = async () => {
    setIsLoading(true);
    const amazonUrlResult = await getAmazonUrl("usergroup");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("usergroup");
      await getAllGroupList(requiredUrl?.get_url);
      dispatch(handleGroupUrl(requiredUrl));
    } else {
      const amazonUrlResult = await getAmazonUrl("usergroup")?.url;
      dispatch(handleGroupUrl(amazonUrlResult));
      getAllGroupList();
    }

    setIsLoading(false);
  };
  useEffect(() => {
    breadcrumb("staff");
    getStaffList();
    getGroupList();
  }, []);
  return (
    <div className="overflow-auto h-100 customscrollbar pb-5">
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage User"} />
      <div className="heroContainerMargin">
        <Toaster />
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="registered">Registered</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="unregistered">Unregistered</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="group">Group</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="registered">
              <div className="row">
                <div className="col-12 col-lg-6 col-md-6 mt-4">
                  <CreateStaff />
                </div>
                <div className="col-1 d-none d-lg-block d-md-block border-end"></div>
                <div className="col-12 d-block d-lg-none d-md-none"></div>
                <div className="col-12 col-lg-5 col-md-5 mt-5">
                  <StaffList
                    staffList={staffList}
                    UpdateStaffPresignedUrl={UpdateStaffPresignedUrl}
                  />
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="unregistered">
              <div className="row">
                <div className="col-12 col-lg-6 col-md-6 mt-4">
                  <CreateMember staffList={staffList} />
                </div>
                <div className="col-1 d-none d-lg-block d-md-block border-end"></div>
                <div className="col-12 d-block d-lg-none d-md-none"></div>
                <div className="col-12 col-lg-5 col-md-5 mt-5">
                  <MemberList
                    staffList={staffList}
                    UpdateStaffPresignedUrl={UpdateStaffPresignedUrl}
                  />
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="group">
              <div className="row">
                <div className="col-12 col-lg-6 col-md-6 mt-4">
                  <CreateGroups
                    staffList={staffList}
                    groupList={groupList}
                    UpdateGroupPresignedUrl={UpdateGroupPresignedUrl}
                  />
                </div>
                <div className="col-1 d-none d-lg-block d-md-block border-end"></div>
                <div className="col-12 d-block d-lg-none d-md-none"></div>
                <div className="col-12 col-lg-5 col-md-5 mt-5">
                  <GroupList
                    staffList={staffList}
                    groupList={groupList}
                    UpdateGroupPresignedUrl={UpdateGroupPresignedUrl}
                  />
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
}

export default Staffs;

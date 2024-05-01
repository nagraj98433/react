import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import UpdateRoles from "../modals/UpdateRoles";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useSelector } from "react-redux";
import { useRoleListApi } from "../../global_apis/useRoleListApi";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import NotFound from "../notFound/NotFound";
import Spinner from "../loaders/Spinner";
import toast from "react-hot-toast";

function RoleListItem({ role }) {
  const userAccessList = useSelector((state) => state.accessData.data);
  const globalApiHandler = useGlobalApiHandler();
  const getRolesList = useRoleListApi();

  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [modalData, setModaldata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCreateStaffModal = (data) => {
    setModaldata(data);
    setShowCreateStaffModal(!showCreateStaffModal);
  };

  const handleDeleteRole = async (id) => {
    setIsLoading(true);
    const data = {
      method: "delete",
      url: BASE_URL + `api/permission/delete/group/${id}/`,
    };

    const response = await globalApiHandler(data);

    if (response?.success) {
      toast.success(response?.message);
      getRolesList(setIsLoading);
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <>
      <ListGroup.Item key={role.uuid}>
        <div className="d-flex justify-content-between align-items-start cursor-pointer">
          <div>
            <div className="fw-medium primary-text userText">{role?.name}</div>
            <div className="fw-medium secondary-text userNameText ms-1">
              {role?.permissions_level}
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <MdRemoveRedEye
              color={themeColor.primary}
              size={"20px"}
              onClick={() => toggleCreateStaffModal(role)}
            />
            {isLoading ? (
              <Spinner />
            ) : (
              <MdDelete
                onClick={() => handleDeleteRole(role.uuid)}
                color={themeColor.primary}
                size={"20px"}
              />
            )}
          </div>
        </div>
      </ListGroup.Item>
      <UpdateRoles
        show={showCreateStaffModal}
        handleToggle={toggleCreateStaffModal}
        data={modalData}
      />
    </>
  );
}

function RolesList() {
  const rolesList = useSelector((state) => state.rolesData.data);

  const ownerLogin = useSelector((state) => state.userData.data);

  const getRolesList = useRoleListApi();

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   getRolesList(setIsLoading);
  // }, []);

  return (
    <>
      <CustomTitle heading={"Role List"} />
      <div className="row">
        <div className="col-12 col-lg-8 col-md-10 animeBottomToTop">
          {isLoading ? (
            <VerticalListShimmer />
          ) : (
            <ListGroup>
              {ownerLogin && ownerLogin?.user_level === "OWNER"
                ? rolesList?.map((role) => (
                    <RoleListItem key={role?.uuid} role={role} />
                  ))
                : rolesList
                    .filter((role) => role?.permissions_level === "Grade 2")
                    .map((filteredRole) => (
                      <RoleListItem
                        key={filteredRole?.uuid}
                        role={filteredRole}
                      />
                    ))}
              {rolesList.length === 0 && <NotFound />}
            </ListGroup>
          )}
        </div>
      </div>
    </>
  );
}

export default RolesList;

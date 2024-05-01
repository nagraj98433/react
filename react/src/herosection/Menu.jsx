import React, { useEffect } from "react";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import { Toaster } from "react-hot-toast";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { useDispatch } from "react-redux";
import { handleEmptyMenuData } from "../store/menuSlice";
import { handleActiveItem } from "../store/activeItemSlice";
import CustomTabs from "../components/Tabs/CustomTabs";
import { menuTabs } from "../utilis/constants";
import { Outlet } from "react-router-dom";

function Menu() {
  const breadcrumb = useBreadcrumbData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleEmptyMenuData());
    breadcrumb("menu");
    dispatch(
      handleActiveItem({
        name: "isMenuUpdating",
        value: false,
      })
    );
    dispatch(
      handleActiveItem({
        name: "isMenuEdit",
        value: false,
      })
    );
    dispatch(
      handleActiveItem({
        name: "isAddOnEdit",
        value: false,
      })
    );
    dispatch(
      handleActiveItem({
        name: "isShowAddon",
        value: false,
      })
    );
  }, []);

  return (
    <div className="overflow-auto h-100 customscrollbar">
      <Toaster />
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage Menu"} />
      <div className="heroContainerMargin">
        <CustomTabs data={menuTabs} />
        <Outlet />
      </div>
    </div>
  );
}

export default Menu;

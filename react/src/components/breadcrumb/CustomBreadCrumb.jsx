import React, { Fragment } from "react";
import "./CustomBreadCrumb.css";
import { themeColor } from "../../utilis/constants";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { useSelector } from "react-redux";

function CustomBreadCrumb() {
  const data = useSelector((state) => state.breadcrumbData.data);

  const navigate = useNavigate();

  const activeItemStyle = {
    borderBottom: `1px solid ${themeColor.primary}`,
    color: themeColor.primary,
    cursor: "pointer",
  };

  const restoNameStyle = {
    backgroundColor: themeColor.accent,
    padding: "1px 10px",
    borderRadius: "10px",
  };
  return (
    <>
      {data && (
        <div className="d-flex justify-content-start align-items-center mx-3 mt-2 mb-4">
          {data?.backNavigation && (
            <div
              onClick={() => navigate(data?.backNavigation)}
              style={{ color: themeColor.primary }}
              className="breadcrumbItems align-items-center cursor-pointer ps-3 d-none d-lg-inline-flex d-md-inline-flex"
            >
              <MdArrowBackIos />
              <div>Back</div>
            </div>
          )}
          <div className="d-flex gap-2 breadcrumbItems ms-auto">
            {data?.outletName && (
              <>
                <div style={restoNameStyle}>{data?.outletName}</div>
                <div>|</div>
              </>
            )}
            {data &&
              data?.tabs?.map((item, index) => {
                return (
                  <Fragment key={item?.id}>
                    <div
                      onClick={() => !item?.active && navigate(item?.navigate)}
                      style={!item?.active ? activeItemStyle : {}}
                    >
                      {item?.name}
                    </div>
                    {Number(index) + 1 < data?.tabs?.length && <div>/</div>}
                  </Fragment>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default CustomBreadCrumb;

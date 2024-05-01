import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { activeTabStyle, inActiveTabStyle } from "../../utilis/styles";
import ProfileCircle from "../profileCircle/ProfileCircle";

function CustomTabs({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  return (
    <>
      <div className="d-flex customscrollbar overflow-auto gap-2">
        {data &&
          data.map((item, index) => {
            return (
              <div key={item.id} className="d-flex align-items-center gap-2">
                <li
                  onClick={() =>
                    navigate(
                      `/main/outlet/${params?.outletId}${item?.navigate}`
                    )
                  }
                  style={
                    location.pathname.includes(item.navigate)
                      ? activeTabStyle
                      : inActiveTabStyle
                  }
                  className="text-center px-2 tabList cursor-pointer"
                >
                  <div className="d-flex text-nowrap gap-2 align-items-center">
                    <ProfileCircle name={index + 1} size={15} />
                    <div className="fw-medium">{item.name}</div>
                  </div>
                </li>
                {index + 1 !== data?.length && (
                  <div className="border-top" style={{ width: "50px" }}></div>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default CustomTabs;

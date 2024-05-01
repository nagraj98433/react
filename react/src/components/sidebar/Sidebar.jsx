import React from "react";
import { sidebarLogoMini, sidebarLogoLight } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  activeSidebarItemChildStyle,
  activeSidebarItemStyle,
  notActiveSidebarItemChildStyle,
  notActiveSidebarItemStyle,
} from "../../utilis/styles";

function Sidebar() {
  const isSidebarActive = useSelector((state) => state.activeItemData.sidebar);
  const sidebarContent = useSelector((state) => state.sidebarData.content);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item) => {
    if (!item.children) {
      navigate(item.navigate);
    }
  };

  const handleChildNavigation = (child) => {
    navigate(child.navigate);
  };

  return (
    <div>
      <div className="text-center">
        <img
          src={isSidebarActive ? sidebarLogoLight : sidebarLogoMini}
          alt="logo"
          className={` ${
            isSidebarActive ? "sidebarLogo" : "sidebarLogoMini"
          }  my-2`}
        />
      </div>
      <div className="mt-2">
        {sidebarContent.map((item) => {
          return (
            <div key={item.id} className="d-grid animeBottomToTop">
              <div
                onClick={() => {
                  handleNavigation(item);
                  item.children && handleChildNavigation(item.children[0]);
                }}
                style={
                  location.pathname.includes(item.navigate)
                    ? activeSidebarItemStyle
                    : notActiveSidebarItemStyle
                }
                className="d-flex my-2 px-2 py-1 mb-1 align-items-center gap-2 cursor-pointer sidebar-item-content"
              >
                <div
                  className={`${item.icon} ${
                    isSidebarActive ? "fs-6" : "fs-4"
                  }`}
                ></div>
                {isSidebarActive && <div>{item.name}</div>}
                {item.children && <div className="ms-auto">▾</div>}
              </div>
              {isSidebarActive && (
                <>
                  {item.children &&
                  location.pathname.includes(item.navigate) ? (
                    <ul className="cursor-pointer">
                      {location.pathname.includes(item.navigate) &&
                        item.children.map((child) => {
                          return (
                            <li
                              onClick={() => {
                                handleChildNavigation(child);
                              }}
                              style={
                                location.pathname.includes(child.navigate)
                                  ? activeSidebarItemChildStyle
                                  : notActiveSidebarItemChildStyle
                              }
                              className="sidebarChild animeBottomToTop"
                              key={child.id}
                            >
                              {child.name}
                            </li>
                          );
                        })}
                    </ul>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;

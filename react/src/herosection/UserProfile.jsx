import React, { useEffect } from "react";
import ProfileCard from "../components/cards/ProfileCard";
import { themeColor } from "../utilis/constants";
import { MdPaid } from "react-icons/md";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import { useSelector } from "react-redux";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

function UserProfile() {
  const userDetails = useSelector((state) => state.userData.data);
  const restoList = useSelector((state) => state.restoListData.data);
  const breadcrumb = useBreadcrumbData();

  const data = [
    {
      id: 1,
      name: "Total Restaurant",
      count: restoList?.length ? restoList.length : "0",
    },
    {
      id: 2,
      name: "Overall Employees",
      count: "70K+",
    },
    {
      id: 3,
      name: "Basic Plan",
      count: <MdPaid size={"62px"} color={themeColor.primary} />,
    },
  ];

  useEffect(() => {
    breadcrumb("userprofile");
  }, []);

  return (
    <div className="overflow-auto customscrollbar h-100">
      <CustomBreadCrumb />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="row">
              <div className="col-lg-3 col-md-4 mb-5">
                <div
                  style={{
                    height: "150px",
                    width: "150px",
                    borderRadius: "50%",
                    backgroundColor: themeColor.accent,
                  }}
                  className="userProfileIcon position-relative mx-auto"
                >
                  <h1
                    style={{ fontSize: "100px", color: themeColor.primary }}
                    className="getCentered"
                  >
                    {/* {userDetails?.business_name[0]?.trim().toUpperCase()} */}
                  </h1>
                </div>
              </div>

              <div className="col-lg-8 col-md-8 mb-5">
                <h1 style={{ color: themeColor.primary }}>
                  {/* {userDetails?.business_name} */}
                </h1>
                <p className="secondary-text">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse
                  veniam optio voluptatum sunt sit sed eveniet! Iure reiciendis
                  dolor totam labore accusantium, soluta excepturi omnis.
                </p>
              </div>

              {data.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <ProfileCard data={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import { MdDelete, MdRemoveRedEye, MdDownload } from "react-icons/md";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import { useMenuCatalogList } from "../../global_apis/useMenuCatalogList";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useNavigate, useParams } from "react-router-dom";
import { handleActiveItem } from "../../store/activeItemSlice";
import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { handleMenuCatalogList } from "../../store/menuCatalogSlice";

function AddOnList() {
  const globalApiHandler = useGlobalApiHandler();

  const addOnCatalogList = useSelector((state) => state.addOnCatalogData.data);
  //   const addOnCatalogList = [];
  const userData = useSelector((state) => state.userData.data);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (id) => {
    // navigate(`/main/outlet/${outletId}/menupreview/${id}`);
  };
  const getCatelist = async () => {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        `api/menu/catalog/${userData?.owner_id}/${params?.outletId}/`,
    };

    // const response = await globalApiHandler(apiData);

    // if (response?.status) {
    //   dispatch(handleMenuCatalogList(response?.data?.catalogs));
    // }
  };
  useEffect(() => {
    // getCatelist();
  }, []);
  return (
    <>
      <CustomTitle heading={"Add-Ons list"} />
      <div className="row pb-5">
        <div className="col-7">
          {isLoading ? (
            <VerticalListShimmer />
          ) : (
            <ListGroup>
              {addOnCatalogList.length ? (
                addOnCatalogList.map((menu) => {
                  return (
                    <ListGroup.Item key={menu?.id}>
                      <div className="d-flex align-items-center justify-content-between gap-3 cursor-pointer">
                        <div
                          onClick={() => handleNavigation(menu?.id)}
                          className="listNameText"
                        >
                          {menu?.name}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <MdRemoveRedEye
                            onClick={() => handleNavigation(menu?.id)}
                            color={themeColor.primary}
                          />
                          <MdDownload color={themeColor.primary} />
                          <MdDelete color={themeColor.primary} />
                        </div>
                      </div>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <NotFound />
              )}
            </ListGroup>
          )}
        </div>
      </div>
    </>
  );
}

export default AddOnList;

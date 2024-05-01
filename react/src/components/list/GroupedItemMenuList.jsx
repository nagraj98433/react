import React, { useEffect, useState } from "react";
import { ListGroup, DropdownButton, Dropdown } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import { MdDelete, MdRemoveRedEye, MdDownload } from "react-icons/md";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useMenuCatalogList } from "../../global_apis/useMenuCatalogList";

import toast from "react-hot-toast";
import { handleActiveItem } from "../../store/activeItemSlice";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import Spinner from "../loaders/Spinner";
import { handleMenuData } from "../../store/menuSlice";
import { useGetSelectedMenu } from "../../utilis/useGetSelectedMenu";

function GroupedItemMemuList({
  handleMenuListCatalogClick,
  setSelectedCatalog,
}) {
  const menuCatalogList = useSelector((state) => state.catlogData?.data);
  const itemGroupList = useSelector((state) => state.itemGroupData.data);
  const userDetails = useSelector((state) => state.userData.data);
  const outletId = useSelector((state) => state.activeItemData.restaurantId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const globalApiHandler = useGlobalApiHandler();
  const getMenuList = useMenuCatalogList();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getSelectedMenu = useGetSelectedMenu();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(null);

  const handleClick = async (id) => {
    setActiveLoading(id);
    const status = await getSelectedMenu(id);
    setActiveLoading(null);
    status &&
      navigate(`/main/outlet/${params?.outletId}/menupreviewtest/${id}`);
  };

  const handleDownloadClick = async (language, id) => {
    // const apiData = {
    //   method: "get",
    //   url:
    //     BASE_URL +
    //     `api/menu/download_menu/${userData?.owner_id}/${outletId}/${id}/${language}`,
    // };
    // const response = await globalApiHandler(apiData);
    // if (response?.success) {
    //   toast.success("Menu downloaded successfully");
    // }
  };

  const handleCatlogList = async () => {
    setIsLoading(true);
    const amazonUrlResult = getAmazonUrl("catalogs");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);
    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("catalogs");
      await getMenuList(requiredUrl?.get_url);
    } else {
      await getMenuList();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setActiveLoading(id);
    const apiData = {
      method: "delete",
      url:
        BASE_URL +
        "api/menu/menu-upload/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/" +
        id +
        "/",
    };
    const response = await globalApiHandler(apiData);

    if (response?.status) {
      handleCatlogList();
    }
    setActiveLoading(null);
  };

  useEffect(() => {
    handleCatlogList();
  }, []);

  //   const [selectedCatalog, setSelectedCatalog] = useState(null);
  // console.log(selectedCatalog,'selectedCatalog')
  // Function to handle click on menuCatalogList name
  const handleCatalogClick = (name, id) => {
    setSelectedCatalog({ name, id });
  };

  // Function to get menuCatalogList name based on item ID
  const getCatalog = (itemId) => {
    // Iterate over catalogs to find a matching ID
    for (const catalogItem of menuCatalogList.response.catalogs) {
      if (itemId?.startsWith(catalogItem.id)) {
        return catalogItem; // Return the menuCatalogList item if ID matches
      }
    }
    return null; // Return null if no matching menuCatalogList ID is found
  };

  // Find the name and ID for the first item in each grouped item array
  const catalogList = Object.values(itemGroupList)
    .map((group) => {
      const firstItemId = group?.grouped_item?.[0];
      if (firstItemId) {
        return getCatalog(firstItemId);
      }
      return null;
    })
    .filter((menuCatalogList) => menuCatalogList !== null);

  // Filter out null values

  return (
    <>
      <CustomTitle heading={"Menu list"} />

      <div className="row pb-5">
        <div className="col-7">
          {isLoading ? (
            <VerticalListShimmer />
          ) : (
            <ListGroup>
              {catalogList.map((catalog) => (
                <ListGroup.Item key={catalog.id}>
                  <div className="d-flex align-items-center justify-content-between gap-3 cursor-pointer">
                    <div
                      key={catalog.id}
                      onClick={() =>
                        handleMenuListCatalogClick(catalog.name, catalog.id)
                      }
                      className="listNameText"
                    >
                      {catalog.name}
                    </div>
                    {/* <div>
                      {activeLoading === menu?.id ? (
                        <Spinner />
                      ) : (
                        <MdDelete
                          onClick={() => handleDelete(menu?.id)}
                          color={themeColor.primary}
                        />
                      )}
                    </div> */}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>
    </>
  );
}

export default GroupedItemMemuList;

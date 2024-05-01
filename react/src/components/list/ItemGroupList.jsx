import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import axios from "axios";
import Spinner from "../loaders/Spinner";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useItemGroup } from "../../utilis/useItemGroup";
import { getItemGroup } from "../../store/itemGroupSlice";

function ItemGroupList() {
  const itemGroupDetails = useSelector((state) => state.itemGroupData.data);

  const getItemGroupList = useItemGroup();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(null);

  const handleDeleteGroup = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(itemGroupDetails));

    if (!copiedObj) {
      return;
    }
    copiedObj?.itemGroup?.splice(index, 1);

    let groupUrl = null;
    groupUrl = getAmazonUrl("iteamgroup");
    const isNotExpired = amazonUrlExpiryChecker(groupUrl?.expiry);

    if (!isNotExpired) {
      groupUrl = await fetchAmazonBucketUrls("iteamgroup");
    }

    const response = await axios.put(groupUrl?.url?.put_url, copiedObj);

    if (response?.status === 200) {
      dispatch(getItemGroup(copiedObj));
    }
    setIsDelete(null);
  };

  useEffect(() => {
    getItemGroupList(setIsLoading);
  }, []);
  return (
    <>
      <CustomTitle heading={"Group list"} />
      {isLoading ? (
        <VerticalListShimmer />
      ) : (
        <div className="animeBottomToTop">
          {itemGroupDetails?.itemGroup?.length ? (
            <ListGroup as={"ol"} numbered>
              {itemGroupDetails?.itemGroup?.map((grp, index) => (
                <ListGroup.Item
                  key={grp?.id}
                  as={"li"}
                  className="d-flex align-items-center gap-3 justify-content-start"
                >
                  <div className="d-grid">
                    <div
                      style={{ fontSize: "14px" }}
                      className="primary-text fw-medium"
                    >
                      {grp?.name}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="d-flex gap-2">
                      {isDelete === grp?.id ? (
                        <Spinner />
                      ) : (
                        <MdDelete
                          color={themeColor.primary}
                          onClick={() => {
                            setIsDelete(grp?.id);
                            handleDeleteGroup(index);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <NotFound />
          )}
        </div>
      )}
    </>
  );
}

export default ItemGroupList;

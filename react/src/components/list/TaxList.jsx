import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import { useTaxList } from "../../utilis/useTaxList";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { handleTaxList } from "../../store/taxSlice";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import axios from "axios";
import Spinner from "../loaders/Spinner";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import TaxExpressionModal from "../modals/BillTaxModal";
import { handleRemoveExpression } from "../../store/menuSlice";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";

function TaxList() {
  const taxDetails = useSelector((state) => state.taxData.data);
  const operationDetails = useSelector((state) => state.operationData.data);
  const itemGroupDetails = useSelector((state) => state.itemGroupData.data);

  const getTaxList = useTaxList();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const updateMenu = useUpdateMenu();

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [selectedTaxIndex, setSelectedTaxIndex] = useState(null);
  const [selectedTaxData, setSelectedTaxData] = useState(null);
  const [isTaxDelete, setIsTaxDelete] = useState(false);

  const getGroupItems = (id) => {
    const filteredData = itemGroupDetails?.itemGroup.find(
      (item) => item?.id === id
    );

    if (filteredData) {
      return filteredData?.items;
    }
  };

  const removeExpression = (data) => {
    dispatch(
      handleRemoveExpression({
        itemIds: getGroupItems(data?.itemGroup),
        expressionId: data?.expression,
        expressionType: "taxExpressions",
      })
    );
    setIsTaxDelete(true);
  };

  const handleDeleteTax = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(taxDetails));

    if (!copiedObj) {
      return;
    }
    copiedObj?.["tax&charges"]?.splice(index, 1);

    let taxUrl = null;
    taxUrl = getAmazonUrl("tax&charges");
    const isNotExpired = amazonUrlExpiryChecker(taxUrl?.expiry);

    if (!isNotExpired) {
      taxUrl = await fetchAmazonBucketUrls("tax&charges");
    }

    const response = await axios.put(taxUrl?.url?.put_url, copiedObj);

    if (response?.status === 200) {
      const payload = {
        catalogId: getGroupItems(selectedTaxData?.itemGroup)?.[0]?.split(
          "_"
        )[0],
      };
      await updateMenu(payload);
      dispatch(handleTaxList(copiedObj));
    }
    setIsDelete(null);
    setIsTaxDelete(false);
  };

  useEffect(() => {
    getTaxList(setIsLoading);
  }, []);

  useEffect(() => {
    isTaxDelete && handleDeleteTax(selectedTaxIndex);
  }, [isTaxDelete]);
  return (
    <>
      <CustomTitle heading={"Item Tax list"} />
      {isLoading ? (
        <VerticalListShimmer />
      ) : (
        <div className="animeBottomToTop">
          {taxDetails?.["tax&charges"]?.length ? (
            <ListGroup as={"ol"} numbered>
              {taxDetails?.["tax&charges"]?.map((exp, index) => (
                <ListGroup.Item
                  key={exp?.id}
                  as={"li"}
                  className="d-flex align-items-center gap-3 justify-content-start"
                >
                  <div className="d-grid">
                    <div
                      style={{ fontSize: "14px" }}
                      className="primary-text fw-medium"
                    >
                      {exp?.name}
                    </div>
                    <div
                      style={{ fontSize: "12px" }}
                      className="secondary-text"
                    >
                      {
                        operationDetails?.expressions?.find(
                          (item) => item.expression_id === exp?.expression
                        )?.expression
                      }
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="d-flex gap-2">
                      {isDelete === exp?.id ? (
                        <Spinner />
                      ) : (
                        <MdDelete
                          color={themeColor.primary}
                          onClick={() => {
                            setIsDelete(exp?.id);
                            setSelectedTaxIndex(index);
                            removeExpression(exp);
                            setSelectedTaxData(exp);
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

export default TaxList;

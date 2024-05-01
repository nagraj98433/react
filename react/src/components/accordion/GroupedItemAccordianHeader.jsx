import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import AddonGrpEditableText from "./AddonGrpEditableText";
import AddonItemTable from "./AddonItemTable";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { handleAddOnDeleteGroup } from "../../store/addOnCatalogSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import AddOnUpdateModal from "../modals/AddOnUpdateModal";
import { useParams } from "react-router-dom";

function GroupedItemAccordianHeader({ data }) {
  const addonDetails = useSelector((state) => state.addOnData.data);

  const userDetails = useSelector((state) => state.userData.data);
  const outletId = useSelector((state) => state.activeItemData.restaurantId);

  const dispatch = useDispatch();
  const apiHandler = useGlobalApiHandler();
  const params = useParams();

  const [productData, setProductData] = useState([]);
  const [addonDelete, setAddonDelete] = useState(false);
  const [isAddOnUpdate, setAddOnUpdate] = useState(false);

  const handleDelete = (e, data) => {
    e.stopPropagation();
    setAddOnUpdate(true);
    const payload = {
      type: "group_list",
      value: data[0],
    };
    dispatch(handleAddOnDeleteGroup(payload));
    setAddonDelete(true);
  };
  const handledeleteUpdate = async () => {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/addon/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/",
    };

    const response = await apiHandler(apiData);
    if (!response?.success) {
      return toast.error(response?.message);
    }
    await axios.put(response?.data?.addon_update, addonDetails);
    setAddOnUpdate(false);
    setAddonDelete(false);
  };
  const getItems = () => {
    if (!addonDetails) return;

    let productList = [];

    Object.keys(addonDetails).map((addonKey) => {
      const filteredProducts = addonDetails[addonKey]?.add_on.filter(
        (addon) => {
          return addon?.addon_name_id?.includes(data[0]?.addon_group_id);
        }
      );
      let newobj = {
        data: filteredProducts,
        code: addonKey,
        addonGroupId: data[0]?.addon_group_id,
      };
      productList.push(newobj);
    });
    setProductData(productList);
  };

  useEffect(() => {
    getItems();
  }, [data]);
  useEffect(() => {
    addonDelete && handledeleteUpdate();
  }, [addonDelete]);
  return (
    <>
      <AddOnUpdateModal show={isAddOnUpdate} />
      <div>
        <Accordion.Item eventKey={data[0]?.addon_group_id}>
          <Accordion.Header>
            <div className="row w-100">
              {data &&
                data.map((grp, i) => {
                  return (
                    <>
                      <input type="checkbox" />
                      <AddonGrpEditableText data={grp} key={i} />
                    </>
                  );
                })}
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <AddonItemTable data={productData} />
          </Accordion.Body>
        </Accordion.Item>
      </div>
    </>
  );
}

export default GroupedItemAccordianHeader;

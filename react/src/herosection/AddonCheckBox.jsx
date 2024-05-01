import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import useIdGenerator from "../utilis/useIdGenerator";
import { getItemGroup } from "../store/itemGroupSlice";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import axios from "axios";

function AddonCheckbox({ addons, gropedItem }) {
  const itemchecked = useSelector((state) => state.itemGroupData.data);

  const [checkedAddons, setCheckedAddons] = useState({});
  const [saveGroup, setSaveGroup] = useState(false);
  const [primaryLang, setPrimaryLang] = useState("");

  const [generateId, setGenerateId] = useIdGenerator();
  const getAmazonUrl = useAmazonUrl();

  const dispatch = useDispatch();

  const handleGroupCheckboxChange = (event, groupId) => {
    const { checked } = event.target;
    const updatedCheckedAddons = { ...checkedAddons };

    addons?.[primaryLang]?.add_on.forEach((addon) => {
      if (addon.addon_name_id.startsWith(groupId)) {
        updatedCheckedAddons[addon.addon_name_id] = checked;
      }
    });

    setCheckedAddons(updatedCheckedAddons);
  };

  const handleAddonChange = (event, addonId, groupId) => {
    const { checked } = event.target;
    setCheckedAddons((prevCheckedAddons) => ({
      ...prevCheckedAddons,
      [addonId]: checked,
    }));
  };

  const handleSave = () => {
    const selectedAddons = Object.keys(checkedAddons).filter(
      (addonId) => checkedAddons[addonId]
    );

    if (gropedItem.name == "") {
      toast.error("Group name cannot be empty");
      return;
    }
    let finalData = [];
    setGenerateId();

    finalData.push({
      group_id: generateId,
      group_name: gropedItem,
      ids: selectedAddons,
    });

    dispatch(getItemGroup(finalData));
    setSaveGroup(true);
  };
  const handleSaveApi = async () => {
    const amazonUrlData = getAmazonUrl("iteamgroup");
    const response = await axios.put(amazonUrlData?.url?.put_url, itemchecked);
    if (response?.status == 200) {
      toast.success("Item group added successfully");
    }
    setSaveGroup(false);
  };
  useEffect(() => {
    saveGroup && handleSaveApi();
  }, [saveGroup]);
  useEffect(() => {
    if (addons) {
      const firstKey = Object.keys(addons)[0];
      setPrimaryLang(firstKey);
    }
  }, [addons]);

  return (
    <div>
      <Accordion>
        {addons?.[primaryLang]?.group_list?.map((addonGroup) => (
          <Accordion.Item
            key={addonGroup.addon_group_id}
            eventKey={addonGroup.addon_group_id}
          >
            <Accordion.Header>
              <input
                type="checkbox"
                onChange={(e) =>
                  handleGroupCheckboxChange(e, addonGroup.addon_group_id)
                }
              />
              {addonGroup?.addon_group} {/* Display addon group name */}
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                {/* Display addon list for the current group */}
                {addons?.[primaryLang]?.add_on.map(
                  (addon) =>
                    addon?.addon_name_id?.startsWith(
                      addonGroup?.addon_group_id
                    ) && (
                      <div key={addon?.addon_name_id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={
                              checkedAddons[addon?.addon_name_id] || false
                            }
                            onChange={(e) =>
                              handleAddonChange(
                                e,
                                addon?.addon_name_id,
                                addonGroup?.addon_group_id
                              )
                            }
                          />
                          {addon?.addon_name} - ${addon?.addon_price}
                        </label>
                      </div>
                    )
                )}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default AddonCheckbox;

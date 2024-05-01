import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

function AddonGroupAccordionBody({ catId, selectedItems, setSelectedItems }) {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );

  const addonFirstKey = Object.keys(addonOverallDetails)[0];

  const [itemList, setItemList] = useState([]);

  const getItems = () => {
    let filteredItem = addonOverallDetails[addonFirstKey]?.add_on.filter(
      (item) => {
        return item?.addon_name_id?.includes(catId);
      }
    );

    setItemList(filteredItem);
  };

  const handleChange = (e, id) => {
    if (e.target.checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      let newArray = selectedItems.filter((item) => item !== id);
      setSelectedItems(newArray);
    }
  };

  useEffect(() => {
    getItems();
  }, [catId]);
  return (
    <Accordion.Body>
      {itemList.length
        ? itemList.map((item) => (
            <Form.Check
              style={{ fontSize: "12px" }}
              key={item?.addon_name_id}
              label={item?.addon_name}
              className="text-truncate"
              onChange={(e) => handleChange(e, item?.addon_name_id)}
              checked={selectedItems?.includes(item?.addon_name_id)}
            />
          ))
        : ""}
    </Accordion.Body>
  );
}

export default AddonGroupAccordionBody;

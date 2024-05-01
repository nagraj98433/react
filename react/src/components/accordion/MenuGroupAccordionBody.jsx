import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

function MenuGroupAccordionBody({ catId, selectedItems, setSelectedItems }) {
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);

  const menuFirstKey = Object.keys(menuOverallDetails)[0];

  const [itemList, setItemList] = useState([]);

  const getItems = () => {
    let filteredItem = menuOverallDetails[menuFirstKey]?.product.filter(
      (item) => {
        return item?.product_id?.includes(catId);
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
              key={item?.product_id}
              label={item?.product_name}
              className="text-truncate"
              onChange={(e) => handleChange(e, item?.product_id)}
              checked={selectedItems?.includes(item?.product_id)}
            />
          ))
        : ""}
    </Accordion.Body>
  );
}

export default MenuGroupAccordionBody;

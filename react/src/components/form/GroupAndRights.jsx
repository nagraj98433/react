import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

function GroupAndRights({
  setNodeData,
  nodeData,
  position,
  grpArry,
  setIsEmpty,
}) {
  const [form, setForm] = useState({
    node_group: "",
    node_rights: [],
  });
  const [nodeRights, setNodeRights] = useState([]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "13px",
    }),
  };

  const handleRightsChange = (e) => {
    let rightsArray = [];
    for (let i = 0; i < e.length; i++) {
      rightsArray.push(e[i]?.value);
    }
    setForm((prev) => ({ ...prev, node_rights: rightsArray }));
  };

  const lvlAccessArry = [
    { value: "Read ", label: "Read" },
    { value: "Update", label: "Update" },
    { value: "Delete", label: "Delete" },
    { value: "Accept", label: "Accept" },
  ];

  const handleChange = () => {
    let newArray = [...nodeData?.node_group];
    newArray[position] = form;
    setNodeData((prev) => ({ ...prev, node_group: newArray }));
  };

  useEffect(() => {
    handleChange();
  }, [form]);
  return (
    <>
      <Form.Group className="col-lg-3 col-md-6 col-12 px-2 animeLeftToRight">
        <Form.Label className="primary-text fw-medium formLabelText">
          Select group
        </Form.Label>
        <Select
          className="customInputBoxText"
          menuPortalTarget={document.body}
          styles={customStyles}
          options={grpArry}
          value={grpArry.find((grp) => grp.value?.id === form.node_group?.id)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              node_group: {
                id: e?.value?.id,
                staffs: e?.value?.groupStaffs,
              },
            }))
          }
          onBlur={(e) => {
            setIsEmpty(e.target.value ? false : true);
          }}
        />
        <Form.Control.Feedback></Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="col-lg-3 col-md-6 col-12 px-2 animeLeftToRight">
        <Form.Label className="primary-text fw-medium formLabelText">
          Select rights
        </Form.Label>
        <Select
          className="customInputBoxText"
          menuPortalTarget={document.body}
          isMulti
          styles={customStyles}
          options={lvlAccessArry}
          value={nodeRights}
          onChange={(e) => {
            handleRightsChange(e);
            setNodeRights(e);
          }}
          onBlur={(e) => {
            setIsEmpty(nodeRights?.length ? false : true);
          }}
        />
        <Form.Control.Feedback></Form.Control.Feedback>
      </Form.Group>
    </>
  );
}

export default GroupAndRights;

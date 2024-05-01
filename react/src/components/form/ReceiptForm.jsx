import React, { useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DraggableButton from "../buttons/DraggableButton";
import { Form, ListGroup } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { useDispatch } from "react-redux";
import { handleDragDrop, handleShuffle } from "../../store/receiptContentSlice";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import CustomListItem from "../list/ListItem";
import { MdDelete, MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";

function ReceiptForm() {
  const [showHeaderForm, setShowHeaderForm] = useState(true);
  const [showFooterForm, setShowFooterForm] = useState(false);
  const [showBodyForm, setShowBodyForm] = useState(false);

  const draggableHeaderContent = useSelector(
    (state) => state.receiptContentData.headerContentList
  );
  const droppableHeaderContent = useSelector(
    (state) => state.receiptContentData.headerContent
  );
  const draggableFooterContent = useSelector(
    (state) => state.receiptContentData.footerContentList
  );

  const droppableFooterContent = useSelector(
    (state) => state.receiptContentData.footerContent
  );

  const draggableBodyContent = useSelector(
    (state) => state.receiptContentData.bodyContentList
  );

  const droppableBodyContent = useSelector(
    (state) => state.receiptContentData.bodyContent
  );

  const dispatch = useDispatch();
  const apiHandler = useGlobalApiHandler();
  const params = useParams();

  const handleHeaderCheckboxChange = () => {
    setShowHeaderForm(true);
    setShowFooterForm(false);
    setShowBodyForm(false);
  };

  const handleFooterCheckboxChange = () => {
    setShowHeaderForm(false);
    setShowFooterForm(true);
    setShowBodyForm(false);
  };

  const handleBodyCheckboxChange = () => {
    setShowHeaderForm(false);
    setShowFooterForm(false);
    setShowBodyForm(true);
  };
  const [headerForm, setHeaderForm] = useState({
    name: "",
    value: "",
  });
  const [isHeaderInvalid, setIsHeaderInvalid] = useState({
    name: false,
    value: false,
  });
  const [bodyForm, setBodyForm] = useState({
    name: "",
    value: "",
  });
  const [isBodyInvalid, setIsBodyInvalid] = useState({
    name: false,
    value: false,
  });
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;

    setHeaderForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleBodyChange = (e) => {
    const { name, value } = e.target;

    setBodyForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleValidation = () => {
    const validations = {
      name: !headerForm.name.length,
      value: !headerForm.value.length,
    };
    setIsHeaderInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const createHeaderContent = async () => {
    const data = {
      outlet_uuid: params?.outletId,
      header: [
        {
          name: headerForm.name,
          value: headerForm.value,
        },
      ],
    };

    const apiData = {
      method: "post",
      url: BASE_URL + "api/receipt/header/create/",
      data: data,
    };

    const response = await apiHandler(apiData);

    console.log(response);
  };

  const handleHeaderSubmit = () => {
    const frontendValidation = handleValidation();
    frontendValidation && createHeaderContent();
  };
  const handleBodySubmit = () => {
    // handleBodyChange("body", bodyForm, setBodyForm, setIsBodyInvalid);
  };
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // if the button drops into random the area
    if (!destination) return;

    // if user drag the button and drop it on same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index !== source.index
    ) {
      dispatch(
        handleShuffle({
          currentIndex: source.index,
          updatedIndex: destination.index,
          destination: destination.droppableId,
        })
      );
    } else {
      dispatch(
        handleDragDrop({
          index: source.index,
          source: source.droppableId,
          destination: destination.droppableId,
        })
      );
    }

    // main functionality
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="row g-0">
        {/* Drop areas */}
        <div className="col-12 ">
          <div className="row mx-3 pb-5">
            <div className="d-flex justify-content-between">
              <div>
                <Form.Check
                  type="radio"
                  id="headercheckbox"
                  checked={showHeaderForm}
                  onChange={handleHeaderCheckboxChange}
                  label="Customize header content"
                />
              </div>
              <div>
                <Form.Check
                  type="radio"
                  id="bodycheckbox"
                  checked={showBodyForm}
                  onChange={handleBodyCheckboxChange}
                  label="Customize body content"
                />
              </div>
              <div>
                <Form.Check
                  type="radio"
                  id="footercheckbox"
                  checked={showFooterForm}
                  onChange={handleFooterCheckboxChange}
                  label="Customize footer content"
                />
              </div>
            </div>
            <div className="col-lg-12 d-flex justify-content-center">
              {showHeaderForm && (
                <div className="col-12 col-lg-6 col-md-6 mb-2 mt-2 ">
                  <CustomTitle heading={"Customise header content"} />

                  <div className="rounded border p-2 dragAndDropContainer d-flex justify-content-center flex-column">
                    <div className="row pb-2 mb-2 g-0 align-items-center border-bottom bg-white">
                      <div className="col-5 px-1">
                        <Form.Group>
                          <Form.Control
                            className="customInputBoxText"
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={headerForm.name}
                            onChange={handleHeaderChange}
                            isInvalid={isHeaderInvalid.name}
                          />
                          <Form.Control.Feedback
                            style={{ fontSize: "11px" }}
                            type="invalid"
                          >
                            Please enter name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-5 px-1">
                        <Form.Group>
                          <Form.Control
                            className="customInputBoxText"
                            type="text"
                            placeholder="Enter value"
                            name="value"
                            value={headerForm.value}
                            onChange={handleHeaderChange}
                            isInvalid={isHeaderInvalid.value}
                          />
                          <Form.Control.Feedback
                            style={{ fontSize: "11px" }}
                            type="invalid"
                          >
                            Please enter value.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-2 px-1">
                        <CustomButton
                          name={"Save"}
                          bgColor={themeColor.primary}
                          handleClick={handleHeaderSubmit}
                        />
                      </div>
                    </div>
                    <li className="fw-medium primary-text ps-1 formLabelText mt-1">
                      Draggable content
                    </li>
                    <Droppable droppableId="headerContentList">
                      {(provided, snapshot) => (
                        <div
                          className="p-2"
                          style={{
                            backgroundColor:
                              snapshot.isDraggingOver && "#f3f3f3",
                          }}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {draggableHeaderContent &&
                            draggableHeaderContent.map((content, index) => {
                              return (
                                <Draggable
                                  key={content.id}
                                  draggableId={content.id}
                                  index={index}
                                >
                                  {(dragProvided, snapshotChild) => (
                                    <div
                                      className="mb-2"
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      {...dragProvided.dragHandleProps}
                                    >
                                      <DraggableButton
                                        name={content.name}
                                        isUpdate={true}
                                        bgColor={
                                          snapshotChild.isDragging
                                            ? themeColor.primary
                                            : themeColor.accent
                                        }
                                        color={
                                          snapshotChild.isDragging
                                            ? themeColor.accent
                                            : themeColor.primary
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <Droppable droppableId="headerContent">
                      {(provided) => (
                        <div
                          style={{
                            border: `1px dashed ${themeColor.primary}`,
                          }}
                          className="rounded mt-auto"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="formLabelText text-center py-3">
                            Drag & drop above content here
                          </div>
                          {droppableHeaderContent &&
                            droppableHeaderContent.map((content, index) => {
                              return (
                                <Draggable
                                  key={content.id}
                                  draggableId={content.id}
                                  index={index}
                                >
                                  {(dragProvided, snapshotChild) => (
                                    <div
                                      className="mb-2 px-2"
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      {...dragProvided.dragHandleProps}
                                    >
                                      <DraggableButton
                                        name={content.name}
                                        bgColor={
                                          snapshotChild.isDragging
                                            ? themeColor.accent
                                            : themeColor.primary
                                        }
                                        color={
                                          snapshotChild.isDragging
                                            ? themeColor.textPrimary
                                            : themeColor.accent
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              )}
              {showFooterForm && (
                <div className="col-12 col-lg-6 col-md-6 mb-2 mt-2">
                  <CustomTitle heading={"Customise footer content"} />
                  <div className="rounded border d-flex flex-column p-2 dragAndDropContainer">
                    <div className="row pb-2 mb-2 g-0 align-items-center border-bottom bg-white">
                      <div className="col-5 px-1">
                        <Form.Control
                          className="customInputBoxText"
                          type="text"
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="col-5 px-1">
                        <Form.Control
                          className="customInputBoxText"
                          type="text"
                          placeholder="Enter value"
                        />
                      </div>
                      <div className="col-2 px-1">
                        <CustomButton
                          name={"Save"}
                          bgColor={themeColor.primary}
                        />
                      </div>
                    </div>

                    <Droppable droppableId="footerContentList">
                      {(provided, snapshot) => (
                        <div
                          style={{
                            backgroundColor:
                              snapshot.isDraggingOver && "#f3f3f3",
                          }}
                          className="p-2"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {draggableFooterContent &&
                            draggableFooterContent.map((content, index) => {
                              return (
                                <Draggable
                                  key={content.id}
                                  draggableId={content.id}
                                  index={index}
                                >
                                  {(dragProvided, snapshotChild) => (
                                    <div
                                      className="mb-2"
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      {...dragProvided.dragHandleProps}
                                    >
                                      <DraggableButton
                                        name={content.name}
                                        isUpdate={true}
                                        bgColor={
                                          snapshotChild.isDragging
                                            ? themeColor.primary
                                            : themeColor.accent
                                        }
                                        color={
                                          snapshotChild.isDragging
                                            ? themeColor.accent
                                            : themeColor.primary
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <Droppable droppableId="footerContent">
                      {(provided) => (
                        <div
                          style={{
                            border: `1px dashed ${themeColor.primary}`,
                          }}
                          className="rounded mt-auto"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="formLabelText text-center py-3">
                            Drag & drop above content here
                          </div>
                          {droppableFooterContent &&
                            droppableFooterContent.map((content, index) => {
                              return (
                                <Draggable
                                  key={content.id}
                                  draggableId={content.id}
                                  index={index}
                                >
                                  {(dragProvided, snapshot) => (
                                    <div
                                      className="mb-2 px-2"
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      {...dragProvided.dragHandleProps}
                                    >
                                      <DraggableButton
                                        name={content.name}
                                        bgColor={
                                          snapshot.isDragging
                                            ? themeColor.accent
                                            : themeColor.primary
                                        }
                                        color={
                                          snapshot.isDragging
                                            ? themeColor.textPrimary
                                            : themeColor.accent
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              )}
              {showBodyForm && (
                <div className="d-flex justify-content-between">
                  <div className="col-12 col-lg-6 col-md-6 mb-2 mt-2">
                    <CustomTitle heading={"Customise body content"} />
                    <div className="rounded border p-2 dragAndDropContainer d-flex flex-column">
                      <div className="row pb-2 mb-2 g-0 align-items-center border-bottom bg-white">
                        <div className="col-5 px-1">
                          <Form.Control
                            className="customInputBoxText"
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={bodyForm.name}
                            onChange={handleBodyChange}
                            isInvalid={isBodyInvalid.name}
                          />
                          <Form.Control.Feedback
                            style={{ fontSize: "11px" }}
                            type="invalid"
                          >
                            Please enter name.
                          </Form.Control.Feedback>
                        </div>
                        <div className="col-5 px-1">
                          <Form.Control
                            className="customInputBoxText"
                            type="text"
                            placeholder="Enter value"
                            name="value"
                            value={bodyForm.value}
                            onChange={handleBodyChange}
                            isInvalid={isBodyInvalid.value}
                          />
                          <Form.Control.Feedback
                            style={{ fontSize: "11px" }}
                            type="invalid"
                          >
                            Please enter value.
                          </Form.Control.Feedback>
                        </div>
                        <div className="col-2 px-1">
                          <CustomButton
                            name={"Save"}
                            bgColor={themeColor.primary}
                            handleClick={handleBodySubmit}
                          />
                        </div>
                      </div>
                      <li className="fw-medium primary-text ps-1 formLabelText mt-1">
                        Draggable content
                      </li>
                      <Droppable droppableId="bodyContentList">
                        {(provided, snapshot) => (
                          <div
                            className="p-2"
                            style={{
                              backgroundColor:
                                snapshot.isDraggingOver && "#f3f3f3",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {draggableBodyContent &&
                              draggableBodyContent.map((content, index) => {
                                return (
                                  <Draggable
                                    key={content.id}
                                    draggableId={content.id}
                                    index={index}
                                  >
                                    {(dragProvided, snapshotChild) => (
                                      <div
                                        className="mb-2"
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                      >
                                        <DraggableButton
                                          name={content.name}
                                          isUpdate={true}
                                          bgColor={
                                            snapshotChild.isDragging
                                              ? themeColor.primary
                                              : themeColor.accent
                                          }
                                          color={
                                            snapshotChild.isDragging
                                              ? themeColor.accent
                                              : themeColor.primary
                                          }
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Droppable droppableId="bodyContent">
                        {(provided) => (
                          <div
                            style={{
                              border: `1px dashed ${themeColor.primary}`,
                            }}
                            className="rounded mt-auto"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <div className="formLabelText text-center py-3">
                              Drag & drop above content here
                            </div>
                            {droppableBodyContent &&
                              droppableBodyContent.map((content, index) => {
                                return (
                                  <Draggable
                                    key={content.id}
                                    draggableId={content.id}
                                    index={index}
                                  >
                                    {(dragProvided, snapshotChild) => (
                                      <div
                                        className="mb-2 px-2"
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                      >
                                        <DraggableButton
                                          name={content.name}
                                          bgColor={
                                            snapshotChild.isDragging
                                              ? themeColor.accent
                                              : themeColor.primary
                                          }
                                          color={
                                            snapshotChild.isDragging
                                              ? themeColor.textPrimary
                                              : themeColor.accent
                                          }
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                  <div className="col-12 col-lg-5 col-md-6 mb-2 mt-2">
                    <CustomTitle heading={"Editable body content"} />
                    <div className="rounded border p-2 dragAndDropContainer d-flex flex-column">
                      <ListGroup>
                        <CustomListItem
                          itemName="Item"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="QTY"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Rate"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Total"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Sub Total"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Discount"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Service Fees"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Tip"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Grant Total"
                          // onEdit={""}
                        />
                        <CustomListItem
                          itemName="Amount Paid"
                          // onEdit={""}
                        />
                      </ListGroup>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default ReceiptForm;

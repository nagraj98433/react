import React, { useEffect } from "react";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import { themeColor } from "../utilis/constants";
import { Form } from "react-bootstrap";
import CustomButton from "../components/buttons/CustomButton";
import Select from "react-select";
import { SiMicrosoftexcel } from "react-icons/si";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

function Report() {
  const breadcrumb = useBreadcrumbData();

  const roles = [
    { value: "Role 1", label: "Role 1" },
    { value: "Role 2", label: "Role 2" },
    { value: "Role 3", label: "Role 3" },
    { value: "Role 4", label: "Role 4" },
  ];

  useEffect(() => {
    breadcrumb("report");
  }, []);
  return (
    <>
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage Report"} />
      <div className="heroContainerMargin">
        <div className="row g-3 mb-2">
          <div className="col-3 mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              From Date Time
            </Form.Label>
            <Form.Control
              type="datetime-local"
              className="customInputBoxText"
            />
          </div>
          <div className="col-3 mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              To Date Time
            </Form.Label>
            <Form.Control
              type="datetime-local"
              className="customInputBoxText"
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="primary-text fw-medium">Advance search filters</div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Category
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Category"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Sub Category
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Sub Category"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Food Item
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Search Item"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                QR
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Search QR"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Paid By
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Paid By"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
          <div className="col-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Order Status
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Order Status"
                options={roles}
                isMulti
              />
            </Form.Group>
          </div>
        </div>
        <div className="row g-3">
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <CustomButton name={"Search"} bgColor={themeColor.primary} />
            <CustomButton name={"Reset"} bgColor={themeColor.primary} />
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CustomButton
              name={"Download Report"}
              bgColor={themeColor.primary}
              preIcon={<SiMicrosoftexcel />}
            />
          </div>
          <div className="col-md-12">
            <table className="custom-table table table-bordered table-hover table-responsive mb-2 pb-4">
              <thead>
                <tr>
                  <th className="customTableTh">Sr.No</th>
                  <th className="customTableTh">Table Name</th>
                  <th className="customTableTh">Bill ID</th>
                  <th className="customTableTh">Operator</th>
                  <th className="customTableTh">Category</th>
                  <th className="customTableTh">Sub Category</th>
                  <th className="customTableTh">Item</th>
                  <th className="customTableTh">Item Count</th>
                  <th className="customTableTh">Item Cost</th>
                  <th className="customTableTh">Item Tax</th>
                  <th className="customTableTh">Total Cost</th>
                  <th className="customTableTh">Order Date Time</th>
                  <th className="customTableTh">Settled By</th>
                  <th className="customTableTh">Paid By</th>
                  <th className="customTableTh">Order Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="customTableTd">1</td>
                  <td className="customTableTd">aa2</td>
                  <td className="customTableTd">122</td>
                  <td className="customTableTd">abc</td>
                  <td className="customTableTd">veg</td>
                  <td className="customTableTd">starter</td>
                  <td className="customTableTd">veg crispy</td>
                  <td className="customTableTd">1</td>
                  <td className="customTableTd">555</td>
                  <td className="customTableTd">2%</td>
                  <td className="customTableTd">560</td>
                  <td className="customTableTd">01-01-2023 11:00</td>
                  <td className="customTableTd">cash</td>
                  <td className="customTableTd">aabb</td>
                  <td className="customTableTd">completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;

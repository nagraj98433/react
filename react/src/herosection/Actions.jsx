import React, { useEffect } from "react";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import Table from "react-bootstrap/Table";
import CustomHeading from "../components/heading/CustomHeading";
import { Form } from "react-bootstrap";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

export default function Actions() {
  const breadcrumb = useBreadcrumbData();

  const UserActivities = [
    {
      id: 1,
      role: "Manager",
      date: "2024-01-12",
      time: "12:30 PM",
      activity: "Waiter role changed",
    },
    {
      id: 2,
      role: "Cashier",
      date: "2024-01-12",
      time: "01:45 PM",
      activity: "created table group",
    },
    {
      id: 3,
      role: "Manger",
      date: "2024-01-12",
      time: "01:45 PM",
      activity: "Assign table 1 to waiter 2",
    },
    {
      id: 4,
      role: "Waiter2",
      date: "2024-01-12",
      time: "01:45 PM",
      activity: "Receive cash payment at table3",
    },
    {
      id: 5,
      role: "Waiter3",
      date: "2024-01-12",
      time: "01:45 PM",
      activity: "created table group",
    },
  ];

  useEffect(() => {
    breadcrumb("action");
  }, []);

  return (
    <div className="overflow-auto customscrollbar h-100">
      <CustomBreadCrumb />
      <CustomHeading heading={"User Activity"} />
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
        <div className="col-md-12">
          <Table className="custom-table table table-bordered table-hover table-responsive mb-2 pb-4">
            <thead>
              <tr>
                <th className="activityTableTh">Sr.No</th>
                <th className="activityTableTh">User Name</th>
                <th className="activityTableTh">Date</th>
                <th className="activityTableTh">Time</th>
                <th className="activityTableTh">Activity</th>
              </tr>
            </thead>
            <tbody>
              {UserActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="activityTableTd">{activity.id}</td>
                  <td className="activityTableTd">{activity.role}</td>
                  <td className="activityTableTd">{activity.date}</td>
                  <td className="activityTableTd">{activity.time}</td>
                  <td className="activityTableTd">{activity.activity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import DataTable from "./DataTable";
import AdminSettings from "./AdminSettings";

const AdminContent = ({ applicants, deadline, accessRequests }) => {
  return <div className="admin-content"><AdminSettings initialDeadline={deadline} initialRequests={accessRequests} /><DataTable data={applicants} /></div>;
};

export default AdminContent;

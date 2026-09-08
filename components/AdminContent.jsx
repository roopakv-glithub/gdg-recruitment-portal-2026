"use client";
import React, { useState } from "react";
import DataTable from "./DataTable";
import AdminSettings from "./AdminSettings";
import AdminStats from "./AdminStats";

const AdminContent = ({ applicants, deadline, accessRequests }) => {
  const [currentApplicants, setCurrentApplicants] = useState(applicants);
  return <div className="admin-content"><AdminStats applicants={currentApplicants} /><AdminSettings initialDeadline={deadline} initialRequests={accessRequests} /><DataTable data={currentApplicants} onDataChange={setCurrentApplicants} /></div>;
};

export default AdminContent;

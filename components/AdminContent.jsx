"use client";
import React from "react";
import DataTable from "./DataTable";

const AdminContent = ({ applicants }) => {
  return <DataTable data={applicants} />;
};

export default AdminContent;

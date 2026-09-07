"use client";
import { React, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterDepartment from "./FilterDepartment";
import FilterShortlisted from "./FilterShortlisted";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";
import { CheckBoxComp } from "./CheckBoxComp";
import { toast } from "sonner";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
} from "react-table";
import { Input } from "@/components/ui/input";
import PaginationComp from "./PaginationComp";
import DialogComp from "./DialogComp";
import { CSVLink } from "react-csv";
import { CSV_Header } from "@/constants";

const DataTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  const [deptFiltered, setDeptFiltered] = useState(data);
  const [shortFiltered, setShortFiltered] = useState(data);
  const commonElements = (arr1, arr2) => {
    const ids = new Set(arr2.map((item) => item._id));
    return arr1.filter((item) => ids.has(item._id));
  };

  const filterFunc = (dept) => {
    setDeptFiltered(data);
    const filteredData = data.filter((data) => {
      return data.Department === dept;
    });

    setDeptFiltered(filteredData);
  };

  const shortlistedFilterFunc = (status) => {
    const filteredData = data.filter((data) => {
      return String(data.shortlisted) === status;
    });

    setShortFiltered(filteredData);
  };

  // Pipeline Step 1: Filter reconciliation
  useEffect(() => {
    if (deptFiltered !== data && shortFiltered !== data) {
      setTableData(commonElements(deptFiltered, shortFiltered));
    } else if (deptFiltered !== data && shortFiltered === data) {
      setTableData(deptFiltered);
    } else if (deptFiltered === data && shortFiltered !== data) {
      setTableData(shortFiltered);
    } else {
      setTableData(data);
    }
  }, [deptFiltered, shortFiltered]);

  const handleShortlist = async (id, isShortlisted) => {
    console.log(
      `Shortlist button pressed for ID: ${id}, current status: ${isShortlisted}`
    );

    try {
      const res = await fetch(`/api/shortlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlisted: !isShortlisted }), // Send the new status
      });

      if (res.ok) {
        const result = await res.json();
        const updatedData = tableData.map((applicant) => {
          if (applicant._id === id) {
            console.log(
              `Updating applicant with ID: ${id} to shortlisted status: ${!isShortlisted}`
            );
            return { ...applicant, shortlisted: !isShortlisted }; // Update in local state
          }
          return applicant;
        });
        setTableData(updatedData);
        const delivery = result.emailDelivery?.status;
        toast.success(!isShortlisted
          ? delivery === "sent" ? "Student shortlisted and email sent!" : "Student shortlisted; email queued."
          : "Student removed from shortlist.");
      } else {
        console.error("Failed to update applicant status.");
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error occurred while updating the status:", error.message);
      toast.error("Failed to update status");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "RegistrationNumber",
        accessor: "RegistrationNumber",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Department",
        accessor: "Department",
      },
      {
        Header: "Preference",
        accessor: "Pref",
      },
      {
        Header: "Shortlisted",
        accessor: "shortlisted",
        Cell: ({ row }) => (
          <button
            onClick={() =>
              handleShortlist(row.original._id, row.original.shortlisted)
            }
            className={`px-4 py-2 rounded w-[115px] ${
              row.original.shortlisted
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {row.original.shortlisted ? "Unshortlist" : "Shortlist"}
          </button>
        ),
      },
    ],
    [tableData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CheckBoxComp {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CheckBoxComp {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter, pageIndex } = state;

  const handlePageSize = (e) => {
    const sz = Number(e.target.value);
    if (sz) {
      setPageSize(sz);
    } else {
      setPageSize(10);
    }
  };

  const showRowData = () => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    return selectedApplicants;
  };

  const formatQuestionsForCsv = (item) => {
    if (!item?.Questions) return "";

    if (Array.isArray(item.Questions)) {
      return item.Questions
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (Array.isArray(entry)) return entry.join(": ");
          if (entry && typeof entry === "object") {
            return Object.entries(entry)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ");
          }
          return String(entry ?? "");
        })
        .join(" | ");
    }

    if (typeof item.Questions === "object") {
      return Object.entries(item.Questions)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join(" | ");
    }

    return String(item.Questions);
  };

  const csv_link = {
    headers: CSV_Header,
    data: tableData.map((item) => ({
      ...item,
      Questions: formatQuestionsForCsv(item),
    })),
  };

  return (
    <div className="admin-table-shell flex flex-col gap-3 p-3 mt-5">
      <div className="flex items-start border-none justify-start gap-3 p-1 overflow-x-scroll">
        <Input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter Data"
          className="min-w-[300px]"
        />
        <Input
          className="w-fit"
          onChange={(e) => handlePageSize(e)}
          placeholder={"Page Size"}
        />
        <FilterDepartment filterFunc={filterFunc} />
        <FilterShortlisted filterFunc={shortlistedFilterFunc} />
        <DialogComp selectedApplicants={showRowData} />
        <Button onClick={() => window.location.reload()} className="flex gap-2">
          <GrPowerReset />
          Reset Filters
        </Button>
        <Button>
          <CSVLink
            {...csv_link}
            className="flex gap-2 justify-center items-center"
          >
            <IoCloudDownloadOutline />
            Download CSV
          </CSVLink>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((hg) => {
              const { key: groupKey, ...groupProps } = hg.getHeaderGroupProps();
              return (
              <TableRow key={groupKey || hg.id} {...groupProps}>
                {hg.headers.map((header) => {
                  const { key: headerKey, ...headerProps } = header.getHeaderProps(header.getSortByToggleProps());
                  return <TableHead
                    key={headerKey || header.id}
                    {...headerProps}
                  >
                    <div className="inline-flex gap-1 items-center">
                      {header.render("Header")}
                      <FaSortAmountDownAlt />
                    </div>
                  </TableHead>;
                })}
              </TableRow>
              );
            })}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <TableRow key={rowKey || row.id} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return <TableCell key={cellKey || cell.id} {...cellProps}>
                      {cell.render("Cell")}
                    </TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationComp
        pageIndex={pageIndex}
        pages={pageOptions.length}
        nextPage={nextPage}
        canNext={canNextPage}
        previousPage={previousPage}
        canPrev={canPreviousPage}
        goto={gotoPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default DataTable;

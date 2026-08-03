import React, { useState } from "react";
import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import LeaveApplicationLoaders from "@/components/loaders/LeaveApplicationLoaders";
import EmptyState from "@/components/sharedUi/EmptyState";

const Table = ({ data, columns, loading, searchPlaceholder, emptyState }) => {
  // const [data] = useState([...fackData])
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full function-table">
        <div className="card-body p-0">
          <div className="table-responsive">
            <div className="dataTables_wrapper dt-bootstrap5 no-footer">
              <TableSearch
                table={table}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
                searchPlaceholder={searchPlaceholder}
              />

              <div className="row dt-row" style={{padding:"0px"}}>
                <div className="col-sm-12 px-0">
                  <table className="table table-hover dataTable no-footer mb-0" id="projectList">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className={header.column.columnDef.meta?.headerClassName}
                            >
                              {header.id === "id" ? (
                                <div className="d-flex gap-2 align-items-center">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                  <ArrowToggle header={header} />
                                </div>
                              ) : (
                                <ArrowToggle header={header}>
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </ArrowToggle>
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>

                    <tbody>
                      {loading ? (
                        <LeaveApplicationLoaders rows={6} />
                      ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <tr key={row.id} className="single-item chat-single-item">
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className={cell.column.columnDef.meta?.className}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={table.getVisibleLeafColumns().length}
                            className="p-0 border-0"
                          >
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                minHeight: "420px",
                                borderTop: "1px solid #e9ecef",
                              }}
                            >
                              <EmptyState
                                title={emptyState?.title || "No Records Found"}
                                description={
                                  emptyState?.description || "There are no records available."
                                }
                                image="/illustrations/nodata.svg"
                                height="100px"
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {!loading && table.getRowModel().rows.length > 0 && <TablePagination table={table} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

const ArrowToggle = ({ header, children }) => {
  const position = header.column.getIsSorted();
  return (
    <div
      className="table-head"
      style={{
        cursor: header.column.getCanSort() ? "pointer" : "default",
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}
      {
        {
          asc: <FaSortUp size={13} opacity={position === "asc" ? 1 : 0.125} />,
          desc: <FaSortDown size={13} opacity={position === "desc" ? 1 : 0.125} />,
        }[position]
      }
      {header.column.getCanSort() && !position ? <FaSort size={13} opacity={0.125} /> : null}
    </div>
  );
};

"use client";
import React, { useEffect } from "react";
import Table from "@/components/shared/table/Table";
import { FiDownload } from "react-icons/fi";
import { useResumeBankStore } from "@/store/useResumeBankStore";



const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};






const ResumeTable = () => {
    const resumeData = useResumeBankStore((state) => state.resumeData);
    const loading = useResumeBankStore((state) => state.loading);
    const fetchResumeData = useResumeBankStore((state) => state.fetchResumeData);

    useEffect(() => {
        fetchResumeData();
    }, [fetchResumeData]);

    const columns = [
        {
            accessorKey: "id",
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);

                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
                    }
                }, [table.getIsSomeRowsSelected()]);

                return (
                    <input
                        type="checkbox"
                        className="custom-table-checkbox"
                        ref={checkboxRef}
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: {
                headerClassName: "width-30",
            },
        },
        {
            accessorKey: "name",
            header: () => "Candidate",
            cell: (info) => {
                const row = info.row.original;
                const initials = row.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                    <div className="hstack gap-3 align-items-center">
                        <div className="text-white avatar-text user-avatar-text avatar-md">{initials || "N"}</div>
                        <div>
                            <span className="d-block text-truncate-1-line fw-semibold">{row.name}</span>
                            <small className="text-muted text-truncate-1-line">{row.email}</small>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "job_position",
            header: () => "Position",
            cell: (info) => {
                const position = info.getValue();
                const department = info.row.original.department;
                return (
                    <div>
                        <div className="fw-semibold text-dark">{position || "-"}</div>
                        <small className="text-muted">{department || "-"}</small>
                    </div>
                );
            },
        },
        {
            accessorKey: "department",
            header: () => "Department",
            cell: (info) => <span className="text-muted">{info.getValue() || "-"}</span>,
        },
        {
            accessorKey: "status_name",
            header: () => "Status",
            cell: (info) => {
                const status = info.getValue();
                const colorClass =
                    status === "Applied"
                        ? "bg-light-primary text-primary"
                        : status === "Reviewed"
                            ? "bg-light-warning text-warning"
                            : "bg-light-secondary text-secondary";

                return <span className={`badge ${colorClass}`}>{status || "-"}</span>;
            },
        },
        {
            accessorKey: "updated_at",
            header: () => "Updated",
            cell: (info) => formatDate(info.getValue()),
        },
        {
            accessorKey: "resume_url",
            header: () => "Resume",
            cell: (info) => {
                const value = info.getValue();
                const fileName = info.row.original.attachment || "resume.pdf";

                return value ? (
                    <a href={value} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center gap-2 text-primary">
                        <FiDownload size={14} />
                        <span className="text-truncate-1-line">{fileName}</span>
                    </a>
                ) : (
                    "-"
                );
            },
        },
    ];

    return <Table data={resumeData} columns={columns} loading={loading} searchPlaceholder="By Name , Position ..." />;
};

export default ResumeTable;

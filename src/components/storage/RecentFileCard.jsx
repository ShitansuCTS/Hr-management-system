import React from "react";
import Dropdown from "@/components/shared/Dropdown";
import DocumentStorageSidebar from "./DocumentStorageSidebar";
import { BsPatchCheckFill } from "react-icons/bs";
const RecentFileCard = ({
  document,
  selectedDoc,
  strogeOptions,
  handleDelete,
  onOpen,
  imgSrc,
  title,
}) => {
  const safeDocument = document || {};
  const fileType = safeDocument.fileType || "";
  const fileUrl = safeDocument.fileUrl || imgSrc || "/icons/file.png";
  const documentType = safeDocument.documentType || title || "Document";

  return (

    <>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" >
        <div className="card mb-4 stretch stretch-full">
          <div
            className="card-body p-0 position-relative"
            style={{
              height: "180px",
              overflow: "hidden",
            }}
          >
            <a
              href="#"
              className="d-block w-100 h-100"
              data-bs-toggle={document ? "offcanvas" : undefined}
              data-bs-target={document ? "#fileFolderDetailsOffcanvas" : undefined}
              onClick={() => onOpen && onOpen(safeDocument)}
            >
              <img
                src={
                  fileType === "application/pdf"
                    ? "/icons/pdf.png"
                    : fileUrl
                }
                alt={documentType}
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </a>

            {/* Verified Badge */}
            <div
              className="position-absolute top-0 end-0 m-2"
              style={{ zIndex: 10 }}
            >
              <span
                className="badge bg-white rounded-pill shadow-sm px-2 py-1 d-flex align-items-center"
                style={{
                  border: "1px solid #E5E7EB",
                }}
              >
                <i
                  className="bi bi-patch-check-fill text-primary"
                  style={{ fontSize: 15 }}
                ></i>
                <BsPatchCheckFill
                  size={15}
                  color="#0d6efd"
                />
                <span
                  className="ms-1 fw-semibold"
                  style={{
                    fontSize: 11,
                    color: "#374151",
                  }}
                >
                  Verified
                </span>
              </span>
            </div>
          </div>
          <div className="card-footer p-4 d-flex align-items-center justify-content-between">
            <div>
              <h2 className="fs-13 mb-1 text-truncate-1-line">{documentType}</h2>
              <small className="fs-10 text-muted">
                {safeDocument.createdAt ? new Date(safeDocument.createdAt).toLocaleDateString() : "No date"}
              </small>
            </div>
            {/* <Dropdown
              dropdownItems={strogeOptions}
              dataBsToggle="offcanvas"
              id={document.id}
              onClick={handleDelete}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentFileCard;

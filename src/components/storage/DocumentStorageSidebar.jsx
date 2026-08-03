import React from "react";
import { FiFileText, FiImage, FiLayers, FiMonitor, FiMusic, FiVideo } from "react-icons/fi";

const DocumentStorageSidebar = ({
    document,
    onDelete,
}) => {
    if (!document) return null;

    const safeDocument = document || {};
    const fileType = safeDocument.fileType || "";
    const fileUrl = safeDocument.fileUrl || "/icons/file.png";

    return (
        <div
            className="offcanvas offcanvas-end file-manager-folder-details"
            tabIndex={-1}
            id="fileFolderDetailsOffcanvas"
        >
            {/* Header */}
            <div className="offcanvas-header border-bottom">
                <div>
                    <h5 className="offcanvas-title mb-1">Document Details</h5>
                    <small className="text-muted">
                        {document.documentType}
                    </small>
                </div>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                />
            </div>

            <div className="offcanvas-body p-0">

                {/* Preview */}
                <div className="p-4 text-center border-bottom bg-light">

                    {fileType === "application/pdf" ? (
                        <img
                            src="/icons/pdf.png"
                            alt="PDF"
                            className="img-fluid"
                            style={{
                                maxHeight: 220,
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <img
                            src={fileUrl}
                            alt={safeDocument.documentType || "Document"}
                            className="img-fluid rounded"
                            style={{
                                maxHeight: 220,
                                objectFit: "contain",
                            }}
                        />
                    )}

                </div>

                {/* Information */}
                <div className="px-4 py-3">

                    <h6 className="fw-semibold mb-3">
                        Document Information
                    </h6>

                    <SpecificationsRow
                        label="Document Type"
                        value={safeDocument.documentType || "-"}
                    />

                    <SpecificationsRow
                        label="File Name"
                        value={safeDocument.documentName || "-"}
                    />

                    <SpecificationsRow
                        label="File Type"
                        value={fileType || "-"}
                    />

                    <SpecificationsRow
                        label="Uploaded On"
                        value={safeDocument.createdAt ? new Date(safeDocument.createdAt).toLocaleDateString() : "-"}
                    />

                    <SpecificationsRow
                        label="Last Updated"
                        value={safeDocument.updatedAt ? new Date(safeDocument.updatedAt).toLocaleDateString() : "-"}
                    />

                    {safeDocument.fileSize && (
                        <SpecificationsRow
                            label="File Size"
                            value={`${(safeDocument.fileSize / 1024).toFixed(1)} KB`}
                        />
                    )}

                </div>

                {/* Actions */}
                <div className="border-top p-4">

                    <h6 className="fw-semibold mb-3">
                        Actions
                    </h6>

                    <div className="d-grid gap-2">

                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-light"
                        >
                            Preview Document
                        </a>

                        <a
                            href={fileUrl.replace(
                                "/upload/",
                                "/upload/fl_attachment/"
                            )}
                            className="btn btn-primary"
                        >
                            Download
                        </a>

                        <button
                            className="btn btn-outline-danger"
                            onClick={() => onDelete && onDelete(safeDocument.id)}
                            data-bs-dismiss="offcanvas"
                        >
                            Delete Document
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default DocumentStorageSidebar;

const SpecificationsRow = ({ label, value }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold text-dark">{label}</span>
            <span className="text-muted">{value}</span>
        </div>
    );
};

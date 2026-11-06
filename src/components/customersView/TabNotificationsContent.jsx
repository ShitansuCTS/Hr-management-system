"use client";
import React, { useState, useEffect } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import toast from "react-hot-toast";
import RecentFileCard from "../storage/RecentFileCard";
import { cloudStorageData, storageFolderData } from "@/utils/fackData/storageData";
import {
  FiCopy,
  FiDownload,
  FiEdit2,
  FiFileText,
  FiInfo,
  FiLink2,
  FiMove,
  FiScissors,
  FiShare2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import DocumentStorageSidebar from "../storage/DocumentStorageSidebar";
import EmptyCardComponenets from "./EmptyCardComponenets";

const documentTypesList = [
  "PAN Card",
  "Aadhaar Card",
  "Bank Proof",
  "Offer Letter",
  "Resume",
  "Leaving Letter",
  "Joining Letter",
  "Passport",
  "Visa",
  "Driving License",
  "Experience Certificate",
];
export const strogeOptions = [
  { icon: <FiShare2 />, label: "Share" },
  { icon: <FiInfo />, label: "Details", modalTarget: "#fileFolderDetailsOffcanvas" },
  { icon: <FiEdit2 />, label: "Rename" },
  { icon: <FiDownload />, label: "Download" },
  { type: "divider" },
  { icon: <FiCopy />, label: "Copy to..." },
  { icon: <FiMove />, label: "Move to..." },
  { icon: <FiLink2 />, label: "Open with...", link: "https://themeforest.net/user/theme_ocean" },
  { type: "divider" },
  { icon: <FiScissors />, label: "Backup" },
  { icon: <FiTrash2 />, label: "Remove" },
];

const TabNotificationsContent = ({ employeeId }) => {
  const [showModal, setShowModal] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileData, setFileData] = useState(storageFolderData(0, 4));

  const handleUpload = async () => {
    if (!documentType || !file) {
      toast.error("Please select document type and file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("documentName", documentType);
      formData.append("file", file);

      const res = await fetch(`/api/v1/users/${employeeId}/documents`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Document uploaded successfully ✅");

        // Reset
        setDocumentType("");
        setFile(null);
        setPreview(null);
        await fetchDocuments();
        setShowModal(false);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const fetchDocuments = async () => {
    try {
      setFetchLoading(true);

      const res = await fetch(`/api/v1/users/${employeeId}/documents`);

      const data = await res.json();

      if (res.ok) {
        setDocuments(data.data);
        console.log("The fetched document sare :", data.documents);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/v1/users/${employeeId}/documents/${documentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Document deleted successfully ");
        // Refresh the document list
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting the document");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (employeeId) {
      fetchDocuments();
    }
  }, [employeeId]);

  return (
    <div className="tab-pane fade" id="notificationsTab" role="tabpanel">
      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop show"></div>

          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold mb-0">Upload Document</h6>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                {/* Document Type */}
                <div className="mb-3">
                  <label className="form-label small text-muted">Document Type</label>
                  <select
                    className="form-select"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="">Select Document Type</option>
                    {documentTypesList.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Input */}
                <div className="mb-3">
                  <label className="form-label small text-muted">Select File</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const selected = e.target.files[0];

                      if (!selected) return;

                      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

                      if (!allowedTypes.includes(selected.type)) {
                        alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
                        e.target.value = null;
                        return;
                      }

                      setFile(selected);
                      setPreview(URL.createObjectURL(selected));
                    }}
                  />
                </div>

                {/* Preview */}
                {preview && (
                  <div className="text-center mb-3">
                    {file?.type === "application/pdf" ? (
                      <img src="/icons/pdf.png" alt="pdf" style={{ height: "80px" }} />
                    ) : (
                      <img
                        src={preview}
                        alt="preview"
                        className="img-fluid rounded-3"
                        style={{
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Upload Button */}
                <button
                  className="btn btn-primary w-100 rounded-pill"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload xxxxxxxxxxDocument"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="">
        {fetchLoading ? (
          <p className="text-muted">Loading documents...</p>
        ) : documents.length === 0 ? (
          <EmptyCardComponenets
            title="No documents uploaded!"
            description="Upload your first document to get started."
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="recent-section mb-5 px-3 py-3">
            <SectionTitle
              sectionName={"Recent Files"}
              sectionDescription={"Recent access files (Last access 24 min ago)"}
              onUpload={() => setShowModal(true)}
            />
            <div className="row g-2">
              {documents.map((doc) => (
                <RecentFileCard
                  key={doc.id}
                  document={doc}
                  onOpen={setSelectedDoc}
                  strogeOptions={strogeOptions}
                  handleDelete={handleDelete}
                />
              ))}
            </div>

            <DocumentStorageSidebar document={selectedDoc} onDelete={handleDelete} />
          </div>
        )}
      </div>

      {/* {selectedDoc && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "10px" }}>
            
                <div className="modal-header">
                  <h6 className="fw-semibold mb-0">{selectedDoc.documentType}</h6>
                  <button className="btn-close" onClick={() => setSelectedDoc(null)}></button>
                </div>

        
                <div
                  className="modal-body text-center"
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {selectedDoc.fileUrl?.toLowerCase().includes(".pdf") ? (
                    <iframe
                      src={selectedDoc.fileUrl}
                      width="100%"
                      height="350px"
                      title="PDF Preview"
                      style={{
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <img
                      src={selectedDoc.fileUrl}
                      alt="preview"
                      style={{
                        maxHeight: "350px",
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </div>

              
                <div className="modal-footer d-flex justify-content-between">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedDoc(null)}
                    style={{ borderRadius: "4px" }}
                  >
                    Close
                  </button>

                  <a
                    href={selectedDoc.fileUrl.replace("/upload/", "/upload/fl_attachment/")}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: "4px" }}
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default TabNotificationsContent;

const SectionTitle = ({ sectionName, sectionDescription, onUpload }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="me-4">
        <h2 className="fs-16 fw-bold mb-1">{sectionName}</h2>
        <div className="fs-12 text-muted text-truncate-1-line">{sectionDescription}</div>
      </div>

      <button type="button" className="btn btn-sm btn-light-brand" onClick={onUpload}>
        + Upload Document
      </button>
    </div>
  );
};

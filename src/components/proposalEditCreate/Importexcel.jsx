"use client";

import React, { useRef, useState } from "react";
import {
  FiDownload,
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Importexcel = () => {
  const fileRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  const [result, setResult] = useState(null);

  const [errorReport, setErrorReport] = useState(null);

  const resetImport = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorReport(null);
    setProgress(0);
    setUploadStatus("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* ===============================
        Download Template
  =============================== */

  const getTemplate = async () => {
    try {
      setDownloadingTemplate(true);

      const response = await fetch("/api/v1/users/import-users/template", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to download template.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "employee-template.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setDownloadingTemplate(false);
    }
  };

  /* ===============================
        Select File
  =============================== */

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;

    const file = e.target.files[0];

    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (![".xlsx", ".xls"].includes(extension)) {
      alert("Only Excel files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10 MB.");
      return;
    }

    setSelectedFile(file);

    setResult(null);

    setErrorReport(null);

    setProgress(0);

    setUploadStatus("");
  };

  /* ===============================
        Import Employees
  =============================== */
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file.");
      return;
    }

    try {
      setUploading(true);
      setResult(null);
      setErrorReport(null);

      setProgress(10);
      setUploadStatus("Uploading Excel file...");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/v1/users/import-users", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setProgress(40);
      setUploadStatus("Validating employee records...");

      const data = await response.json();

      console.log("IMPORT RESPONSE", data);

      setProgress(80);
      setUploadStatus("Importing employees...");

      /**
       * Validation failed but backend generated an error report.
       */
      if (!response.ok) {
        const errorData = data.body || data;

        if (errorData.errors?.errorReport) {
          setResult(errorData.errors.summary);

          // Store COMPLETE object
          setErrorReport(errorData.errors.errorReport);

          toast.error(errorData.message);

          setProgress(100);
          setUploadStatus("");

          setUploading(false);

          return;
        }

        throw new Error(errorData.message || "Import failed.");
      }

      /**
       * Success
       */
      setProgress(100);
      setUploadStatus("Finalizing import...");

      const successData = data.body || data;

      if (successData.data) {
        setResult(successData.data);

        if (successData.data.errorReport) {
          setErrorReport(successData.data.errorReport);
        }
      }

      toast.success(successData.message || "Employees imported successfully.");

      setTimeout(() => {
        setUploading(false);
        setUploadStatus("");
      }, 500);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Something went wrong while importing.");

      setUploading(false);
      setProgress(0);
      setUploadStatus("");
    }
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="importexcel" style={{ width: 520 }}>
      {/* ================= HEADER ================= */}

      <div className="offcanvas-header border-bottom py-3 px-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
            style={{ width: 54, height: 54 }}
          >
            <FiUploadCloud size={26} className="text-primary" />
          </div>

          <div>
            <h4 className="fw-bold mb-1">Import Employees</h4>

            <p className="text-muted mb-0">Upload an Excel sheet to create employees in bulk.</p>
          </div>
        </div>

        <button className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      {/* ================= BODY ================= */}

      <div className="offcanvas-body p-4">
        {/* Instructions */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-1">Import Instructions</h6>
                <small className="text-muted">
                  Download the template before uploading your employee data.
                </small>
              </div>

              <button
                className="btn btn-sm btn-outline-primary"
                disabled={downloadingTemplate}
                onClick={getTemplate}
              >
                {downloadingTemplate ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Downloading...
                  </>
                ) : (
                  <>
                    <FiDownload className="me-1" />
                    Template
                  </>
                )}
              </button>
            </div>

            <div className="border-top pt-3">
              <div className="d-flex align-items-start gap-2 mb-2">
                <FiCheckCircle className="text-success mt-1" size={14} />
                <small>Download the employee template.</small>
              </div>

              <div className="d-flex align-items-start gap-2 mb-2">
                <FiCheckCircle className="text-success mt-1" size={14} />
                <small>Fill employee information.</small>
              </div>

              <div className="d-flex align-items-start gap-2 mb-2">
                <FiCheckCircle className="text-success mt-1" size={14} />
                <small>Do not modify the column headers.</small>
              </div>

              <div className="d-flex align-items-start gap-2">
                <FiCheckCircle className="text-success mt-1" size={14} />
                <small>Supports .xlsx / .xls (Max 10 MB).</small>
              </div>
            </div>
          </div>
        </div>
        {/* Upload */}

        {/* ================= Upload Area ================= */}

        <div className="card border-0 shadow-sm mb-4">
          <div
            className="card-body text-center py-4 px-4"
            onClick={() => {
              if (!uploading) {
                fileRef.current.click();
              }
            }}
            style={{
              border: "2px dashed #d7dee8",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all .25s ease",
              minHeight: "180px",
            }}
          >
            <div
              className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 60,
                height: 60,
                background: "#eef5ff",
              }}
            >
              <FiUploadCloud className="text-primary" size={30} />
            </div>

            <h6 className="fw-bold mb-1">Upload Employee Excel</h6>

            <p className="text-muted small mb-3">
              Drag & drop your Excel file here or click to browse.
            </p>

            <div className="mt-3 text-muted small">
              Supported: <strong>.xlsx</strong>, <strong>.xls</strong> • Max 10 MB
            </div>

            <input
              disabled={uploading}
              hidden
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* ================= Selected File ================= */}

        {selectedFile && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: 52,
                      height: 52,
                      background: "#e8f8ef",
                    }}
                  >
                    <FiFileText className="text-success" size={22} />
                  </div>

                  <div>
                    <div className="fw-semibold">{selectedFile.name}</div>

                    <small className="text-muted">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>

                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                  Ready to Import
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= Upload Progress ================= */}

        {uploading && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Importing Employees</h6>

                  <small className="text-muted">{uploadStatus}</small>
                </div>

                <div className="fw-bold text-primary">{progress}%</div>
              </div>

              <div
                className="progress mt-3"
                style={{
                  height: 8,
                  borderRadius: 50,
                }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= Success ================= */}

        {result && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              {/* <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: 54,
                    height: 54,
                    background: "#e8f8ef",
                  }}
                >
                  <FiCheckCircle className="text-success" size={28} />
                </div>

                <div>
                  <div className="alert alert-success mb-4">
                    Employees have been imported successfully.
                  </div>
                  <h5 className="fw-bold text-success mb-1">Import Completed Successfully</h5>

                  <small className="text-muted">
                    Employee records have been processed successfully.
                  </small>
                </div>
              </div> */}

              <div className="row g-3">
                <div className="col-6">
                  <div className="bg-light rounded-3 text-center p-3">
                    <h4 className="fw-bold mb-1">{result.processed}</h4>
                    <small className="text-muted">Processed</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light rounded-3 text-center p-3">
                    <h4 className="fw-bold text-success mb-1">{result.inserted}</h4>
                    <small className="text-muted">Imported</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light rounded-3 text-center p-3">
                    <h4 className="fw-bold text-warning mb-1">{result.skipped}</h4>
                    <small className="text-muted">Skipped</small>
                  </div>
                </div>

                <div className="col-6">
                  <div className="bg-light rounded-3 text-center p-3">
                    <h4 className="fw-bold text-danger mb-1">{result.failed}</h4>
                    <small className="text-muted">Failed</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= Error ================= */}

        {errorReport && (
          <div className="card border-0 shadow-sm mt-4">
            <div
              className="card-body"
              style={{
                background: "#fff7e8",
                borderRadius: 12,
              }}
            >
              <div className="d-flex align-items-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: 50,
                    height: 50,
                    background: "#fff1cc",
                    flexShrink: 0,
                  }}
                >
                  <FiAlertCircle className="text-warning" size={24} />
                </div>

                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-2">Validation Errors Found</h6>

                  <p className="text-muted small mb-3">
                    Some employee records could not be imported. Download the validation report,
                    correct the highlighted rows and upload the file again.
                  </p>

                  <a
                    href={errorReport.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning"
                  >
                    <FiDownload className="me-2" />
                    Download Error Report
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}

      <div className="border-top p-4 bg-white">
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light px-4" data-bs-dismiss="offcanvas" disabled={uploading}>
            Cancel
          </button>

          <button
            className="btn btn-primary px-4"
            disabled={!selectedFile || uploading}
            onClick={handleImport}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Importing...
              </>
            ) : (
              <>
                <FiUploadCloud className="me-2" />
                Import Employees
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Importexcel;

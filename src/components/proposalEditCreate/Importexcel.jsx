"use client";

import React from "react";
const Importexcel = () => {
  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="importexcel">
      <div className="offcanvas-header border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Import Employees</h4>
          <small className="text-muted">Upload an Excel file to import employee records.</small>
        </div>

        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
      </div>

      <div className="offcanvas-body">
        {/* Instructions */}
        <div className="alert alert-light border">
          <h6 className="fw-bold mb-2">Before Uploading</h6>

          <ul className="mb-0 ps-3">
            <li>Download the sample Excel template.</li>
            <li>Do not change the column names.</li>
            <li>Only .xlsx and .xls files are supported.</li>
            <li>Maximum file size: 10 MB.</li>
          </ul>
        </div>

        {/* Download Template */}
        <div className="mb-4">
          <button className="btn btn-outline-primary">
            <i className="feather-download me-2"></i>
            Download Template
          </button>
        </div>

        {/* Upload Area */}
        <div
          className="border border-2 border-dashed rounded-3 p-5 text-center bg-light"
          style={{ cursor: "pointer" }}
        >
          <i className="feather-upload-cloud fs-1 text-primary"></i>

          <h5 className="mt-3 mb-2">Drag & Drop Excel File</h5>

          <p className="text-muted mb-3">or click below to browse your computer</p>

          <input type="file" className="form-control" accept=".xlsx,.xls" />
        </div>

        {/* Selected File */}
        <div className="card mt-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">employees.xlsx</h6>

              <small className="text-muted">2.4 MB</small>
            </div>

            <span className="badge bg-success">Ready</span>
          </div>
        </div>

        {/* Upload Progress */}

        <div className="mt-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Uploading...</span>
            <span>65%</span>
          </div>

          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        {/* Success */}

        <div className="alert alert-success mt-4">
          <strong>Import Completed Successfully</strong>

          <div className="mt-2">
            Imported : <strong>145</strong>
          </div>

          <div>
            Skipped : <strong>3</strong>
          </div>
        </div>

        {/* Error */}

        <div className="alert alert-danger mt-4">
          <h6 className="fw-bold">Some records could not be imported</h6>

          <p className="mb-3">
            5 employee records contain validation errors. Download the error report, fix the data,
            and upload again.
          </p>

          <button className="btn btn-danger">Download Error Report</button>
        </div>
      </div>

      <div className="offcanvas-footer border-top p-3 d-flex justify-content-end gap-2">
        <button className="btn btn-light" data-bs-dismiss="offcanvas">
          Cancel
        </button>

        <button className="btn btn-primary">Import Employees</button>
      </div>
    </div>
  );
};

export default Importexcel;

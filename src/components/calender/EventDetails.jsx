import { format, isValid } from "date-fns";
import React from "react";
import { FiEdit, FiCalendar, FiTrash, FiTag, FiFileText } from "react-icons/fi";

const formatEventTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) return "-";

  return format(parsedDate, "dd MMM yyyy, hh:mm a");
};

const EventDetails = ({ selectedEvent, handleEditEvent, handleDeleteEvent }) => {
  return (
    <div className="edit-delete-modal">
      {/* Title */}
      <div className="mb-3">
        <h2 className="edit-delete-modal-title mb-2">{selectedEvent.title}</h2>

        <span className="badge bg-light text-primary d-inline-flex align-items-center gap-1">
          <FiTag size={13} />
          {selectedEvent.category}
        </span>
      </div>

      {/* Description */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <FiFileText size={15} />
          <strong>Description</strong>
        </div>

        <p className="text-muted mb-0">{selectedEvent.description || "No description"}</p>
      </div>

      {/* Dates */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <FiCalendar size={15} className="me-2 text-primary" />
          <strong className="me-2">Start:</strong>
          <span>{formatEventTime(selectedEvent.start)}</span>
        </div>

        <div className="d-flex align-items-center">
          <FiCalendar size={15} className="me-2 text-primary" />
          <strong className="me-2">End:</strong>
          <span>{formatEventTime(selectedEvent.end)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="modal-buttons d-flex gap-3">
        <button
          onClick={handleEditEvent}
          className="btn btn-primary wd-150 d-flex align-items-center justify-content-center gap-2"
        >
          <FiEdit size={14} />
          Edit Event
        </button>

        <button
          onClick={handleDeleteEvent}
          className="btn btn-danger wd-150 d-flex align-items-center justify-content-center gap-2"
        >
          <FiTrash size={14} />
          Delete Event
        </button>
      </div>
    </div>
  );
};

export default EventDetails;

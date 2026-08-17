import React from "react";

const CommentMessages = ({
  avatar,
  name,
  time,
  message,
  isInitialNote,
}) => {
  return (
    <>
      <div
        className="p-3 rounded-3  border border-secondary-subtle mb-3"
      >
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <img
            // src={avatar || "/images/avatar.png"}
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || "User"
              )}&background=3454d1&color=fff&size=128`
            }
            alt="avatar"
            className="rounded-circle"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "cover",
            }}
          />

          <div>
            <div className="fw-semibold text-body">
              {name}
            </div>
            <div className="small text-muted">
              {time}
            </div>
          </div>
        </div>

        {/* Message */}
        <div
          className={`p-3 rounded-2 small ${isInitialNote
            ? "bg-warning-subtle border border-warning"
            : "bg-body-tertiary"
            }`}
          style={{
            lineHeight: "1.6",
            whiteSpace: "pre-line",
          }}
        >
          {isInitialNote && (
            <div className="small fw-semibold text-warning mb-1">
              Leave Application Note
            </div>
          )}

          <span className=" text-muted fw-semibold">{message}</span>
        </div>
      </div>
    </>
  );
};

export default CommentMessages;
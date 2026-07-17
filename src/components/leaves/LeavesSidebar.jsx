"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { FiSend, FiX } from "react-icons/fi";
import { LoaderCircle } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import CommentMessages from "./CommentMessages";
import LeaveCommentsSkeleton from "@/components/loaders/leaves/LeaveCommentsSkeleton";
import { useLeaveStore } from "@/store/useLeaveStore";

const LeavesSidebar = ({ data, onClose, currentUserId }) => {
  const [message, setMessage] = useState("");

  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);

  const {
    commentsByLeaveId,
    commentsLoadingByLeaveId,
    commentActionLoading,
    fetchLeaveComments,
    sendLeaveComment,
  } = useLeaveStore();

  const leaveId = data?.id;

  const comments = leaveId ? commentsByLeaveId[leaveId] || [] : [];

  const commentsLoading = leaveId ? commentsLoadingByLeaveId[leaveId] || false : false;

  // =============================
  // Auto Scroll
  // =============================
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  // =============================
  // Fetch Comments Once
  // =============================
  useEffect(() => {
    if (!leaveId) return;

    const loadComments = async () => {
      try {
        await fetchLeaveComments(leaveId);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to fetch leave comments:", error);
      }
    };

    loadComments();
  }, [leaveId, fetchLeaveComments, scrollToBottom]);

  // Scroll when comments change
  useEffect(() => {
    if (!commentsLoading) {
      scrollToBottom();
    }
  }, [comments.length, commentsLoading, scrollToBottom]);

  // =============================
  // Close on ESC
  // =============================
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // =============================
  // Close on Outside Click
  // =============================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // =============================
  // Send Comment
  // =============================
  const handleSend = async () => {
    const cleanMessage = message.trim();

    if (!leaveId || !cleanMessage || commentActionLoading) {
      return;
    }

    const success = await sendLeaveComment(leaveId, cleanMessage);

    if (!success) return;

    setMessage("");
    scrollToBottom();
  };

  return (
    <>
      {/* Overlay */}
      <div className="sidebar-overlay" onClick={onClose} />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="theme-customizer theme-customizer-open email-sidebar"
        style={{
          width: "400px",
          maxWidth: "100%",
        }}
      >
        <div className="customizer-sidebar-wrapper d-flex flex-column h-100">
          {/* Header */}
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-bold">Leave Comments</h5>

              <small className="text-muted">View and reply to the leave discussion</small>
            </div>

            <button
              type="button"
              className="avatar-text avatar-md"
              onClick={onClose}
              aria-label="Close comments"
            >
              <FiX />
            </button>
          </div>

          {/* Employee Details */}
          <SidebarHeader
            avatar={data?.user?.profileImageUrl}
            name={data?.user?.fullName || "User"}
          />

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-grow-1 p-3"
            style={{
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {commentsLoading ? (
              <LeaveCommentsSkeleton />
            ) : comments.length === 0 ? (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="text-center px-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: "#eef2ff",
                      color: "#3156d3",
                    }}
                  >
                    <FiSend size={18} />
                  </div>

                  <h6 className="fw-semibold mb-1">No comments yet</h6>

                  <p className="text-muted fs-12 mb-0">
                    Start the discussion by sending a message.
                  </p>
                </div>
              </div>
            ) : (
              comments.map((item) => {
                const isReply = item.userId === currentUserId;

                return (
                  <CommentMessages
                    key={item.id}
                    avatar={item.user?.profileImageUrl}
                    name={item.user?.fullName || "User"}
                    time={dayjs(item.createdAt).format("DD MMM YYYY hh:mm A")}
                    message={item.message}
                    isReply={isReply}
                    isInitialNote={item.isInitialNote}
                  />
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-top">
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                disabled={commentActionLoading}
              />

              <button
                type="button"
                className="btn btn-primary d-flex align-items-center justify-content-center"
                onClick={handleSend}
                disabled={commentActionLoading || !message.trim()}
                style={{
                  width: "42px",
                  height: "42px",
                  flexShrink: 0,
                }}
              >
                {commentActionLoading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <FiSend size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeavesSidebar;

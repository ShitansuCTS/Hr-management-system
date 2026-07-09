"use client";

import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { FiX, FiSend } from "react-icons/fi";
import SidebarHeader from "./SidebarHeader";
import CommentMessages from "./CommentMessages";

const LeavesSidebar = ({ data, onClose, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);

  // =============================
  // Close on ESC
  // =============================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);
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
  // Fetch Comments (GET)
  // =============================
  const fetchComments = async () => {
    if (!data?.id) return;

    try {
      const res = await fetch(`/api/v1/leaves/${data.id}/comments`);
      const result = await res.json();

      if (res.ok) {
        setComments(result.data || []);
        setTimeout(scrollToBottom, 0);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [data?.id]);

  // =============================
  // Send Comment (POST)
  // =============================
  const handleSend = async () => {
    if (!data?.id || !message.trim()) return;

    try {
      const res = await fetch(`/api/v1/leaves/${data.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim(), }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to send message");
      }

      // Add new comment instantly
      setComments((prev) => [...prev, result.data]);
      setMessage("");
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // =============================
  // Auto Scroll
  // =============================
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <>
      {/* Overlay */}
      <div className="sidebar-overlay" onClick={onClose}></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="theme-customizer theme-customizer-open email-sidebar"
        style={{ width: "400px" }}
      >
        <div className="customizer-sidebar-wrapper d-flex flex-column h-100">
          {/* Header */}
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Comment's Preview</h5>
            <button className="avatar-text avatar-md" onClick={onClose}>
              <FiX />
            </button>
          </div>

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
            }}
          >
            {comments.length === 0 && (
              <p className="text-muted text-center mt-4">No comments yet.</p>
            )}

            {comments.map((item) => {
              const isReply = item.userId === currentUserId; // your logged-in user id

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
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-top d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button className="btn btn-primary" onClick={handleSend}>
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeavesSidebar;

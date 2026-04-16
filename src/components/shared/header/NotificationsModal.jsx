import Link from "next/link";
import React, { useEffect } from "react";
import { FiBell, FiCheck, FiX } from "react-icons/fi";
import { useAnnouncementStore } from "@/store/announcementStore";

const NotificationsModal = () => {
  const { announcements, loading, fetchAnnouncements } = useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="dropdown nxl-h-item">
      <div
        className="nxl-head-link me-3"
        data-bs-toggle="dropdown"
        role="button"
        data-bs-auto-close="outside"
      >
        <FiBell size={20} />
        <span className="badge bg-danger nxl-h-badge">3</span>
      </div>
      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-notifications-menu">
        <div className="d-flex justify-content-between align-items-center notifications-head">
          <h6 className="fw-bold text-dark mb-0">Notifications</h6>
          <Link
            href="#"
            className="fs-11 text-success text-end ms-auto"
            data-toggle="tooltip"
            data-title="Make as Read"
          >
            <FiCheck size={16} />
            <span>Make as Read</span>
          </Link>
        </div>
        {announcements
          .slice() // create copy (important to avoid mutating state)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
          .slice(0, 3) // take only 3
          .map(({ id, createdBy, createdAt, title }) => (
            <Card
              key={id}
              profileImage={createdBy?.profileImageUrl}
              time={createdAt}
              titleFirst={title}
              titleSecond="3 seconds"
            />
          ))}

        <div className="text-center notifications-footer">
          <Link href="/announcements/list" className="fs-13 fw-semibold text-dark">
            Alls Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;

const Card = ({ src, time, titleFirst, titleSecond, profileImage }) => {
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };
  return (
    <div className="notifications-item">
      <img src={profileImage || "/images/avatar/1.png"} alt="" className="rounded me-3 border" />
      <div className="notifications-desc">
        <Link href="#" className="font-body text-truncate-2-line">
          {" "}
          <span className="fw-semibold text-dark">{titleFirst}</span> {titleSecond}
        </Link>
        <div className="d-flex justify-content-between align-items-center">
          <div className="notifications-date text-muted border-bottom border-bottom-dashed">
            {timeAgo(time)}
          </div>
          <div className="d-flex align-items-center float-end gap-2">
            <span
              className="d-block wd-8 ht-8 rounded-circle bg-gray-300"
              data-toggle="tooltip"
              data-title="Make as Read"
            ></span>
            <span className="text-danger" data-toggle="tooltip" data-title="Remove">
              {" "}
              <FiX className="fs-12" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

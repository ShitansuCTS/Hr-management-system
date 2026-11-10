"use client";

import React, { useEffect, useState } from "react";
import { FiActivity, FiClock, FiCalendar, FiUser, FiLogIn, FiLogOut, FiCheckCircle, FiArrowDownCircle } from "react-icons/fi";

const ACTIVITY_LABELS = {
  USER_CREATED: "Account created",
  LOGIN: "Signed in",
  LOGOUT: "Signed out",
  PUNCH_IN: "Punched in",
  PUNCH_OUT: "Punched out",
};

const ACTIVITY_STYLES = {
  USER_CREATED: {
    icon: FiUser,
    color: "#6366f1",
    background: "#eef2ff",
  },
  LOGIN: {
    icon: FiLogIn,
    color: "#16a34a",
    background: "#dcfce7",
  },
  LOGOUT: {
    icon: FiLogOut,
    color: "#64748b",
    background: "#f1f5f9",
  },
  PUNCH_IN: {
    icon: FiCheckCircle,
    color: "#0891b2",
    background: "#cffafe",
  },
  PUNCH_OUT: {
    icon: FiArrowDownCircle,
    color: "#d97706",
    background: "#fef3c7",
  },
};

const TabActivityContent = ({ employeeId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(Boolean(employeeId));
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function fetchActivities() {
      if (!employeeId) {
        setActivities([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/v1/users/users-profile/${encodeURIComponent(employeeId)}/activity`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load employee activity.");
        }

        if (isCurrent) {
          setActivities(result.data?.activities || []);
        }
      } catch (fetchError) {
        console.error("Fetch employee activity failed:", fetchError);

        if (isCurrent) {
          setError(fetchError.message || "Unable to load employee activity.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchActivities();

    return () => {
      isCurrent = false;
    };
  }, [employeeId]);

  return (
    <div className="tab-pane fade" id="activityTab" role="tabpanel">
      <div className="p-3 p-md-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Activity history</h5>
            <p className="text-muted small mb-0">
              Recent account and attendance activities
            </p>
          </div>

          {!loading && !error && (
            <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
              {activities.length} Activities
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-4 text-muted small">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading activities...
          </div>
        ) : error ? (
          <div className="alert alert-danger py-2 mb-0 small">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 border rounded-3">
            <FiClock size={22} className="text-muted mb-2" />
            <p className="fw-semibold mb-1">No activity recorded yet</p>
            <p className="text-muted small mb-0">
              Account and attendance activities will appear here.
            </p>
          </div>
        ) : (
          <div className="border rounded-3 overflow-hidden bg-white">
            {activities.map((activity, index) => {
              const action = activity.action;

              const styles = {
                USER_CREATED: {
                  color: "#6366f1",
                  bg: "#eef2ff",
                  icon: FiUser,
                  badge: "Account",
                },
                LOGIN: {
                  color: "#16a34a",
                  bg: "#ecfdf3",
                  icon: FiLogIn,
                  badge: "Login",
                },
                LOGOUT: {
                  color: "#64748b",
                  bg: "#f1f5f9",
                  icon: FiLogOut,
                  badge: "Logout",
                },
                PUNCH_IN: {
                  color: "#0891b2",
                  bg: "#ecfeff",
                  icon: FiCheckCircle,
                  badge: "Punch In",
                },
                PUNCH_OUT: {
                  color: "#d97706",
                  bg: "#fffbeb",
                  icon: FiArrowDownCircle,
                  badge: "Punch Out",
                },
              };

              const current = styles[action] || {
                color: "#6366f1",
                bg: "#eef2ff",
                icon: FiActivity,
                badge: "Activity",
              };

              const Icon = current.icon;

              const date = new Date(activity.createdAt);

              return (
                <div
                  key={activity.id}
                  className="d-flex align-items-center justify-content-between gap-2 px-3 py-3"
                  style={{
                    borderBottom:
                      index !== activities.length - 1
                        ? "1px solid #f1f1f1"
                        : "none",
                  }}
                >
                  {/* Left: Icon and activity */}
                  <div className="d-flex align-items-center gap-2 min-width-0">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        background: current.bg,
                        color: current.color,
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-width-0">
                      <div className="fw-semibold text-dark small">
                        {ACTIVITY_LABELS[action] ||
                          action.replace(/_/g, " ")}
                      </div>

                      {activity.description && (
                        <div
                          className="text-muted"
                          style={{
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          {activity.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Badge and time */}
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: current.bg,
                        color: current.color,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "5px 9px",
                      }}
                    >
                      {current.badge}
                    </span>

                    <div
                      className="text-muted text-end"
                      style={{ fontSize: 11, minWidth: 115 }}
                    >
                      {date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <div>
                        {date.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default TabActivityContent;
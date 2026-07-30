"use client";

import React, {
  useEffect,
  useRef,
  useReducer,
  useState,
  useCallback,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { add, format, isValid, isPast } from "date-fns";
import {
  FiAlignLeft,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiEdit,
  FiTrash,
  FiPlus,
  FiFilter,
  FiCheckSquare,
  FiSquare,
  FiBriefcase,
  FiHome,
  FiUsers,
  FiLock,
  FiGift,
} from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaBuilding, FaUmbrella, FaPlane } from "react-icons/fa";

const HOLIDAY_SYNC_EVENT = "app:holidays-changed";

const broadcastHolidayChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(HOLIDAY_SYNC_EVENT));
  }
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 16);
}

const buildInitEvents = () => [
  { id: "1", title: "Office Meeting for design", start: addDays(new Date(), 1), end: addDays(new Date(), 1.0417), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "#5485e4" }, allDay: false, category: "Office" },
  { id: "2", title: "Family Dinner", start: addDays(new Date(), 2), end: addDays(new Date(), 2.0833), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Free", dotColor: "rgb(37, 184, 101)" }, allDay: false, category: "Family" },
  { id: "3", title: "Travel", start: addDays(new Date(), 30), end: addDays(new Date(), 30.0417), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "rgb(23, 162, 184)" }, allDay: false, category: "Travel" },
  { id: "4", title: "Birthdays", start: addDays(new Date(), 13), end: addDays(new Date(), 13.0417), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Free", dotColor: "rgb(71, 94, 119)" }, allDay: false, category: "Birthdays" },
  { id: "5", title: "Company", start: addDays(new Date(), 16), end: addDays(new Date(), 18), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "rgb(61, 199, 190)" }, allDay: false, category: "Company" },
  { id: "6", title: "Holidays", start: addDays(new Date(), 19), end: addDays(new Date(), 21), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Free", dotColor: "rgb(88, 86, 214)" }, allDay: false, category: "Holidays" },
  { id: "7", title: "Private", start: addDays(new Date(), 21), end: addDays(new Date(), 21.0417), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "rgb(228, 158, 61)" }, allDay: false, category: "Private" },
  { id: "8", title: "Office Meeting", start: addDays(new Date(), 26), end: addDays(new Date(), 27), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "#5485e4" }, allDay: true, category: "Office" },
  { id: "9", title: "Friend", start: addDays(new Date(), 15), end: addDays(new Date(), 16), details: { details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", location: "Bangladesh", position: "Busy", dotColor: "rgb(209, 59, 76)" }, allDay: true, category: "Friend" },
];

export const eventCategoryOptions = [
  { label: "Office",    value: "Office",    bgColor: "rgba(84,132,227,.12)",    color: "#5485e4",             icon: FiBriefcase,    gradient: "linear-gradient(135deg, #5485e4, #7c9ff5)" },
  { label: "Family",    value: "Family",    bgColor: "rgba(37,184,101,.12)",     color: "rgb(37,184,101)",     icon: FiHome,         gradient: "linear-gradient(135deg, #25b865, #52d489)" },
  { label: "Friend",    value: "Friend",    bgColor: "rgba(209,59,76,.12)",      color: "rgb(209,59,76)",      icon: FiUsers,        gradient: "linear-gradient(135deg, #d13b4c, #e86a78)" },
  { label: "Travel",    value: "Travel",    bgColor: "rgba(23,162,184,.12)",     color: "rgb(23,162,184)",     icon: FaPlane,        gradient: "linear-gradient(135deg, #17a2b8, #4bc8e0)" },
  { label: "Private",   value: "Private",   bgColor: "rgba(228,158,61,.12)",     color: "rgb(228,158,61)",     icon: FiLock,         gradient: "linear-gradient(135deg, #e49e3d, #f0b96a)" },
  { label: "Holidays",  value: "Holidays",  bgColor: "rgba(245,158,11,.12)",      color: "#f59e0b",     icon: FaUmbrella,     gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
  { label: "Company",   value: "Company",   bgColor: "rgba(61,199,190,.12)",     color: "rgb(61,199,190)",     icon: FaBuilding,     gradient: "linear-gradient(135deg, #3dc7be, #6edfd8)" },
  { label: "Birthdays", value: "Birthdays", bgColor: "rgba(71,94,119,.12)",      color: "rgb(71,94,119)",      icon: FiGift,         gradient: "linear-gradient(135deg, #475e77, #7a94b3)" },
];

export const eventOptions = [
  { label: "Free", value: "free" },
  { label: "Busy", value: "busy" },
];

const EVENTS_STORAGE_KEY = "calendar-events-v1";

const loadEventsFromStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const saveEventsToStorage = (events) => {
  if (typeof window === "undefined") return;
  try {
    const regularEvents = events.filter(e => !e.id?.toString().startsWith("holiday-"));
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(regularEvents));
  } catch {
    /* storage full or unavailable — silently ignore */
  }
};

const generateOffDays = (year, month) => {
  const events = [];
  let saturdayCount = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const day = date.getDay();
    if (day === 0) {
      events.push({
        id: `sunday-${year}-${month}-${d}`,
        title: "Sunday",
        start: date,
        allDay: true,
        backgroundColor: "#f1f5f9",
        borderColor: "#f1f5f9",
        textColor: "#94a3b8",
        category: "OffDay",
        extendedProps: { isOffDay: true },
      });
    }
    if (day === 6) {
      saturdayCount++;
      if (saturdayCount === 2 || saturdayCount === 4) {
        events.push({
          id: `saturday-${year}-${month}-${d}`,
          title: "Weekend",
          start: date,
          allDay: true,
          backgroundColor: "#dbeafe",
          borderColor: "#dbeafe",
          textColor: "#3b82f6",
          category: "OffDay",
          extendedProps: { isOffDay: true },
        });
      }
    }
  }
  return events;
};

const getEventsForDate = (events, date) => {
  const dateStr = format(date, "yyyy-MM-dd");
  return events.filter((e) => {
    if (e.category === "OffDay") return false;
    const s = new Date(e.start);
    if (!isValid(s)) return false;
    const en = e.end ? new Date(e.end) : s;
    const sStr = format(s, "yyyy-MM-dd");
    const enStr = isValid(en) ? format(en, "yyyy-MM-dd") : sStr;
    return dateStr >= sStr && dateStr <= enStr;
  });
};

const toPseudoEvent = (e) => ({
  id: e.id,
  title: e.title,
  start: e.start,
  end: e.end,
  allDay: e.allDay,
  extendedProps: { details: e.details, category: e.category },
});

const explodeMultiDayEvents = (events) => {
  const result = [];

  events.forEach((e) => {
    if (e.category === "OffDay") {
      result.push(e);
      return;
    }

    const s = new Date(e.start);
    if (!isValid(s)) {
      result.push(e);
      return;
    }
    const en = e.end ? new Date(e.end) : s;
    if (!isValid(en)) {
      result.push(e);
      return;
    }

    const startDayStr = format(s, "yyyy-MM-dd");
    const endDayStr = format(en, "yyyy-MM-dd");

    if (startDayStr === endDayStr) {
      result.push(e);
      return;
    }

    let cursor = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    const last = new Date(en.getFullYear(), en.getMonth(), en.getDate());
    let guard = 0;

    while (cursor <= last && guard < 400) {
      const dStr = format(cursor, "yyyy-MM-dd");
      result.push({
        ...e,
        id: `${e.id}__seg__${dStr}`,
        originalId: e.id,
        start: dStr,
        end: dStr,
        allDay: true,
      });
      cursor = add(cursor, { days: 1 });
      guard++;
    }
  });

  return result;
};

const FONT_DISPLAY = "'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: FONT_BODY,
    background: "#f0f4ff",
    overflow: "hidden",
  },

  leftPanel: {
    width: "340px",
    minWidth: "340px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
    borderRight: "1px solid rgba(84,133,228,.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "4px 0 20px rgba(84,133,228,.06)",
    transition: "all .3s ease",
    zIndex: 10,
  },
  leftPanelHeader: {
    padding: "28px 24px 24px",
    borderBottom: "1px solid rgba(84,133,228,.08)",
    background: "linear-gradient(135deg, #1a1f36 0%, #2d3561 50%, #3d4785 100%)",
    position: "relative",
    overflow: "hidden",
  },
  leftPanelHeaderBg: {
    position: "absolute",
    top: "-50%",
    right: "-20%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(84,133,228,.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  leftPanelLogo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
    position: "relative",
    zIndex: 1,
  },
  leftPanelLogoIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #5485e4, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "20px",
    boxShadow: "0 4px 14px rgba(84,133,228,.4)",
  },
  leftPanelTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "-0.4px",
  },
  leftPanelSubtitle: {
    fontSize: "12px",
    color: "rgba(255,255,255,.6)",
    margin: "2px 0 0",
    minHeight: "16px",
    fontWeight: "400",
  },
  newEventBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #5485e4, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
    letterSpacing: ".02em",
    boxShadow: "0 4px 20px rgba(84,133,228,.4)",
    position: "relative",
    zIndex: 1,
  },

  leftPanelBody: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 0",
    scrollbarWidth: "thin",
    scrollbarColor: "#e2e8f0 transparent",
  },

  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    padding: "8px 24px 12px",
    display: "flex",
    alignItems: "center",
  },

  categoryList: { padding: "4px 0 12px" },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "all .2s ease",
    borderRadius: "0",
    position: "relative",
    borderLeft: "3px solid transparent",
  },
  categoryDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,.15)",
  },
  categoryLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#334155",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  categoryCount: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "700",
    background: "#f1f5f9",
    padding: "2px 10px",
    borderRadius: "20px",
    minWidth: "26px",
    textAlign: "center",
  },

  scheduleCard: {
    margin: "6px 16px",
    borderRadius: "14px",
    padding: "14px 16px",
    cursor: "pointer",
    transition: "all .3s ease",
    border: "1px solid #f1f5f9",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,.02)",
  },
  scheduleDate: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  scheduleDateDay: { fontSize: "18px", fontWeight: "700", lineHeight: 1 },
  scheduleDateMon: { fontSize: "9px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".06em", marginTop: "2px" },
  scheduleBody: { flex: 1, minWidth: 0, marginLeft: "12px" },
  scheduleName: { fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  scheduleMeta: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  scheduleEmpty: { fontSize: "12px", color: "#94a3b8", padding: "6px 24px 12px" },

  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 28px",
    background: "rgba(255,255,255,.8)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(84,133,228,.08)",
    flexShrink: 0,
    gap: "12px",
    flexWrap: "wrap",
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  topBarRight: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },

  monthNavBtn: {
    width: "38px",
    height: "38px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
    transition: "all .25s ease",
    flexShrink: 0,
  },
  todayBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 18px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    transition: "all .25s ease",
  },
  currentMonthLabel: {
    fontFamily: FONT_DISPLAY,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    whiteSpace: "nowrap",
    letterSpacing: "-0.3px",
  },

  calendarWrap: {
    flex: 1,
    padding: "24px 28px",
    overflowY: "auto",
    background: "#f0f4ff",
  },
  calendarCard: {
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(84,133,228,.08)",
    overflow: "hidden",
    height: "100%",
    padding: "12px",
    border: "1px solid rgba(84,133,228,.06)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.6)",
    backdropFilter: "blur(8px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "540px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 32px 80px rgba(0,0,0,.25)",
    animation: "modalIn .3s cubic-bezier(.34,1.56,.64,1)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 28px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "linear-gradient(135deg, #1a1f36 0%, #2d3561 50%, #3d4785 100%)",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  modalTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  modalCloseBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,.1)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s ease",
    flexShrink: 0,
  },
  modalBody: { padding: "24px 28px 28px" },

  detailRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f8fafc",
  },
  detailIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    flexShrink: 0,
    marginTop: "2px",
  },
  detailLabel: { fontSize: "10px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "2px" },
  detailValue: { fontSize: "14px", color: "#0f172a", fontWeight: "500" },

  formGroup: { marginBottom: "16px" },
  formLabel: { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px", display: "block" },
  formInput: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all .2s ease",
    fontFamily: "inherit",
    background: "#fafbff",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all .2s ease",
    fontFamily: "inherit",
    background: "#fafbff",
    resize: "vertical",
    minHeight: "80px",
  },
  formRow: { display: "flex", gap: "14px" },
  formSelect: {
    flex: 1,
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    background: "#fafbff",
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #5485e4, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: ".02em",
    boxShadow: "0 4px 20px rgba(84,133,228,.35)",
    transition: "all .3s ease",
  },
  actionBtn: (variant) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all .3s ease",
    background: variant === "danger" ? "#fee2e2" : "#eff6ff",
    color: variant === "danger" ? "#dc2626" : "#2563eb",
  }),

  mobileMenuBtn: {
    display: "none",
    width: "38px",
    height: "38px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#fff",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
    flexShrink: 0,
  },
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap');

    * { box-sizing: border-box; }
    @keyframes modalIn {
      from { opacity:0; transform:scale(.92) translateY(20px); }
      to   { opacity:1; transform:scale(1)   translateY(0); }
    }
    @keyframes fadeSlideUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes toastIn {
      from { opacity:0; transform:translate(-50%, 16px); }
      to   { opacity:1; transform:translate(-50%, 0); }
    }
    @keyframes todayPulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(84,133,228,.45), 0 0 0 0 rgba(84,133,228,.35); }
      50%      { box-shadow: 0 4px 20px rgba(84,133,228,.55), 0 0 0 7px rgba(84,133,228,0); }
    }
    @keyframes todayRingPulse {
      0%, 100% { opacity: .55; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.015); }
    }
    .cal-form-input:focus {
      border-color: #5485e4 !important;
      background: #ffffff !important;
      box-shadow: 0 0 0 4px rgba(84,133,228,.1);
    }
    .cal-form-select:focus {
      border-color: #5485e4 !important;
      box-shadow: 0 0 0 4px rgba(84,133,228,.1);
    }
    .cal-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,.08);
    }
    .cal-submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(84,133,228,.45);
    }
    .cal-modal-close:hover { background: rgba(255,255,255,.2) !important; transform: rotate(90deg); }
    .cal-month-nav:hover {
      background: #5485e4 !important;
      border-color: #5485e4 !important;
      color: #fff !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(84,133,228,.3);
    }
    .cal-today-btn:hover {
      background: linear-gradient(135deg, #5485e4, #8b5cf6) !important;
      border-color: #5485e4 !important;
      color: #fff !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(84,133,228,.3);
    }
    .cal-new-event-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 28px rgba(84,133,228,.5);
    }
    .cal-category-item:hover {
      background: #f8faff;
      transform: translateX(4px);
    }
    .cal-category-item.active-cat {
      background: #f8faff;
    }
    .cal-schedule-card:hover {
      border-color: #5485e4 !important;
      box-shadow: 0 4px 20px rgba(84,133,228,.1);
      transform: translateY(-2px);
    }
    .cal-view-btn:hover {
      background: #f1f5f9 !important;
      transform: translateY(-1px);
    }
    .cal-view-btn.active {
      background: linear-gradient(135deg, #5485e4, #8b5cf6) !important;
      color: #fff !important;
      border-color: #5485e4 !important;
      box-shadow: 0 2px 12px rgba(84,133,228,.3);
    }
    .cal-popover-row:hover {
      background: #f8faff !important;
    }
    .cal-popover-close:hover {
      background: #fee2e2 !important;
      color: #dc2626 !important;
      transform: rotate(90deg);
    }

    .fc {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    .fc .fc-daygrid-day {
      padding: 4px !important;
      transition: all 0.2s ease;
    }
    .fc .fc-daygrid-day-frame {
      border-radius: 14px !important;
      border: 1px solid #f1f5f9 !important;
      min-height: 90px !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 10px 10px 8px !important;
      cursor: pointer !important;
      transition: box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease !important;
      position: relative !important;
    }
    .fc .fc-daygrid-day-frame:hover {
      border-color: #5485e4 !important;
      box-shadow: 0 8px 30px rgba(84,133,228,.14) !important;
      z-index: 2 !important;
    }
    .fc .fc-daygrid-day-top {
      display: flex !important;
      justify-content: flex-end !important;
      margin-bottom: 4px !important;
      position: relative;
      z-index: 1;
    }
    .fc .fc-daygrid-day-number {
      font-size: 15px !important;
      font-weight: 600 !important;
      color: #64748b !important;
      padding: 0 !important;
      text-decoration: none !important;
      float: none !important;
      text-align: right !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 50% !important;
      transition: all 0.3s ease !important;
      background: transparent !important;
    }

    .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
      background: linear-gradient(135deg, #5485e4, #8b5cf6) !important;
      color: white !important;
      font-weight: 800 !important;
      box-shadow: 0 4px 16px rgba(84,133,228,.45) !important;
      animation: todayPulse 2.6s ease-in-out infinite;
    }
    .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-frame {
      border: 1.5px solid #5485e4 !important;
      background: linear-gradient(180deg, #f8faff 0%, #eef1ff 100%) !important;
      box-shadow: 0 0 0 3px rgba(84,133,228,.12) !important;
    }
    .today-ring {
      position: absolute;
      inset: 0;
      border-radius: 14px;
      border: 1.5px solid rgba(84,133,228,.5);
      pointer-events: none;
      animation: todayRingPulse 2.6s ease-in-out infinite;
      z-index: 0;
    }
    .today-badge {
      position: absolute;
      bottom: 6px;
      left: 10px;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #fff;
      background: linear-gradient(135deg, #5485e4, #8b5cf6);
      padding: 2px 8px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(84,133,228,.4);
      z-index: 1;
      pointer-events: none;
    }

    .fc .fc-daygrid-day.fc-day-sat .fc-daygrid-day-number,
    .fc .fc-daygrid-day.fc-day-sun .fc-daygrid-day-number {
      color: #94a3b8 !important;
    }

    .fc .fc-col-header-cell-cushion {
      font-size: 12px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: .1em !important;
      color: #94a3b8 !important;
      text-decoration: none !important;
      padding: 14px 0 !important;
    }
    .fc .fc-toolbar { display:none !important; }
    .fc .fc-scrollgrid { border:none !important; }
    .fc .fc-scrollgrid-sync-table td, .fc .fc-scrollgrid-sync-table th { border-color:#f1f5f9 !important; }
    .fc .fc-scrollgrid > * > tr > td { border:none; }
    .fc .fc-scrollgrid > thead > tr > th { border:none; border-bottom:2px solid #f1f5f9 !important; }

    .fc .fc-daygrid-day-events {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 4px !important;
      margin-top: 4px !important;
      min-height: 0 !important;
    }
    .fc .fc-daygrid-day-events .fc-daygrid-event-harness {
      width: auto !important;
      margin: 0 !important;
      position: static !important;
    }
    .fc .fc-daygrid-day-events .fc-daygrid-event-harness-abs {
      position: static !important;
      inset: auto !important;
    }
    .fc .fc-daygrid-day-bottom { display: none !important; }

    .fc-daygrid-event {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(.34,1.56,.64,1) !important;
      animation: fadeSlideUp 0.3s ease;
      position: relative;
      z-index: 1;
    }
    .fc-daygrid-event:hover { z-index: 10 !important; }
    .fc-daygrid-event .fc-event-main {
      padding: 0 !important;
    }

    .event-icon-badge {
      width: 24px !important;
      height: 24px !important;
      border-radius: 6px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      transition: transform .2s cubic-bezier(.34,1.56,.64,1) !important;
      flex-shrink: 0 !important;
    }
    .event-icon-badge:hover {
      transform: scale(1.15) !important;
    }
    .event-icon-badge svg {
      width: 12px !important;
      height: 12px !important;
    }

    .event-pill {
      display: flex !important;
      align-items: center !important;
      padding: 2px 6px !important;
      border-radius: 6px !important;
      font-size: 9px !important;
      font-weight: 600 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      gap: 3px !important;
      flex-shrink: 0;
    }
    .event-pill.offday-event {
      background: #f1f5f9 !important;
      color: #94a3b8 !important;
      box-shadow: none !important;
      opacity: 0.8 !important;
    }
    .event-pill.offday-event .event-title {
      color: #94a3b8 !important;
      font-size: 8px !important;
      font-weight: 600 !important;
    }

    .mobile-sidebar-overlay { display:none; }

    @media (max-width: 1100px) {
      .cal-left-panel { width: 300px !important; min-width: 300px !important; }
    }

    @media (max-width: 768px) {
      .cal-left-panel {
        position: fixed !important;
        left: 0; top: 0; bottom: 0;
        width: 85vw !important;
        max-width: 340px !important;
        min-width: 0 !important;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform .3s cubic-bezier(.34,1.56,.64,1) !important;
      }
      .cal-left-panel.open { transform: translateX(0) !important; }
      .mobile-sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(4px); z-index: 999; }
      .cal-mobile-btn { display: flex !important; }
      .cal-calendar-wrap { padding: 12px !important; }
      .cal-topbar { padding: 12px 16px !important; }
      .cal-current-month { display: none; }
      .cal-view-switcher { order: 3; width: 100%; justify-content: space-between !important; margin-top: 4px; }
      .cal-new-event-btn-top span { display: none; }

      .fc .fc-daygrid-day-frame {
        min-height: 70px !important;
        padding: 7px 6px 5px !important;
      }
      .fc .fc-daygrid-day-number {
        font-size: 13px !important;
        width: 28px !important;
        height: 28px !important;
      }
      .event-icon-badge {
        width: 20px !important;
        height: 20px !important;
        border-radius: 5px !important;
      }
      .event-icon-badge svg {
        width: 10px !important;
        height: 10px !important;
      }
      .event-pill {
        padding: 2px 6px !important;
      }
      .event-pill .event-title {
        font-size: 8px !important;
      }
      .fc .fc-daygrid-day {
        padding: 3px !important;
      }
      .today-badge {
        font-size: 7.5px !important;
        padding: 1.5px 6px !important;
        bottom: 4px !important;
        left: 6px !important;
      }
    }

    @media (max-width: 480px) {
      .cal-modal-body { padding: 16px 20px !important; }
      .cal-form-row { flex-direction: column; gap: 0 !important; }
      .cal-today-btn span { display: none; }
      .cal-topbar { padding: 10px 12px !important; }

      .fc .fc-daygrid-day-frame {
        min-height: 60px !important;
        padding: 6px 5px 4px !important;
        border-radius: 10px !important;
      }
      .fc .fc-daygrid-day-number {
        font-size: 11px !important;
        width: 24px !important;
        height: 24px !important;
      }
      .event-icon-badge {
        width: 16px !important;
        height: 16px !important;
        border-radius: 4px !important;
      }
      .event-icon-badge svg {
        width: 8px !important;
        height: 8px !important;
      }
      .event-pill {
        font-size: 7px !important;
        padding: 1px 4px !important;
        border-radius: 4px !important;
      }
      .event-pill .event-title {
        font-size: 6px !important;
      }
      .today-badge { display: none; }
    }
  `}</style>
);

const PopupModal = ({ title, onClose, children, icon }) => (
  <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={styles.modal}>
      <div style={styles.modalHeader}>
        <h3 style={styles.modalTitle}>
          {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
          {title}
        </h3>
        <button style={styles.modalCloseBtn} className="cal-modal-close" onClick={onClose}>
          <IoMdClose size={18} />
        </button>
      </div>
      <div className="cal-modal-body" style={styles.modalBody}>{children}</div>
    </div>
  </div>
);

const ConfirmDialog = ({ title, message, confirmLabel = "Delete", onConfirm, onCancel }) => (
  <div style={{ ...styles.overlay, zIndex: 10001 }} onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div style={{ ...styles.modal, maxWidth: "380px" }}>
      <div style={{ padding: "28px 26px 20px", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#fee2e2", color: "#dc2626",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: "22px",
        }}>
          <FiTrash size={22} />
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>{message}</p>
      </div>
      <div style={{ display: "flex", gap: "12px", padding: "0 26px 26px" }}>
        <button
          className="cal-action-btn"
          style={{ ...styles.actionBtn("neutral"), background: "#f1f5f9", color: "#475569" }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="cal-action-btn"
          style={{ ...styles.actionBtn("danger") }}
          onClick={onConfirm}
        >
          <FiTrash size={14} /> {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const Toast = ({ message, variant = "success" }) => {
  const palette = variant === "success"
    ? { bg: "linear-gradient(135deg, #25b865, #52d489)", icon: <FiCheckSquare size={16} /> }
    : { bg: "linear-gradient(135deg, #dc2626, #ef4444)", icon: <FiTrash size={16} /> };
  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        background: palette.bg,
        color: "#fff",
        padding: "13px 22px",
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 12px 32px rgba(0,0,0,.22)",
        zIndex: 10002,
        animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1)",
        letterSpacing: ".01em",
      }}
    >
      {palette.icon}
      {message}
    </div>
  );
};

const DayEventsPopover = ({ popover, onView, onEdit, onDelete, onClose, onMouseEnter, onMouseLeave }) => {
  if (!popover) return null;
  const { rect, events, dateStr } = popover;

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;

  const width = Math.min(288, viewportW - 24);

  let left = rect.left;
  if (left + width > viewportW - 12) left = viewportW - width - 12;
  if (left < 12) left = 12;

  const OVERLAP = 8;
  const estimatedHeight = Math.min(320, 70 + events.length * 54);
  let top = rect.bottom - OVERLAP;
  let placeAbove = false;
  if (top + estimatedHeight > viewportH - 12) {
    top = rect.top - estimatedHeight + OVERLAP;
    placeAbove = true;
    if (top < 12) top = 12;
  }

  return (
    <div
      data-day-popover-root="1"
      style={{
        position: "fixed",
        left,
        top,
        width,
        maxHeight: "320px",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: placeAbove
          ? "0 -16px 40px rgba(15,23,42,.2)"
          : "0 20px 50px rgba(15,23,42,.2)",
        border: "1px solid rgba(84,133,228,.1)",
        zIndex: 9998,
        padding: placeAbove ? "10px 10px 18px" : "18px 10px 10px",
        animation: "fadeSlideUp .2s ease",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "4px 6px 8px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: ".08em",
          }}
        >
          {isValid(new Date(dateStr)) ? format(new Date(dateStr), "EEEE, MMM d") : dateStr}
        </div>
        {onClose && (
          <button
            type="button"
            className="cal-popover-close"
            title="Close"
            onClick={onClose}
            style={{
              width: "22px", height: "22px", border: "none", borderRadius: "7px",
              background: "#f1f5f9", color: "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, transition: "all .2s ease",
            }}
          >
            <IoMdClose size={13} />
          </button>
        )}
      </div>

      {events.map((ev) => {
        const cat = eventCategoryOptions.find((c) => c.value === ev.category);
        const isHoliday = ev.category === "Holidays";
        const IconComponent = cat?.icon || FiCalendar;
        const color = isHoliday ? "#f59e0b" : (cat?.color || "#64748b");
        const start = new Date(ev.start);
        const isEventExpired = isPast(new Date(ev.start));

        return (
          <div
            key={ev.id}
            className="cal-popover-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background .2s ease",
              opacity: isEventExpired ? 0.6 : 1,
            }}
            onClick={() => onView(ev)}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9px",
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconComponent size={13} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12.5px",
                  fontWeight: "600",
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ev.title}
              </div>
              <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                {ev.allDay ? "All day" : (isValid(start) ? format(start, "hh:mm a") : "")}
                {isEventExpired && " (Expired)"}
              </div>
            </div>
            {!isEventExpired && (
              <>
                <button
                  type="button"
                  title="Edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(ev); }}
                  style={{
                    width: "26px", height: "26px", border: "none", borderRadius: "8px",
                    background: "#eff6ff", color: "#2563eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <FiEdit size={12} />
                </button>
              </>
            )}
            <button
              type="button"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(ev); }}
              style={{
                width: "26px", height: "26px", border: "none", borderRadius: "8px",
                background: "#fee2e2", color: "#dc2626",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <FiTrash size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const formatEventTimeTwo = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return isValid(d) ? format(d, "MMM dd, yyyy") : null;
};

const EventDetails = ({ selectedEvent, handleEditEvent, handleDeleteEvent }) => {
  const cat = eventCategoryOptions.find(c => c.value === selectedEvent.extendedProps.category);
  const IconComponent = cat?.icon;
  const startLabel = formatEventTimeTwo(selectedEvent.start);
  const rawEnd = selectedEvent.end ? new Date(selectedEvent.end) : null;
  const displayEnd = rawEnd && isValid(rawEnd)
    ? (selectedEvent.allDay ? add(rawEnd, { days: -1 }) : rawEnd)
    : null;
  const endLabel = displayEnd && format(displayEnd, "yyyy-MM-dd") !== format(new Date(selectedEvent.start), "yyyy-MM-dd")
    ? formatEventTimeTwo(displayEnd)
    : null;
  const isEventExpired = isPast(new Date(selectedEvent.start));

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
          {cat && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: cat.color, color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", boxShadow: `0 2px 8px ${cat.color}55` }}>
              {IconComponent && <IconComponent size={12} />}
              {cat.label}
            </span>
          )}
          {isEventExpired && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dc2626", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
              Expired
            </span>
          )}
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{selectedEvent.title}</h2>
      </div>

      {startLabel && (
        <div style={styles.detailRow}>
          <div style={styles.detailIcon}><FiCalendar size={15} /></div>
          <div>
            <div style={styles.detailLabel}>Start</div>
            <div style={styles.detailValue}>{startLabel}</div>
          </div>
        </div>
      )}

      {endLabel && (
        <div style={styles.detailRow}>
          <div style={styles.detailIcon}><FiCalendar size={15} /></div>
          <div>
            <div style={styles.detailLabel}>End</div>
            <div style={styles.detailValue}>{endLabel}</div>
          </div>
        </div>
      )}

      <div style={styles.detailRow}>
        <div style={styles.detailIcon}><FiMapPin size={15} /></div>
        <div>
          <div style={styles.detailLabel}>Location</div>
          <div style={styles.detailValue}>{selectedEvent.extendedProps.details?.location || "—"}</div>
        </div>
      </div>
      {selectedEvent.extendedProps.details?.details && (
        <div style={{ ...styles.detailRow, borderBottom: "none" }}>
          <div style={styles.detailIcon}><FiAlignLeft size={15} /></div>
          <div>
            <div style={styles.detailLabel}>Description</div>
            <div style={{ ...styles.detailValue, color: "#475569", lineHeight: "1.6" }}>{selectedEvent.extendedProps.details.details}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
        {!isEventExpired && (
          <button className="cal-action-btn" style={styles.actionBtn("edit")} onClick={() => handleEditEvent()}>
            <FiEdit size={14} /> Edit Event
          </button>
        )}
        <button className="cal-action-btn" style={styles.actionBtn("danger")} onClick={() => handleDeleteEvent()}>
          <FiTrash size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

// ===== FIXED AddEventForm with optional End Date =====
const AddEventForm = ({ eventDate, onSubmit }) => {
  const [title, setTitle]         = useState("");
  const [location, setLocation]   = useState("");
  const [details, setDetails]     = useState("");
  const [category, setCategory]   = useState("Office");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);

  useEffect(() => {
    if (eventDate?.start) {
      const d = new Date(eventDate.start);
      if (isValid(d)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setStartDate(`${year}-${month}-${day}`);
      }
    }
    if (eventDate?.end) {
      const d = new Date(eventDate.end);
      if (isValid(d)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setEndDate(`${year}-${month}-${day}`);
        setIsMultiDay(true);
      }
    }
  }, [eventDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !startDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    const cat = eventCategoryOptions.find(c => c.value === category);
    
    // If end date is not provided, use start date (single day event)
    const finalEndDate = endDate || startDate;
    
    const newEvent = {
      id: Date.now().toString(),
      title,
      category,
      start: startDate,
      end: finalEndDate,
      details: { 
        location: location || "", 
        details: details || "", 
        dotColor: cat?.color || "#5485e4" 
      },
      allDay: true,
    };
    onSubmit(newEvent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Category</label>
        <select className="cal-form-select" style={styles.formSelect} value={category} onChange={e => setCategory(e.target.value)}>
          {eventCategoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Event Title *</label>
        <input className="cal-form-input" style={styles.formInput} type="text" placeholder="e.g. Team Meeting" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Location</label>
        <input className="cal-form-input" style={styles.formInput} type="text" placeholder="e.g. Conference Room A" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Description</label>
        <textarea className="cal-form-input" style={styles.formTextarea} placeholder="Add details about this event…" value={details} onChange={e => setDetails(e.target.value)} />
      </div>

      <div className="cal-form-row" style={styles.formRow}>
        <div style={{ flex: 1, ...styles.formGroup }}>
          <label style={styles.formLabel}>Start Date *</label>
          <input className="cal-form-input" style={styles.formInput} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div style={{ flex: 1, ...styles.formGroup }}>
          <label style={styles.formLabel}>
            End Date 
            <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "400", marginLeft: "4px" }}>(Optional)</span>
          </label>
          <input className="cal-form-input" style={styles.formInput} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          {!endDate && (
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
              <FiCalendar size={10} style={{ marginRight: "4px" }} />
              Leave empty for single-day event
            </div>
          )}
        </div>
      </div>

      <button className="cal-submit-btn" style={styles.submitBtn} type="submit">
        ＋ Add Event
      </button>
    </form>
  );
};

// ===== FIXED EditEventForm with optional End Date =====
const EditEventForm = ({ event, onSubmit }) => {
  const [title, setTitle]       = useState(event.title);
  const [location, setLocation] = useState(event.extendedProps.details?.location || "");
  const [details, setDetails]   = useState(event.extendedProps.details?.details || "");
  const [category, setCategory] = useState(event.extendedProps.category || "Office");
  const [startDate, setStartDate] = useState(() => {
    if (!event.start) return "";
    const d = new Date(event.start);
    return isValid(d) ? format(d, "yyyy-MM-dd") : "";
  });
  const [endDate, setEndDate] = useState(() => {
    if (!event.end) return "";
    const d = new Date(event.end);
    if (!isValid(d)) return "";
    // If start and end are same, don't show end date
    if (format(d, "yyyy-MM-dd") === format(new Date(event.start), "yyyy-MM-dd")) {
      return "";
    }
    return format(d, "yyyy-MM-dd");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = eventCategoryOptions.find(c => c.value === category);
    const finalEndDate = endDate || startDate;
    const updatedEvent = {
      ...event,
      title,
      category,
      start: startDate,
      end: finalEndDate,
      details: { location, details, dotColor: cat?.color || "#5485e4" },
      allDay: true,
    };
    onSubmit(updatedEvent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Category</label>
        <select className="cal-form-select" style={styles.formSelect} value={category} onChange={e => setCategory(e.target.value)}>
          {eventCategoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Event Title *</label>
        <input className="cal-form-input" style={styles.formInput} type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Location</label>
        <input className="cal-form-input" style={styles.formInput} type="text" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Description</label>
        <textarea className="cal-form-input" style={styles.formTextarea} value={details} onChange={e => setDetails(e.target.value)} />
      </div>

      <div className="cal-form-row" style={styles.formRow}>
        <div style={{ flex: 1, ...styles.formGroup }}>
          <label style={styles.formLabel}>Start Date *</label>
          <input className="cal-form-input" style={styles.formInput} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div style={{ flex: 1, ...styles.formGroup }}>
          <label style={styles.formLabel}>
            End Date 
            <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "400", marginLeft: "4px" }}>(Optional)</span>
          </label>
          <input className="cal-form-input" style={styles.formInput} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          {!endDate && (
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
              <FiCalendar size={10} style={{ marginRight: "4px" }} />
              Leave empty for single-day event
            </div>
          )}
        </div>
      </div>

      <button className="cal-submit-btn" style={styles.submitBtn} type="submit">
        Save Changes
      </button>
    </form>
  );
};

const initialState = {
  events: [],
  holidayEvents: [],
  offDayEvents: [],
  isWeekMonday: 0,
  showWeekends: true,
  currentMonth: "",
  todayLabel: "",
  selectedEvent: null,
  newEventDate: null,
  selectAll: true,
  selectedCategories: {
    Office: true, Family: true, Friend: true, Travel: true,
    Private: true, Holidays: true, Company: true, Birthdays: true,
  },
  calView: "dayGridMonth",
  calViewLabel: "Monthly",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":            return { ...state, events: action.payload };
    case "SET_HOLIDAY_EVENTS":    return { ...state, holidayEvents: action.payload };
    case "SET_OFF_DAY_EVENTS":    return { ...state, offDayEvents: action.payload };
    case "SET_WEEK_MONDAY":       return { ...state, isWeekMonday: action.payload };
    case "SET_SHOW_WEEKENDS":     return { ...state, showWeekends: action.payload };
    case "SET_CURRENT_MONTH":     return { ...state, currentMonth: action.payload };
    case "SET_TODAY_LABEL":       return { ...state, todayLabel: action.payload };
    case "SET_SELECTED_EVENT":    return { ...state, selectedEvent: action.payload };
    case "SET_NEW_EVENT_DATE":    return { ...state, newEventDate: action.payload };
    case "SET_SELECT_ALL":        return { ...state, selectAll: action.payload };
    case "SET_SELECTED_CATEGORIES": return { ...state, selectedCategories: action.payload };
    case "SET_CAL_VIEW":          return { ...state, calView: action.payload.view, calViewLabel: action.payload.label };
    default: return state;
  }
};

const CalendarView = () => {
  const calendarRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [dayPopover, setDayPopover] = useState(null);
  const popoverHideTimerRef = useRef(null);

  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false
  );

  const showToast = (message, variant = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, variant });
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    setMounted(true);

    const now = new Date();
    const storedEvents = loadEventsFromStorage();
    dispatch({ type: "SET_EVENTS", payload: storedEvents !== null ? storedEvents : buildInitEvents() });
    dispatch({ type: "SET_TODAY_LABEL", payload: format(now, "EEEE, MMM d") });
    dispatch({ type: "SET_CURRENT_MONTH", payload: format(now, "MMMM yyyy") });
    dispatch({ type: "SET_OFF_DAY_EVENTS", payload: generateOffDays(now.getFullYear(), now.getMonth()) });

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (popoverHideTimerRef.current) clearTimeout(popoverHideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveEventsToStorage(state.events);
  }, [state.events, mounted]);

  const loadHolidays = useCallback(async () => {
    try {
      const res = await fetch("/api/holidays", { 
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        }
      });
      const data = await res.json();
      if (!data.success) {
        console.error("Failed to load holidays:", data.error);
        return;
      }
      
      const holidayEvents = data.holidaysList.map(h => {
        const dateStr = h.date;
        return {
          id: `holiday-${h.id}`,
          title: h.name,
          start: dateStr,
          end: dateStr,
          allDay: true,
          category: "Holidays",
          backgroundColor: "#f59e0b",
          borderColor: "#f59e0b",
          textColor: "#ffffff",
          details: {
            location: "",
            position: "free",
            details: h.description || "",
            dotColor: "#f59e0b",
          },
          display: "block",
        };
      });
      
      dispatch({
        type: "SET_HOLIDAY_EVENTS",
        payload: holidayEvents,
      });
    } catch (error) {
      console.error("Failed to load holidays:", error);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    loadHolidays();

    const handleExternalSync = () => {
      loadHolidays();
    };
    
    window.addEventListener(HOLIDAY_SYNC_EVENT, handleExternalSync);
    return () => window.removeEventListener(HOLIDAY_SYNC_EVENT, handleExternalSync);
  }, [mounted, loadHolidays]);

  const handleCategoryChange = (cat) => {
    const updated = { ...state.selectedCategories, [cat]: !state.selectedCategories[cat] };
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: updated });
    dispatch({ type: "SET_SELECT_ALL", payload: Object.values(updated).every(Boolean) });
  };
  const handleAllCategory = () => {
    const next = !state.selectAll;
    const updated = Object.fromEntries(Object.keys(state.selectedCategories).map(k => [k, next]));
    dispatch({ type: "SET_SELECT_ALL", payload: next });
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: updated });
  };

  const filteredEvents = [
    ...state.events.filter(e => state.selectedCategories[e.category]),
    ...state.holidayEvents.filter(() => state.selectedCategories.Holidays),
    ...state.offDayEvents,
  ];

  const calendarDisplayEvents = explodeMultiDayEvents(filteredEvents);

  const filteredEventsRef = useRef(filteredEvents);
  useEffect(() => {
    filteredEventsRef.current = filteredEvents;
  }, [filteredEvents]);

  const clearPopoverHideTimer = () => {
    if (popoverHideTimerRef.current) {
      clearTimeout(popoverHideTimerRef.current);
      popoverHideTimerRef.current = null;
    }
  };
  const openDayPopover = (payload) => {
    clearPopoverHideTimer();
    setDayPopover(payload);
  };
  const scheduleClosePopover = () => {
    clearPopoverHideTimer();
    popoverHideTimerRef.current = setTimeout(() => setDayPopover(null), 300);
  };
  const closePopoverNow = () => {
    clearPopoverHideTimer();
    setDayPopover(null);
  };

  const openDayPopoverRef = useRef(openDayPopover);
  const scheduleClosePopoverRef = useRef(scheduleClosePopover);
  useEffect(() => {
    openDayPopoverRef.current = openDayPopover;
    scheduleClosePopoverRef.current = scheduleClosePopover;
  });

  const openAddModal = (start = new Date(), end = new Date()) => {
    dispatch({ type: "SET_NEW_EVENT_DATE", payload: { start, end } });
    setIsAddOpen(true);
  };

  const handleDateClick = (info) => {
    if (isTouchDevice) {
      const dayEvents = getEventsForDate(filteredEventsRef.current, info.date);
      if (dayEvents.length > 0) {
        const rect = info.dayEl.getBoundingClientRect();
        openDayPopover({
          dateStr: format(info.date, "yyyy-MM-dd"),
          rect,
          events: dayEvents,
        });
        return;
      }
    }
    openAddModal(info.date, info.date);
  };
  const handleSelect = (info) => openAddModal(info.start, info.end);

  const findFullEventById = (id) => {
    const idStr = id?.toString();
    return (
      state.events.find(e => e.id.toString() === idStr) ||
      state.holidayEvents.find(e => e.id.toString() === idStr) ||
      null
    );
  };

  const handleEventClick = (info) => {
    if (!info.event.extendedProps?.details) return;
    const originalId = info.event.extendedProps?.originalId || info.event.id;
    const full = findFullEventById(originalId);

    const eventToShow = full
      ? toPseudoEvent(full)
      : {
          id: originalId,
          title: info.event.title,
          start: info.event.start,
          end: info.event.end,
          allDay: info.event.allDay,
          extendedProps: {
            details: info.event.extendedProps.details,
            category: info.event.extendedProps.category,
          },
        };

    dispatch({ type: "SET_SELECTED_EVENT", payload: eventToShow });
    setIsDetailOpen(true);
    closePopoverNow();
  };

  // ===== FIXED handleAddSubmit =====
  const handleAddSubmit = async (ev) => {
    try {
      if (ev.category === "Holidays") {
        const dateStr = ev.start.split('T')[0];
        
        const response = await fetch("/api/holidays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ev.title,
            date: dateStr,
            description: ev.details?.details || "",
            type: "FESTIVAL",
          }),
        });
        
        if (!response.ok) {
          let errorMessage = "Failed to add holiday";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
          showToast(errorMessage, "danger");
          return;
        }
        
        const data = await response.json();
        if (data.success) {
          const newHolidayEvent = {
            ...ev,
            id: `holiday-${data.holiday?.id || Date.now()}`,
          };
          dispatch({ 
            type: "SET_HOLIDAY_EVENTS", 
            payload: [...state.holidayEvents, newHolidayEvent] 
          });
          showToast("Holiday added successfully", "success");
          broadcastHolidayChange();
          setIsAddOpen(false);
        } else {
          showToast(data.message || "Failed to add holiday", "danger");
        }
      } else {
        dispatch({ type: "SET_EVENTS", payload: [...state.events, ev] });
        showToast("Event added successfully", "success");
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error("Failed to add event:", error);
      showToast("Failed to add event: " + (error.message || "Unknown error"), "danger");
    }
  };

  // ===== FIXED handleDeleteEvent =====
  const handleDeleteEvent = (targetOverride) => {
    const target = targetOverride || state.selectedEvent;
    if (!target) return;
    setIsDetailOpen(false);
    closePopoverNow();
    setConfirmAction({
      title: "Delete this event?",
      message: `"${target.title}" will be permanently removed from your calendar.`,
      onConfirm: async () => {
        try {
          const targetId = target.id?.toString();

          if (targetId?.startsWith("holiday-")) {
            const holidayId = targetId.replace("holiday-", "");
            const response = await fetch(`/api/holidays/${holidayId}`, {
              method: "DELETE",
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Server error:", errorText);
              showToast("Failed to delete holiday", "danger");
              setConfirmAction(null);
              return;
            }
            
            const data = await response.json();
            if (data.success) {
              dispatch({
                type: "SET_HOLIDAY_EVENTS",
                payload: state.holidayEvents.filter(
                  (e) => e.id.toString() !== targetId
                ),
              });
              broadcastHolidayChange();
              showToast("Holiday deleted", "danger");
            } else {
              showToast(data.message || "Failed to delete holiday", "danger");
            }
          } else {
            const nextEvents = state.events.filter(
              (e) => e.id.toString() !== targetId
            );

            if (nextEvents.length === state.events.length) {
              console.warn(
                "Delete no-op: no event matched id",
                targetId,
                state.events.map((e) => e.id)
              );
              setConfirmAction(null);
              showToast("Could not find that event to delete", "danger");
              return;
            }

            dispatch({ type: "SET_EVENTS", payload: nextEvents });
            showToast("Event deleted", "danger");
          }

          setConfirmAction(null);
          dispatch({ type: "SET_SELECTED_EVENT", payload: null });
        } catch (error) {
          console.error("Failed to delete:", error);
          showToast("Failed to delete event", "danger");
        }
      },
    });
  };

  const handleEditEvent = (targetOverride) => {
    if (targetOverride) {
      const originalId = targetOverride.extendedProps?.originalId || targetOverride.id;
      const full = findFullEventById(originalId);
      dispatch({ type: "SET_SELECTED_EVENT", payload: full ? toPseudoEvent(full) : targetOverride });
    }
    setIsDetailOpen(false);
    closePopoverNow();
    setIsEditOpen(true);
  };

  // ===== FIXED handleEditSubmit =====
  const handleEditSubmit = async (ev) => {
    const eventId = ev.id?.toString();
    const isHoliday = eventId?.startsWith("holiday-");

    if (isHoliday) {
      const holidayId = eventId.replace("holiday-", "");
      try {
        const response = await fetch(`/api/holidays/${holidayId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ev.title,
            date: ev.start.split("T")[0],
            description: ev.details?.details || "",
            type: "FESTIVAL",
          }),
        });
        
        if (!response.ok) {
          let errorMessage = "Failed to update holiday";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
          showToast(errorMessage, "danger");
          setIsEditOpen(false);
          return;
        }
        
        const data = await response.json();
        if (data.success) {
          dispatch({
            type: "SET_HOLIDAY_EVENTS",
            payload: state.holidayEvents.map(e =>
              e.id.toString() === eventId
                ? { ...e, title: ev.title, start: ev.start, end: ev.end, details: ev.details, allDay: ev.allDay }
                : e
            ),
          });
          broadcastHolidayChange();
          showToast("Holiday updated successfully", "success");
        } else {
          showToast(data.message || "Failed to update holiday", "danger");
        }
      } catch (error) {
        console.error("Failed to sync holiday update to server:", error);
        showToast("Failed to update holiday", "danger");
      }
      setIsEditOpen(false);
      return;
    }

    dispatch({
      type: "SET_EVENTS",
      payload: state.events.map(e => {
        const otherId = ev.id?.toString() || ev._def?.publicId?.toString();
        return e.id.toString() === otherId
          ? {
              ...e,
              title: ev.title,
              category: ev.category,
              start: ev.start,
              end: ev.end,
              details: ev.details,
              allDay: ev.allDay
            }
          : e;
      }),
    });
    setIsEditOpen(false);
    showToast("Event updated successfully", "success");
  };

  const handleDatesSet = (info) => {
    const d = info.view.currentStart;
    dispatch({ type: "SET_OFF_DAY_EVENTS", payload: generateOffDays(d.getFullYear(), d.getMonth()) });
    dispatch({ type: "SET_CURRENT_MONTH",  payload: format(d, "MMMM yyyy") });
    closePopoverNow();
  };

  const handleViewFromPopover = (ev) => {
    dispatch({ type: "SET_SELECTED_EVENT", payload: toPseudoEvent(ev) });
    setIsDetailOpen(true);
    closePopoverNow();
  };
  const handleEditFromPopover = (ev) => handleEditEvent(toPseudoEvent(ev));
  const handleDeleteFromPopover = (ev) => handleDeleteEvent(toPseudoEvent(ev));

  const renderEventContent = (info) => {
    const category = info.event.extendedProps.category;
    const isOffDay = category === "OffDay" || info.event.extendedProps.isOffDay;

    if (isOffDay) {
      return (
        <div className="event-pill offday-event">
          <span className="event-title">{info.event.title}</span>
        </div>
      );
    }

    const isHoliday = category === "Holidays";
    const cat = eventCategoryOptions.find(c => c.value === category);
    const IconComponent = cat?.icon || FiCalendar;
    const bg = isHoliday ? "#f59e0b" : (cat?.color || "#64748b");

    return (
      <div 
        className="event-icon-badge" 
        style={{ 
          background: bg,
        }} 
        title={info.event.title}
      >
        <IconComponent size={12} color="#ffffff" />
      </div>
    );
  };

  const viewOptions = [
    { label: "Daily",   value: "timeGridDay"  },
    { label: "Weekly",  value: "timeGridWeek" },
    { label: "Monthly", value: "dayGridMonth" },
  ];

  const countFor = (cat) => state.events.filter(e => e.category === cat).length;

  const upcomingEvents = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return [...state.events, ...state.holidayEvents]
      .filter((e) => {
        const s = new Date(e.start);
        return isValid(s) && s >= startOfToday;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  }, [state.events, state.holidayEvents]);

  const applyDayColorCoding = (arg) => {
    const frame = arg.el.querySelector(".fc-daygrid-day-frame");
    if (!frame) return;

    frame.style.background = "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)";

    const existingRing = frame.querySelector(".today-ring");
    const existingBadge = frame.querySelector(".today-badge");
    if (arg.isToday) {
      if (!existingRing) {
        const ring = document.createElement("div");
        ring.className = "today-ring";
        frame.appendChild(ring);
      }
      if (!existingBadge) {
        const badge = document.createElement("span");
        badge.className = "today-badge";
        badge.textContent = "Today";
        frame.appendChild(badge);
      }
    } else {
      if (existingRing) existingRing.remove();
      if (existingBadge) existingBadge.remove();
    }
  };

  const handleDayCellDidMount = (arg) => {
    applyDayColorCoding(arg);

    if (isTouchDevice) return;
    if (arg.el.dataset.hoverBound) return;
    arg.el.dataset.hoverBound = "1";

    arg.el.addEventListener("mouseenter", () => {
      const dayEvents = getEventsForDate(filteredEventsRef.current, arg.date);
      if (dayEvents.length === 0) return;
      const rect = arg.el.getBoundingClientRect();
      openDayPopoverRef.current({
        dateStr: format(arg.date, "yyyy-MM-dd"),
        rect,
        events: dayEvents,
      });
    });
    arg.el.addEventListener("mouseleave", (e) => {
      const related = e.relatedTarget;
      if (related && related.closest && related.closest('[data-day-popover-root]')) {
        return;
      }
      scheduleClosePopoverRef.current();
    });
  };

  if (!mounted) {
    return (
      <>
        <GlobalStyles />
        <div style={styles.wrapper}>
          <div className="cal-left-panel" style={styles.leftPanel}>
            <div style={styles.leftPanelHeader}>
              <div style={styles.leftPanelHeaderBg} />
              <div style={styles.leftPanelLogo}>
                <div style={styles.leftPanelLogoIcon}><FiCalendar size={18} /></div>
                <div>
                  <p style={styles.leftPanelTitle}>My Calendar</p>
                  <p style={styles.leftPanelSubtitle}>&nbsp;</p>
                </div>
              </div>
              <button style={{ ...styles.newEventBtn, opacity: 0.6, cursor: "default" }} disabled>
                <FiPlus size={16} /> New Event
              </button>
            </div>
            <div style={styles.leftPanelBody} />
          </div>
          <div style={styles.rightPanel}>
            <div className="cal-topbar" style={styles.topBar}>
              <span style={styles.currentMonthLabel}>&nbsp;</span>
            </div>
            <div className="cal-calendar-wrap" style={styles.calendarWrap}>
              <div style={styles.calendarCard} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />

      <div style={styles.wrapper}>

        {mobileSidebarOpen && (
          <div className="mobile-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
        )}

        <div
          className={`cal-left-panel${mobileSidebarOpen ? " open" : ""}`}
          style={styles.leftPanel}
        >
          <div style={styles.leftPanelHeader}>
            <div style={styles.leftPanelHeaderBg} />
            <div style={styles.leftPanelLogo}>
              <div style={styles.leftPanelLogoIcon}><FiCalendar size={18} /></div>
              <div>
                <p style={styles.leftPanelTitle}>My Calendar</p>
                <p style={styles.leftPanelSubtitle}>{state.todayLabel}</p>
              </div>
            </div>
            <button
              className="cal-new-event-btn"
              style={styles.newEventBtn}
              onClick={() => { openAddModal(); setMobileSidebarOpen(false); }}
            >
              <FiPlus size={16} /> New Event
            </button>
          </div>

          <div style={styles.leftPanelBody}>
            <p style={styles.sectionLabel}><FiFilter size={10} style={{ marginRight: 6 }} />Filter by Category</p>
            <div style={styles.categoryList}>
              <div
                className="cal-category-item"
                style={{ ...styles.categoryItem, cursor: "pointer" }}
                onClick={handleAllCategory}
              >
                {state.selectAll
                  ? <FiCheckSquare size={14} color="#5485e4" />
                  : <FiSquare size={14} color="#94a3b8" />}
                <span style={{ ...styles.categoryLabel, fontWeight: "700", color: "#0f172a" }}>All Schedules</span>
                <span style={styles.categoryCount}>{state.events.length + state.holidayEvents.length}</span>
              </div>

              {eventCategoryOptions.map(cat => {
                const IconComponent = cat.icon;
                const isActive = state.selectedCategories[cat.value];
                const count = cat.value === "Holidays" 
                  ? state.holidayEvents.length 
                  : countFor(cat.value);
                return (
                  <div
                    key={cat.value}
                    className={`cal-category-item${isActive ? " active-cat" : ""}`}
                    style={{ ...styles.categoryItem, borderLeft: isActive ? `3px solid ${cat.color}` : "3px solid transparent" }}
                    onClick={() => handleCategoryChange(cat.value)}
                  >
                    {isActive
                      ? <FiCheckSquare size={13} color={cat.color} />
                      : <FiSquare size={13} color="#cbd5e1" />}
                    <div style={{ ...styles.categoryDot, background: cat.color }} />
                    <span style={styles.categoryLabel}>
                      {IconComponent && <IconComponent size={12} style={{ marginRight: 6 }} />}
                      {cat.label}
                    </span>
                    <span style={{ ...styles.categoryCount, color: isActive ? cat.color : "#94a3b8", background: isActive ? cat.bgColor : "#f1f5f9" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <p style={{ ...styles.sectionLabel, marginTop: "4px" }}>Upcoming Schedules</p>
            <div style={{ padding: "4px 0 8px" }}>
              {upcomingEvents.length === 0 && (
                <p style={styles.scheduleEmpty}>No upcoming events yet.</p>
              )}
              {upcomingEvents.map((ev) => {
                const s = new Date(ev.start);
                const cat = eventCategoryOptions.find((c) => c.value === ev.category);
                const isHoliday = ev.category === "Holidays";
                const catColor = isHoliday ? "#f59e0b" : (cat?.color || "#64748b");
                const catBg = isHoliday ? "rgba(245,158,11,.12)" : (cat?.bgColor || "#f1f5f9");
                const CatIcon = cat?.icon || FiCalendar;
                const metaText = ev.details?.location || cat?.label || ev.category || "";

                return (
                  <div
                    key={ev.id}
                    className="cal-schedule-card"
                    style={{ ...styles.scheduleCard, borderLeft: `3px solid ${catColor}` }}
                    onClick={() => {
                      dispatch({ type: "SET_SELECTED_EVENT", payload: toPseudoEvent(ev) });
                      setIsDetailOpen(true);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <div style={{ ...styles.scheduleDate, background: catBg, color: catColor }}>
                        <span style={styles.scheduleDateDay}>{isValid(s) ? format(s, "d") : "-"}</span>
                        <span style={styles.scheduleDateMon}>{isValid(s) ? format(s, "MMM") : ""}</span>
                      </div>
                      <div style={styles.scheduleBody}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "2px" }}>
                          <CatIcon size={11} color={catColor} style={{ flexShrink: 0 }} />
                          <p style={{ ...styles.scheduleName, margin: 0 }}>{ev.title}</p>
                        </div>
                        <p style={{ ...styles.scheduleMeta, color: catColor, fontWeight: 600 }}>{metaText}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>

          <div className="cal-topbar" style={styles.topBar}>
            <div style={styles.topBarLeft}>
              <button
                className="cal-mobile-btn"
                style={{ ...styles.mobileMenuBtn, display: "none" }}
                onClick={() => setMobileSidebarOpen(true)}
              >
                <FiAlignLeft size={17} />
              </button>

              <button className="cal-month-nav" style={styles.monthNavBtn} onClick={() => calendarRef.current?.getApi().prev()}>
                <FiChevronLeft size={16} />
              </button>
              <button className="cal-month-nav" style={styles.monthNavBtn} onClick={() => calendarRef.current?.getApi().next()}>
                <FiChevronRight size={16} />
              </button>

              <span className="cal-current-month" style={styles.currentMonthLabel}>{state.currentMonth}</span>
            </div>

            <div className="cal-topbar-right" style={styles.topBarRight}>
              <button
                className="cal-today-btn"
                style={styles.todayBtn}
                onClick={() => calendarRef.current?.getApi().today()}
              >
                <FiClock size={13} /> <span>Today</span>
              </button>

              <div className="cal-view-switcher" style={{ display: "flex", gap: "6px", background: "#f1f5f9", borderRadius: "12px", padding: "4px" }}>
                {viewOptions.map(v => (
                  <button
                    key={v.value}
                    className={`cal-view-btn${state.calView === v.value ? " active" : ""}`}
                    style={{
                      padding: "7px 14px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: state.calView === v.value ? "#fff" : "#64748b",
                      background: state.calView === v.value ? "linear-gradient(135deg, #5485e4, #8b5cf6)" : "transparent",
                      cursor: "pointer",
                      transition: "all .25s ease",
                    }}
                    onClick={() => {
                      calendarRef.current?.getApi().changeView(v.value);
                      dispatch({ type: "SET_CAL_VIEW", payload: { view: v.value, label: v.label } });
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <button
                className="cal-new-event-btn cal-new-event-btn-top"
                style={{ ...styles.newEventBtn, width: "auto", padding: "9px 18px", fontSize: "12px", boxShadow: "0 2px 12px rgba(84,133,228,.3)" }}
                onClick={() => openAddModal()}
              >
                <FiPlus size={14} /> <span>Event</span>
              </button>
            </div>
          </div>

          <div className="cal-calendar-wrap" style={styles.calendarWrap}>
            <div style={styles.calendarCard}>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                views={{
                  twoWeek:   { type: "dayGrid", duration: { weeks: 2 } },
                  threeWeek: { type: "dayGrid", duration: { weeks: 3 } },
                }}
                headerToolbar={false}
                events={calendarDisplayEvents}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                selectable={true}
                select={handleSelect}
                datesSet={handleDatesSet}
                weekends={state.showWeekends}
                firstDay={state.isWeekMonday}
                eventContent={renderEventContent}
                height="100%"
                eventDisplay="list-item"
                displayEventTime={false}
                dayCellDidMount={handleDayCellDidMount}
                dayHeaderClassNames={(arg) => {
                  const isWeekend = arg.date.getDay() === 0 || arg.date.getDay() === 6;
                  return `text-center py-2 text-xs font-bold uppercase tracking-wider rounded-lg ${
                    isWeekend ? "text-red-500 bg-red-50" : "text-gray-400 bg-gray-50"
                  }`;
                }}
                dayCellClassNames={(arg) => {
                  const day = arg.date.getDay();
                  if (day === 0 || day === 6) return "fc-day-weekend";
                  return "";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {dayPopover && (
        <DayEventsPopover
          popover={dayPopover}
          onView={handleViewFromPopover}
          onEdit={handleEditFromPopover}
          onDelete={handleDeleteFromPopover}
          onClose={closePopoverNow}
          onMouseEnter={clearPopoverHideTimer}
          onMouseLeave={scheduleClosePopover}
        />
      )}

      {isAddOpen && (
        <PopupModal title="Add New Event" icon="📅" onClose={() => setIsAddOpen(false)}>
          <AddEventForm eventDate={state.newEventDate} onSubmit={handleAddSubmit} />
        </PopupModal>
      )}

      {isDetailOpen && state.selectedEvent && (
        <PopupModal title="Event Details" icon="🔍" onClose={() => setIsDetailOpen(false)}>
          <EventDetails
            selectedEvent={state.selectedEvent}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        </PopupModal>
      )}

      {isEditOpen && state.selectedEvent && (
        <PopupModal title="Edit Event" icon="✏️" onClose={() => setIsEditOpen(false)}>
          <EditEventForm event={state.selectedEvent} onSubmit={handleEditSubmit} />
        </PopupModal>
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </>
  );
};

export default CalendarView;
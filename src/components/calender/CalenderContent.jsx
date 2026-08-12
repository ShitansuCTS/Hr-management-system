"use client";
import { useEffect, useRef, useReducer, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import CalenderModal from "./CalenderModal";
import CalenderSidebar from "./CalenderSidebar";
import AddEventForm from "./AddEventForm";
import EditEventForm from "./EditEventForm";
import { FiAlignLeft, FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { format, isValid } from "date-fns";
import getIcon from "@/utils/getIcon";
import { initEvents } from "./initEvents";
import EventDetails from "./EventDetails";
import PerfectScrollbar from "react-perfect-scrollbar";
import Checkbox from "@/components/shared/Checkbox";
import { useCompanyCalendarStore } from "@/store/companyCalendarStore";
import toast from "react-hot-toast";

const eventCategoryOptions = [
  {
    label: "Meeting",
    value: "MEETING",
    bgColor: "rgba(84,132,227,.15)",
    color: "#5485e4",
    icon: "feather-briefcase",
  },
  {
    label: "Training",
    value: "TRAINING",
    bgColor: "rgba(37,184,101,.15)",
    color: "rgb(37,184,101)",
    icon: "feather-award",
  },
  {
    label: "Deadline",
    value: "DEADLINE",
    bgColor: "rgba(209,59,76,.15)",
    color: "rgb(209,59,76)",
    icon: "feather-clock",
  },
  {
    label: "Task",
    value: "TASK",
    bgColor: "rgba(228,158,61,.15)",
    color: "rgb(228,158,61)",
    icon: "feather-check-circle",
  },
  {
    label: "Reminder",
    value: "REMINDER",
    bgColor: "rgba(88,86,214,.15)",
    color: "rgb(88,86,214)",
    icon: "feather-bell",
  },
  {
    label: "Other",
    value: "OTHER",
    bgColor: "rgba(66, 107, 20, 0.15)",
    color: "rgb(71,94,119)",
    icon: "feather-grid",
  },
];

const initialState = {
  sidebarOpen: false,
  calenderFilter: { label: "Monthly", icon: "feather-grid" },
  events: [],
  isWeekMonday: 0,
  showWeekends: true,
  currentMonth: "",
  selectedEvent: null,
  newEventDate: null,
  modalPosition: { top: 0, left: 0 },
  selectAll: true,
  selectedCategories: {
    MEETING: true,
    TRAINING: true,
    DEADLINE: true,
    TASK: true,
    REMINDER: true,
    OTHER: true,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_CALENDAR_FILTER":
      return { ...state, calenderFilter: action.payload };
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    case "SET_WEEK_MONDAY":
      return { ...state, isWeekMonday: action.payload };
    case "SET_SHOW_WEEKENDS":
      return { ...state, showWeekends: action.payload };
    case "SET_CURRENT_MONTH":
      return { ...state, currentMonth: action.payload };
    case "SET_SELECTED_EVENT":
      return { ...state, selectedEvent: action.payload };
    case "SET_NEW_EVENT_DATE":
      return { ...state, newEventDate: action.payload };
    case "SET_MODAL_POSITION":
      return { ...state, modalPosition: action.payload };
    case "SET_SELECT_ALL":
      return { ...state, selectAll: action.payload };
    case "SET_SELECTED_CATEGORIES":
      return { ...state, selectedCategories: action.payload };
    default:
      return state;
  }
};



const isSecondOrFourthSaturday = (date) => {
  // Saturday = 6
  if (date.getDay() !== 6) return false;

  const day = date.getDate();

  // 2nd Saturday: 8th–14th
  // 4th Saturday: 22nd–28th
  return (day >= 8 && day <= 14) || (day >= 22 && day <= 28);
};


const CalenderContent = () => {
  const calendarRef = useRef(null);
  const calenderModalRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { events, loading, fetchEvents, createEvent, deleteEvent } = useCompanyCalendarStore();

  //fetch Events
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // category toggle
  const handleCategoryChange = (category) => {
    const updatedCategories = {
      ...state.selectedCategories,
      [category]: !state.selectedCategories[category],
    };

    dispatch({
      type: "SET_SELECTED_CATEGORIES",
      payload: updatedCategories,
    });

    const allSelected = Object.values(updatedCategories).every((value) => value);
    dispatch({ type: "SET_SELECT_ALL", payload: allSelected });
  };

  // all category checked
  const handleAllCategory = (e) => {
    const newValue = e.target.checked;
    dispatch({ type: "SET_SELECT_ALL", payload: !state.selectAll });

    const updatedCategories = {};
    Object.keys(state.selectedCategories).forEach((category) => {
      updatedCategories[category] = newValue;
    });
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: updatedCategories });
  };

  // Check if all categories are true on initial load
  useEffect(() => {
    const allSelected = Object.values(state.selectedCategories).every((value) => value);
    dispatch({ type: "SET_SELECT_ALL", payload: allSelected });
  }, []);

  // Filter events based on selected categories
  const filteredEvents = events.filter((event) => {
    return state.selectedCategories[event.category];
  });

  const handleEventBtnClick = (e) => {
    e.preventDefault();
    const date = new Date();
    dispatch({ type: "SET_NEW_EVENT_DATE", payload: { start: date, end: date } });
    setIsAddModalOpen(true);
  };

  // open modal and add new event click on month view date
  const handleDateClick = (info) => {
    dispatch({ type: "SET_NEW_EVENT_DATE", payload: { start: info.date, end: info.date } });
    setIsAddModalOpen(true);
  };

  // event submit
  const handleAddSubmit = async (payload) => {
    try {
      setIsAddingEvent(true);

      const result = await createEvent(payload);

      if (result.success) {
        toast.success("Event added Successfully");
        setIsAddModalOpen(false);
      } else {
        toast.error("Unable to add the event");
        console.log(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsAddingEvent(false);
    }
  };

  // open modal and add new event click on week and day click date
  const handleSelect = (info) => {
    const { start, end } = info;
    dispatch({ type: "SET_NEW_EVENT_DATE", payload: { start, end } });
    setIsAddModalOpen(true);
  };

  // open modal click up the event title
  const handleEventClick = (info) => {
    dispatch({
      type: "SET_SELECTED_EVENT",
      payload: {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay,
        ...info.event.extendedProps,
      },
    });

    setIsModalOpen(true);
  };

  // Delete event
  // Delete event
  const handleDeleteEvent = async () => {
    try {
      const result = await deleteEvent(state.selectedEvent.id);

      if (result.success) {
        toast.success("Event deleted successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // Open edit modal
  const handleEditEvent = () => {
    setIsEditModalOpen(true);
    setIsModalOpen(false);
  };

  // Edit event (to be called on edit modal confirmation)
  const handleEditSubmit = (updatedEvent) => {
    const newEvents = state.events.map((event) => {
      if (event.id === updatedEvent._def.publicId) {
        return {
          ...event,
          title: updatedEvent.title,
          category: updatedEvent.category,
          start: updatedEvent.start,
          end: updatedEvent.end,
          details: {
            location: updatedEvent.details.location,
            position: updatedEvent.details.position,
            details: updatedEvent.details.details,
          },
          allDay: updatedEvent.allDay,
        };
      }
      return event;
    });

    dispatch({ type: "SET_EVENTS", payload: newEvents });
    setIsEditModalOpen(false);
  };

  // title date customize
  const handleDatesSet = (dateInfo) => {
    dispatch({
      type: "SET_CURRENT_MONTH",
      payload: format(dateInfo.view.currentStart, "MMMM yyyy"),
    });
  };

  const renderCustomButton = () => {
    const viewOptions = [
      { label: "Daily", value: "timeGridDay", icon: "feather-list" },
      { label: "Weekly", value: "timeGridWeek", icon: "feather-umbrella" },
      { label: "Weeks (2)", value: "twoWeek", icon: "feather-sliders" },
      { label: "Weeks (3)", value: "threeWeek", icon: "feather-framer" },
      { label: "Monthly", value: "dayGridMonth", icon: "feather-grid" },
    ];
    return (
      <div id="menu" className="d-flex align-items-center justify-content-between">
        <div className="d-flex calendar-action-btn">
          <div className="filter-dropdown me-1">
            <button
              id="dropdownMenu-calendarType"
              className="dropdown-toggle calendar-dropdown-btn"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              data-bs-offset="0,17"
            >
              <i className="me-2 fs-12">{getIcon(state.calenderFilter.icon)}</i>
              <span>{state.calenderFilter.label}</span>
            </button>
            <div className="dropdown-menu">
              {viewOptions.map(({ icon, label, value }, index) => (
                <li
                  key={index}
                  className="dropdown-item c-pointer"
                  onClick={() => {
                    calendarRef.current.getApi().changeView(value);
                    dispatch({ type: "SET_CALENDAR_FILTER", payload: { label, icon } });
                  }}
                >
                  <i className="me-3">{getIcon(icon)}</i>
                  <span>{label}</span>
                </li>
              ))}
              <li role="presentation" className="dropdown-divider" />
              <li className="dropdown-item">
                <Checkbox
                  checked={state.showWeekends}
                  id={"viewWeekendsSchedules"}
                  name={"Show Weekends"}
                  labelClassName="fs-12 fw-bold"
                  onChange={(e) =>
                    dispatch({ type: "SET_SHOW_WEEKENDS", payload: e.target.checked })
                  }
                />
              </li>
              <li className="dropdown-item">
                <Checkbox
                  checked={state.isWeekMonday === 1}
                  id={"viewStartSchedules"}
                  name={"Start Week on Monday"}
                  labelClassName="fs-12 fw-bold"
                  onChange={(e) =>
                    dispatch({ type: "SET_WEEK_MONDAY", payload: e.target.checked ? 1 : 0 })
                  }
                />
              </li>
              <li className="dropdown-item">
                <Checkbox
                  checked={false}
                  id={"viewNarrowerSchedules"}
                  name={"Narrower than weekdays"}
                  labelClassName="fs-12 fw-bold"
                />
              </li>
            </div>
          </div>
          <div className="menu-navi d-none d-sm-flex">
            <button
              type="button"
              className="move-today"
              onClick={() => calendarRef.current.getApi().today()}
            >
              <FiClock className="me-2" size={13} />
              <span>Today</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatEventTime = (eventStart) => {
    if (eventStart && isValid(eventStart)) {
      const hours = eventStart.getHours();
      const minutes = eventStart.getMinutes();
      const seconds = eventStart.getSeconds();

      if (hours === 0 && minutes === 0 && seconds === 0) {
        return false;
      } else {
        return format(eventStart, "hh:mm a");
      }
    } else {
      return "Invalid date";
    }
  };

  const renderEventContent = (eventInfo) => {
    const category = eventCategoryOptions.find(
      (cat) => cat.value === eventInfo.event.extendedProps.category
    );
    const eventStart = eventInfo.event.start;
    return (
      <span
        className="event-title-name"
        style={{ backgroundColor: category.bgColor, color: category.color }}
      >
        {getIcon(category.icon)}
        <b>{formatEventTime(eventStart)}</b>
        <span>{eventInfo.event.title}</span>
      </span>
    );
  };

  const calendarEvents = filteredEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    allDay: event.allDay,

    extendedProps: {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      startDate: event.startDate,
      endDate: event.endDate,
      createdBy: event.createdBy,
      allDay: event.allDay,
    },
  }));

  return (
    <>
      <CalenderSidebar
        handleEventBtnClick={handleEventBtnClick}
        selectedCategories={state.selectedCategories}
        handleCategoryChange={handleCategoryChange}
        handleAllCategory={handleAllCategory}
        selectAll={state.selectAll}
        sidebarOpen={state.sidebarOpen}
        setSidebarOpen={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        eventCategoryOptions={eventCategoryOptions}
      />
      <div className="content-area">
        <PerfectScrollbar>
          <div className="content-area-body p-0 react-full-calender">
            <div className="content-area-header sticky-top">
              <div className="page-header-left d-flex align-items-center gap-2">
                <a
                  href="#"
                  className="app-sidebar-open-trigger me-2"
                  onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
                >
                  <FiAlignLeft className="fs-20" />
                </a>
                {renderCustomButton()}
              </div>
              <div className="page-header-right ms-auto">
                <div className="hstack gap-2">
                  <div className="render-range d-none d-sm-flex renderRange">
                    {state.currentMonth}
                  </div>
                  <div className="btn-group gap-1 menu-navi" role="group">
                    <button
                      type="button"
                      className="avatar-text avatar-md move-day"
                      onClick={() => calendarRef.current.getApi().prev()}
                    >
                      <FiChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      className="avatar-text avatar-md move-day"
                      onClick={() => calendarRef.current.getApi().next()}
                    >
                      <FiChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              views={{
                twoWeek: {
                  type: "dayGrid",
                  duration: { weeks: 2 },
                  buttonText: "2 weeks",
                },
                threeWeek: {
                  type: "dayGrid",
                  duration: { weeks: 3 },
                  buttonText: "3 weeks",
                },
              }}
              headerToolbar={false}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              ref={calendarRef}
              selectable={true}
              select={handleSelect}
              datesSet={handleDatesSet}
              weekends={state.showWeekends}
              firstDay={state.isWeekMonday}
              eventContent={renderEventContent}
              dayCellClassNames={(arg) => {
                const date = arg.date;

                // Keep Sunday as it is
                if (date.getDay() === 0) {
                  return ["fc-day-sun"];
                }

                // 2nd and 4th Saturday
                if (
                  date.getDay() === 6 &&
                  (
                    (date.getDate() >= 8 && date.getDate() <= 14) ||
                    (date.getDate() >= 22 && date.getDate() <= 28)
                  )
                ) {
                  return ["fc-day-sun"];
                }

                return [];
              }}
            />

            {isAddModalOpen && (
              <CalenderModal
                onClose={() => setIsAddModalOpen(false)}
                position={state.modalPosition}
                ref={calenderModalRef}
              >
                <AddEventForm
                  eventDate={state.newEventDate}
                  onSubmit={handleAddSubmit}
                  loading={isAddingEvent}
                />
              </CalenderModal>
            )}

            {isModalOpen && (
              <CalenderModal
                onClose={() => setIsModalOpen(false)}
                position={state.modalPosition}
                ref={calenderModalRef}
              >
                <EventDetails
                  handleDeleteEvent={handleDeleteEvent}
                  handleEditEvent={handleEditEvent}
                  selectedEvent={state.selectedEvent}
                />
              </CalenderModal>
            )}

            {isEditModalOpen && state.selectedEvent && (
              <CalenderModal
                onClose={() => setIsEditModalOpen(false)}
                position={state.modalPosition}
                ref={calenderModalRef}
              >
                <EditEventForm event={state.selectedEvent} onSubmit={handleEditSubmit} />
              </CalenderModal>
            )}
          </div>
        </PerfectScrollbar>
      </div>
    </>
  );
};

export default CalenderContent;

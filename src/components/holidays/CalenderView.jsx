'use client'

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import HolodayMarkingIcons from "./HolodayMarkingIcons";

const CalendarView = () => {
    const calendarRef = useRef(null);

    const [holidayEvents, setHolidayEvents] = useState([]);
    const [offDayEvents, setOffDayEvents] = useState([]);


    // ✅ Fetch Holidays
    useEffect(() => {
        const loadHolidays = async () => {
            try {
                const res = await fetch("/api/holidays");
                const data = await res.json();

                if (!data.success) return;

                const events = data.holidaysList.map(h => ({
                    title: `🎉 ${h.name}`,
                    start: h.date.split("T")[0], // ✅ KEY FIX
                    allDay: true,
                    backgroundColor: "#f59e0b",
                    borderColor: "#f59e0b",
                }));

                console.log("FINAL EVENTS:", events);

                setHolidayEvents(events);

            } catch (err) {
                console.log(err);
            }
        };

        loadHolidays();
    }, []);


    // ✅ Correct Saturday Logic
    const generateOffDays = (year, month) => {
        let events = [];
        let saturdayCount = 0;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const day = date.getDay();

            // Sunday
            if (day === 0) {
                events.push({
                    title: "🌴 Sunday",
                    start: date,
                    allDay: true,
                    backgroundColor: "#e5e7eb",
                    borderColor: "#e5e7eb",
                    textColor: "#000",
                });
            }

            // Saturdays
            if (day === 6) {
                saturdayCount++;

                if (saturdayCount === 2 || saturdayCount === 4) {
                    events.push({
                        title: "🛌 Saturday Off",
                        start: date,
                        allDay: true,
                        backgroundColor: "#60a5fa",
                        borderColor: "#60a5fa",
                    });
                }
            }
        }

        return events;
    };

    // ✅ Update month-wise
    const handleDatesSet = (arg) => {
        const current = arg.view.currentStart;
        const y = current.getFullYear();
        const m = current.getMonth();

        setOffDayEvents(generateOffDays(y, m));
    };

    const allEvents = [...holidayEvents, ...offDayEvents];





    return (
        <div className="row" >
            <div className="col-lg-8 col-sm-12" >
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={allEvents}
                    eventDisplay="none"   // ✅ KEY FIX
                    displayEventTime={false}
                    datesSet={handleDatesSet}
                    height="auto"

                    // ✅ CARD STYLE CELL
                    dayCellDidMount={(arg) => {
                        arg.el.style.padding = "6px";

                        const frame = arg.el.querySelector(".fc-daygrid-day-frame");
                        if (frame) {
                            frame.style.borderRadius = "10px";
                            frame.style.background = "white";
                            frame.style.boxShadow = "rgba(149,157,165,0.2) 0px 8px 24px";
                            frame.style.height = "70px";
                            frame.style.display = "flex";
                            frame.style.flexDirection = "column";
                            frame.style.justifyContent = "space-between";
                            frame.style.padding = "6px 10px";
                            frame.style.cursor = "pointer";
                        }
                    }}

                    // ✅ FULL CUSTOM CELL CONTENT
                    dayCellContent={(arg) => {
                        const dateStr = arg.date.toISOString().split("T")[0];

                        // find event for this day
                        const event = allEvents.find(
                            (e) =>
                                new Date(e.start).toISOString().split("T")[0] === dateStr
                        );

                        // ✅ DATE COLOR LOGIC HERE
                        const day = arg.date.getDay();
                        const todayStr = new Date().toISOString().split("T")[0];

                        const isToday = todayStr === dateStr;
                        const isSunday = day === 0;
                        const isSaturday = day === 6;

                        let badge = null;

                        if (event) {
                            let label = "A";
                            let bg = "#ef4444";

                            if (event.title.includes("Sunday")) {
                                label = "S";
                                bg = "#ef4444";
                            }

                            if (event.title.includes("Saturday")) {
                                label = "S";
                                bg = "#ef4444";
                            }

                            if (event.title.includes("🎉")) {
                                label = "H";
                                bg = "#f59e0b";
                            }

                            badge = (
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        background: bg,
                                        color: "white",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {label}
                                </div>
                            );
                        }

                        return (
                            <div className="flex flex-col justify-between h-full w-full">

                                {/* ✅ DATE NUMBER WITH COLOR */}
                                <div
                                    className="text-right text-sm font-semibold"
                                    style={{
                                        color: "rgb(55, 65, 81)",     // Your gray for all other days
                                    }}
                                >
                                    {arg.dayNumberText}
                                </div>


                                {/* Badge */}
                                <div className="flex justify-end">
                                    {badge}
                                </div>

                            </div>
                        );
                    }}




                    dayHeaderClassNames={(arg) => {
                        const isSunday = arg.date.getDay() === 0;

                        return `
    text-center
    py-2
    text-sm
    font-semibold
    rounded-lg
    ${isSunday ? "text-red-500 bg-red-50" : "text-gray-700 bg-gray-50"}
  `;
                    }}
                />
            </div>
            <div className="col-lg-4 col-sm-12" style={{ marginTop: "100px" }} >
                <HolodayMarkingIcons />
            </div>
        </div>

    );
};

export default CalendarView;

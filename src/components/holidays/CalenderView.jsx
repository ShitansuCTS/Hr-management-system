'use client'

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
        <div className="card shadow-sm p-3">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={allEvents}
                datesSet={handleDatesSet}
                height="auto"

                // ✅ BEAUTIFUL UI
                dayCellClassNames={() =>
                    "hover:bg-blue-50 transition duration-200"
                }

                eventContent={(info) => (
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px",
                            borderRadius: "8px",
                            textAlign: "center",
                        }}
                    >
                        {info.event.title}
                    </div>
                )}

                dayHeaderClassNames="text-primary fw-bold"
            />
        </div>
    );
};

export default CalendarView;

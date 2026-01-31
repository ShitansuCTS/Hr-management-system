'use client'
import React, { useEffect, useState } from 'react'

import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import HorizontalProgress from '@/components/shared/HorizontalProgress'
import { projectsData } from '@/utils/fackData/projectsData'
import { FiBell, FiClock, FiGlobe, FiPrinter, FiSun } from 'react-icons/fi'
import HolidayTableSkeleton from "@/components/loaders/HolidayTableSkeleton"

const HolidaysList = () => {
    const data = projectsData.trackerProjects
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(false)


    // Fetch holidays from API
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/holidays")
                const data = await res.json()

                console.log("Received holidays:", data.holidaysList)
                setHolidays(data.holidaysList) // assuming API returns an array of holidays
            } catch (err) {
                console.error("Error fetching holidays:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchHolidays()
    }, [])

    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <CardHeader title={"Holidays Tracker"} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Holiday Name</th>
                                    <th scope="col" className="w-25">Status</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Day</th>
                                    <th scope="col">Holiday Type</th>
                                    {/* <th scope="col" className="text-end">Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <HolidayTableSkeleton rows={6} />
                                ) : holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-3">
                                            No holidays found
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id}>
                                            {/* Holiday Name */}
                                            <td>
                                                <div className="hstack gap-3">
                                                    <div className="avatar-text bg-soft-primary text-primary">
                                                        <FiSun size={16} />
                                                    </div>
                                                    <span className="fw-bold">{holiday.name}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className="rounded-circle bg-success"
                                                        style={{ width: 10, height: 10 }}
                                                    />
                                                    <span className="fs-12 fw-medium">Holiday</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: "#3454d1",
                                                        color: "#fff",
                                                        padding: "0.4em 0.8em",
                                                        borderRadius: "9999px",
                                                        fontSize: "0.85em",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                                    }}
                                                >
                                                    {holiday.date
                                                        ? new Date(holiday.date).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </td>

                                            {/* Day */}
                                            <td className="fw-bold">{holiday.day}</td>

                                            {/* Holiday Type */}
                                            <td>
                                                {holiday.type && (
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor:
                                                                holiday.type === "NATIONAL"
                                                                    ? "#f59e0b"
                                                                    : holiday.type === "FESTIVAL"
                                                                        ? "#60a5fa"
                                                                        : holiday.type === "COMPANY"
                                                                            ? "#ef4444"
                                                                            : "#3454d1",
                                                            color: "#fff",
                                                            padding: "0.4em 0.8em",
                                                            borderRadius: "0.5rem",
                                                            fontSize: "0.85em",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        {holiday.type}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HolidaysList

'use client'
import React, { useEffect, useState } from 'react'

import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import HorizontalProgress from '@/components/shared/HorizontalProgress'
import { projectsData } from '@/utils/fackData/projectsData'
import { FiBell, FiClock, FiGlobe, FiPrinter, FiSun } from 'react-icons/fi'

const HolidaysList = () => {
    const data = projectsData.trackerProjects
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(true)


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
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-3">
                                            No holidays found
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id}>
                                            <td>
                                                <div className="hstack gap-3">
                                                    <div className="avatar-text bg-soft-primary text-primary">
                                                        <FiSun size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold d-block mb-1">{holiday.name}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className="rounded-circle bg-success"
                                                        style={{ width: 10, height: 10, display: "inline-block" }}
                                                    ></span>
                                                    <span className="fs-12 fw-medium">Holiday</span>
                                                </div>
                                            </td>

                                            <td>
  <span
    className="badge bg-soft-primary text-dark"
    style={{
      padding: "0.4em 0.8em",
      fontSize: "0.85em",
      borderRadius: "0.5rem",
      display: "inline-block",
    }}
  >
    {holiday.date ? new Date(holiday.date).toLocaleDateString() : ""}
  </span>
</td>

                                            <td className="fw-bold">{holiday.day}</td>
                                          <td>
  {holiday.type && (
    <span
      className="badge"
      style={{
        backgroundColor: "#3454d1",
        color: "#fff",
        padding: "0.4em 0.8em",
        fontSize: "0.85em",
        borderRadius: "0.5rem",
        textTransform: "capitalize",
        display: "inline-block",
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

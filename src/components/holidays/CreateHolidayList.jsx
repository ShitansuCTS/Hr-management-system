'use client'
import React, { useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import DatePicker from 'react-datepicker'
import EventCalendarSmall from '@/components/EventCalendarSmall'
import toast from "react-hot-toast";


const CreateHolidayList = () => {
  const [holidayName, setHolidayName] = useState("")
  const [holidayDate, setHolidayDate] = useState(null)
  const [holidayType, setHolidayType] = useState(null)
  const [description, setDescription] = useState("")
  const [year, setYear] = useState("")
  const [day, setDay] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async () => {
    setLoading(true)
    if (!holidayName || !holidayDate || !holidayType) {
      toast.error("Please fill all the fields")
      return
    }

    const payload = {
      name: holidayName,
      date: holidayDate,
      day,
      year: Number(year),
      type: holidayType.value,
      description,
    }


    // console.log("The data is get : ", payload)

    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log("Saved:", data)
      if (res.ok) {
        toast.success("Holiday created successfully")
        // Reset form
        setHolidayName("")
        setHolidayDate(null)
        setHolidayType(null)
        setDescription("")
        setYear("")
        setDay("")
        return
      }

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="col-xl-8">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                {/* Holiday Name */}
                <div className="mb-4">
                  <label className="form-label">
                    Holiday Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ganesh Puja"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                  />

                </div>
              </div>

              <div className="col-md-4">
                {/* Holiday Date */}
                <div className="mb-4">
                  <label className="form-label">
                    Holiday Date <span className="text-danger">*</span>
                  </label>

                  <DatePicker
                    selected={holidayDate}
                    onChange={(date) => {
                      setHolidayDate(date)

                      if (date) {
                        setYear(date.getFullYear())

                        const dayName = date.toLocaleDateString("en-US", {
                          weekday: "long",
                        })
                        setDay(dayName)
                      }
                    }}
                    className="form-control"
                    placeholderText="Select date"
                  />

                </div>
              </div>

              <div className="col-md-4">
                {/* Holiday Type */}
                <div className="mb-4">
                  <label className="form-label">
                    Type <span className="text-danger">*</span>
                  </label>

                  <SelectDropdown
                    options={[
                      { value: "NATIONAL", label: "National" },
                      { value: "FESTIVAL", label: "Festival" },
                      { value: "OPTIONAL", label: "Optional" },
                      { value: "COMPANY", label: "Company" },
                    ]}
                    onSelectOption={(option) => setHolidayType(option)}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className="col-md-4">
                {/* Holiday Color */}
                <div className="mb-4">
                  <label className="form-label">
                    Year <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={year}
                    readOnly
                  />

                </div>
              </div>
              <div className="col-md-4">
                {/* Holiday Color */}
                <div className="mb-4">
                  <label className="form-label">
                    Day <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={day}
                    readOnly
                  />

                </div>
              </div>
            </div>


            {/* Description */}
            <div className="mb-4">
              <label className="form-label">Description</label>

              <textarea
                className="form-control"
                rows={3}
                placeholder="Optional notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

            </div>

            {/* Save Button */}
            <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        </div>
      </div>
      <div className="col-xl-4">
        <div className="card stretch stretch-full">
          <EventCalendarSmall />
        </div>
      </div>
    </>
  )
}

export default CreateHolidayList

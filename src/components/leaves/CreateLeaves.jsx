'use client'
import React, { useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { currencyOptionsData } from '@/utils/fackData/currencyOptionsData'
import { FiCamera, FiInfo } from 'react-icons/fi'
import { BsCreditCardFill, BsPaypal } from 'react-icons/bs'
import { FaCcAmex, FaCcDinersClub, FaCcDiscover, FaCcJcb, FaCcMastercard, FaCcVisa } from 'react-icons/fa6'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import useImageUpload from '@/hooks/useImageUpload'
import topTost from '@/utils/topTost'
// import { invoiceTempletOptions } from './InvoiceView'
import Dropdown from '@/components/shared/Dropdown'
import toast from "react-hot-toast";
import { leaveTypeOptions } from '@/utils/options'

const previtems = [
    {
        id: 1,
        product: '',
        qty: 0,
        price: 0
    }
]
const CreateLeaves = () => {
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { handleImageUpload, uploadedImage } = useImageUpload()
    const [selectedOption, setSelectedOption] = useState(null)
    const [items, setItems] = useState(previtems);


    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            product: '',
            qty: 1,
            price: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = () => {
        items.pop()

        setItems(items)
    }


    const handleInputChange = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'qty' || field === 'price') {
                    updatedItem.total = updatedItem.qty * updatedItem.price;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const subTotal = items.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.qty);
    }, 0);

    const vat = (subTotal * 0.1).toFixed(2)
    const vatNumber = Number(vat);
    const total = Number(subTotal + vatNumber).toFixed(2)




    // Leaves posting Logic
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClick = async () => {
        try {
            // 🔍 Frontend validation (instant UX)
            if (
                !formData.leaveType ||
                !formData.startDate ||
                !formData.endDate ||
                !formData.reason
            ) {
                toast.error("Please fill all required fields");
                return;
            }

            setIsLoading(true);

            const response = await fetch("/api/leaves/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔐 send auth_token cookie
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // ❌ Backend validation error
                toast.error(data.message || "Failed to apply leave");
                return;
            }

            // ✅ Success
            toast.success("Leave applied successfully!");

            // Optional: reset form
            setFormData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
            });

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    // Leaves posting Logic


    return (
        <>
            <div className="col-xl-8">
                <div className="card invoice-container">
                    <div className="card-header">
                        <h5>Apply Your Leave</h5>
                        <div className="fs-14 text-muted">
                            Employee: <strong>John Doe</strong>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        {/* Top section */}
                        <div className="px-4 pt-4">
                            <div className="d-md-flex align-items-center justify-content-between">

                                {/* Employee Image */}
                                <div className="mb-4 mb-md-0 your-brand">
                                    <label className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded">
                                        <img
                                            src="/images/logo-abbr.png"
                                            className="img-fluid rounded h-100 w-100"
                                            alt="Employee"
                                        />
                                        <div className="position-absolute start-50 top-50 translate-middle h-100 w-100 d-flex align-items-center justify-content-center c-pointer upload-button">
                                            <FiCamera size={16} />
                                        </div>
                                    </label>
                                    <div className="fs-12 text-muted mt-1">
                                        * Is this your image?
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="d-md-flex align-items-center justify-content-end gap-4">
                                    <div className="form-group mb-3 mb-md-0">
                                        <label className="form-label">Start Date</label>
                                        <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <input type="date" name='endDate' className="form-control" value={formData.endDate} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-dashed" />

                        {/* Bottom section */}
                        <div className="px-4 row g-3">
                            {/* Leave Type */}
                            <div className="col-xl-4">
                                <div className="form-group">
                                    <label className="form-label">Leave Type</label>
                                    <SelectDropdown
                                        options={leaveTypeOptions}
                                        selectedOption={selectedLeaveType} // ✅ must be the full object
                                        defaultSelect="Select Leave Type"
                                        onSelectOption={(option) => {
                                            setSelectedLeaveType(option); // full object
                                            setFormData((prev) => ({
                                                ...prev,
                                                leaveType: option.value, // backend only
                                            }));
                                        }}
                                    />

                                </div>
                            </div>

                            {/* Reason */}
                            <div className="col-xl-8">
                                <div className="form-group">
                                    <label className="form-label">Reason</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter leave reason"
                                        value={formData.reason}
                                        name='reason'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-dashed" />

                        {/* Action */}
                        <div className="px-4 pb-4 text-end">
                            <button className="btn btn-primary" onClick={handleClick} disabled={isLoading}>
                                {isLoading ? "Applying..." : "Apply Leave"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4">
                <div className="card stretch stretch-full">
                    <div className="card-body">
                        <div className="mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-bold">Grand Total:</h6>
                                <span className="fs-12 text-muted">Grand total invoice</span>
                            </div>
                            <div className="avatar-text avatar-sm" data-toggle="tooltip" data-bs-trigger="hover" data-title="Grand total invoice">
                                <FiInfo />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered" id="tab_logic_total">
                                <tbody>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Sub Total</th>
                                        <td className="w-25"><input type="number" name="sub_total" placeholder="0.00" className="form-control border-0 bg-transparent p-0" id="sub_total" readOnly value={subTotal} /></td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Tax</th>
                                        <td className="w-25">
                                            <div className="input-group mb-2 mb-sm-0">
                                                <input type="number" className="form-control border-0 bg-transparent p-0" id="tax" placeholder="0" defaultValue="10" />
                                                <div className="input-group-addon">%</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Tax Amount</th>
                                        <td className="w-25"><input type="number" name="tax_amount" id="tax_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0" readOnly value={vat} /></td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase bg-gray-100">Grand Total</th>
                                        <td className="bg-gray-100 w-25"><input type="number" name="total_amount" id="total_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0 fw-700 text-dark" readOnly value={total} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CreateLeaves
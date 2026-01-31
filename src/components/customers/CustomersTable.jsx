'use client'
import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiMoreVertical, FiPrinter, FiSend, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Select from 'react-select'
import { customersTableData } from '@/utils/fackData/customersTableData';
import Link from 'next/link';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import './style.css'
import Loaders from '@/components/loaders/AllemployeeCardsLoaders'


const CustomersTable = () => {

    const [alluser, setallUser] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/users");

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();

                // IMPORTANT: access data.users
                setallUser(data.users);
                console.log("Fetched users:", data.users);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <>

            <div className="container">
                <div className="row g-4 justify-content-center">

                    {loading
                        ? Array.from({ length: 8 }).map((_, index) => (
                            <Loaders key={index} />
                        ))
                        :
                        alluser.map((user) => (
                            <div key={user.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-10 ">
                                <div className="profile-card ">

                                    {/* Header */}
                                    <div className="profile-header"></div>

                                    {/* Avatar */}
                                    <div className="profile-avatar">
                                        <img src="https://i.pravatar.cc/150" alt={user.name} />
                                    </div>

                                    {/* Body */}
                                    <div className="profile-body text-center">
                                        <h5 className="mb-1 ">{user.fullName}</h5>
                                        <p className="text-muted small">{user.designation}</p>
                                        <div className="profile-info">
                                            {/* <span><FiMail /> {user.email}</span> */}
                                            <span>Enginering Head Office</span>
                                            <span><FiPhone /> {user.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default CustomersTable
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

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Print", icon: <FiPrinter /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Archive", icon: <FiArchive /> },
    { label: "Report Spam", icon: <FiAlertOctagon />, },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, },
];

const TableCell = memo(({ options, defaultSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <SelectDropdown
            options={options}
            defaultSelect={defaultSelect}
            selectedOption={selectedOption}
            onSelectOption={(option) => setSelectedOption(option)}
        />
    );
});



const CustomersTable = () => {
    const users = [
        {
            id: 1,
            name: "Shitansu Gochhayat",
            designation: "Software Engineer",
            email: "shitansu.gochhayat@bookingjini.co",
            phone: "7205121943",
            image: "https://i.pravatar.cc/150?img=3",
        },
        {
            id: 2,
            name: "New Gitanjali",
            designation: "HR Manager",
            email: "hotelnewgitanjali@gmail.com",
            phone: "9776360105",
            image: "https://i.pravatar.cc/150?img=5",
        },
        {
            id: 3,
            name: "Rahul Verma",
            designation: "Frontend Developer",
            email: "rahul.verma@company.com",
            phone: "9123456780",
            image: "https://i.pravatar.cc/150?img=7",
        },
        {
            id: 4,
            name: "Anjali Singh",
            designation: "Backend Developer",
            email: "anjali.singh@company.com",
            phone: "9876543211",
            image: "https://i.pravatar.cc/150?img=8",
        },
        {
            id: 5,
            name: "Amit Kumar",
            designation: "UI/UX Designer",
            email: "amit.kumar@company.com",
            phone: "9988776655",
            image: "https://i.pravatar.cc/150?img=9",
        },
        {
            id: 6,
            name: "Pooja Sharma",
            designation: "QA Engineer",
            email: "pooja.sharma@company.com",
            phone: "8899001122",
            image: "https://i.pravatar.cc/150?img=10",
        },
        {
            id: 7,
            name: "Sandeep Patra",
            designation: "DevOps Engineer",
            email: "sandeep.patra@company.com",
            phone: "9012345678",
            image: "https://i.pravatar.cc/150?img=11",
        },
        {
            id: 8,
            name: "Neha Das",
            designation: "Product Manager",
            email: "neha.das@company.com",
            phone: "9345678123",
            image: "https://i.pravatar.cc/150?img=12",
        },
        {
            id: 9,
            name: "Rakesh Mohanty",
            designation: "Business Analyst",
            email: "rakesh.mohanty@company.com",
            phone: "9567891234",
            image: "https://i.pravatar.cc/150?img=13",
        },
        {
            id: 10,
            name: "Kavita Nayak",
            designation: "Content Strategist",
            email: "kavita.nayak@company.com",
            phone: "9785612340",
            image: "https://i.pravatar.cc/150?img=14",
        },
        {
            id: 11,
            name: "Arjun Rao",
            designation: "Mobile App Developer",
            email: "arjun.rao@company.com",
            phone: "9823456712",
            image: "https://i.pravatar.cc/150?img=15",
        },
        {
            id: 12,
            name: "Sneha Mishra",
            designation: "Digital Marketing Executive",
            email: "sneha.mishra@company.com",
            phone: "9900112233",
            image: "https://i.pravatar.cc/150?img=16",
        },
    ];
    const [alluser, setallUser] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
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
            }
        };

        fetchData();
    }, []); // 👈 required


    return (

        <div className="container">

            <div className="row g-4 justify-content-center">
                {users.map((user) => (
                    <div key={user.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-10">
                        <div className="profile-card">

                            {/* Header */}
                            <div className="profile-header"></div>

                            {/* Avatar */}
                            <div className="profile-avatar">
                                <img src={user.image} alt={user.name} />
                            </div>

                            {/* Body */}
                            <div className="profile-body text-center">
                                <h5 className="mb-1">{user.name}</h5>
                                <p className="text-muted small">{user.designation}</p>
                                <div className="profile-info">
                                    <span><FiMail /> {user.email}</span>
                                    <span><FiPhone /> {user.phone}</span>
                                </div>

                                <div className="profile-socials">
                                    <FaFacebookF />
                                    <FaTwitter />
                                    <FaLinkedinIn />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomersTable
import React from "react";
import {
    FiAlignLeft,
    FiBellOff,
    FiInfo,
    FiPhoneCall,
    FiPlus,
    FiSlash,
    FiStar,
    FiTrash2,
    FiUserPlus,
    FiVideo,
} from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import topTost from "@/utils/topTost";
import Link from "next/link";

const chatItemsHeader = [
    { label: "Join Group", icon: <FiPlus /> },
    { label: "Invite People", icon: <FiUserPlus /> },
    { label: "Add to Favorite", icon: <FiStar /> },
    { label: "Mute Conversion", icon: <FiBellOff /> },
    { type: "divider" },
    { label: "Group Audio Call", icon: <FiPhoneCall /> },
    { label: "Group Video Call", icon: <FiVideo /> },
    { type: "divider" },
    { label: "Block Conversion", icon: <FiSlash /> },
    { label: "Delete Chat", icon: <FiTrash2 /> },
];
const SidebarHeader = ({ avatar, name }) => {
    const handleClick = () => {
        topTost();
    };
    return (
        <>
            <div className="content-area-header sticky-top d-flex align-items-center justify-content-between px-3 py-2" >
                {/* Left section */}
                <div className="page-header-left d-flex align-items-center gap-2" >
                    <Link
                        href="#"
                        className="d-flex align-items-center gap-2"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#userProfileDetails"
                    >
                        <div className="avatar-image">
                            <img 
                                src={
                                    avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        name || "User"
                                    )}&background=3454d1&color=fff&size=128`
                                }
                                className="img-fluid" alt="image" />
                        </div>
                        <div className="d-none d-sm-block">
                            <div className="fw-bold d-flex align-items-center">{name}</div>
                            <div className="d-flex align-items-center mt-1 gap-1">
                                <span className="wd-7 ht-7 rounded-circle opacity-75 bg-success"></span>
                                <span className="fs-9 text-uppercase fw-bold text-success">Active Now</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Right section */}
                <div className="page-header-right d-flex align-items-center gap-2" >
                    <Link
                        href="#"
                        className="d-flex"
                        data-bs-toggle="modal"
                        data-bs-target="#voiceCallingModalScreen"
                    >
                        <div
                            className="avatar-text avatar-md"
                            data-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Voice Call"
                        >
                            <FiPhoneCall />
                        </div>
                    </Link>
                    <Link
                        href="#"
                        className="d-flex"
                        data-bs-toggle="modal"
                        data-bs-target="#videoCallingModalScreen"
                    >
                        <div
                            className="avatar-text avatar-md"
                            data-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Video Call"
                        >
                            <FiVideo />
                        </div>
                    </Link>
                    <Link href="#" className="d-none d-sm-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add to Favorite"
                        >
                            <FiStar />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SidebarHeader;

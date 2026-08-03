import React from "react";

const ProfileSkeleton = () => {
    return (
        <div
            className="card stretch stretch-full w-100 h-100 employee-profile-left-skeleton"
            style={{ minHeight: "570px" }}
        >
            <div className="card-body h-100">

                {/* Avatar */}
                <div className="text-center mb-4">
                    <div
                        className="bg-light rounded-circle mx-auto mb-3"
                        style={{ width: "150px", height: "150px" }}
                    ></div>

                    {/* Name */}
                    <div className="bg-light mx-auto mb-2" style={{ width: "120px", height: "14px" }}></div>

                    {/* Email */}
                    <div className="bg-light mx-auto" style={{ width: "180px", height: "12px" }}></div>
                </div>

                {/* Stats */}
                <div className="d-flex gap-3 mb-4">
                    <div className="flex-fill bg-light" style={{ height: "60px" }}></div>
                    <div className="flex-fill bg-light" style={{ height: "60px" }}></div>
                    <div className="flex-fill bg-light" style={{ height: "60px" }}></div>
                </div>

                {/* Info rows */}
                <div className="mb-3 bg-light" style={{ height: "14px" }}></div>
                <div className="mb-3 bg-light" style={{ height: "14px" }}></div>
                <div className="mb-4 bg-light" style={{ height: "14px" }}></div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                    <div className="flex-fill bg-light" style={{ height: "38px" }}></div>
                    <div className="flex-fill bg-light" style={{ height: "38px" }}></div>
                </div>

            </div>
        </div>
    );
};

export default ProfileSkeleton;
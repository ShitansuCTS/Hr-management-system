import React from "react";

const ProfileTabsSkeleton = () => {
    return (
        <div
            className="card border-top-0 w-100 h-100 employee-profile-tabs-skeleton"
            style={{ minHeight: "570px" }}
        >

            {/* Tabs header skeleton */}
            <div className="card-header p-0">
                <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="nav-item flex-fill border-top">
                            <div
                                className="bg-light mx-auto my-3"
                                style={{ height: "14px", width: "80px", borderRadius: "4px" }}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tab content skeleton */}
            <div className="card-body w-100">

                {/* title */}
                <div
                    className="bg-light mb-3"
                    style={{ height: "18px", width: "180px", borderRadius: "4px" }}
                />

                {/* rows */}
                <div className="bg-light mb-3" style={{ height: "14px" }} />
                <div className="bg-light mb-3" style={{ height: "14px" }} />
                <div className="bg-light mb-3" style={{ height: "14px" }} />
                <div className="bg-light mb-3" style={{ height: "14px" }} />

                {/* cards */}
                <div className="d-flex gap-3 mt-4">
                    <div className="flex-fill bg-light" style={{ height: "80px" }} />
                    <div className="flex-fill bg-light" style={{ height: "80px" }} />
                </div>

            </div>
        </div>
    );
};

export default ProfileTabsSkeleton;
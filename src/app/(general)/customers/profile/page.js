import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomersViewHeader from "@/components/customersView/CustomersViewHeader";
import ProfileContent from "@/components/profile/ProfileContent";

const page = () => {
    return (
        <>
            <div className="main-content position-relative overflow-hidden">

                {/* Background */}
                <div
                    className="position-absolute top-0 start-0 w-100"
                    style={{
                        height: "480px",
                        backgroundImage:
                            "url('/images/banner/8.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                />

                {/* Content */}
                <div
                    className="position-relative"
                    style={{ zIndex: 1, }}
                >
                    <div className="row">
                        <ProfileContent />
                    </div>
                </div>

            </div>
        </>
    );
};

export default page;

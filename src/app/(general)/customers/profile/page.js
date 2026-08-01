import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomersViewHeader from "@/components/customersView/CustomersViewHeader";
import ProfileContent from "@/components/profile/ProfileContent";

const page = () => {
    return (
        <>
            <div className="main-content" >
                <div className="row" >
                    <ProfileContent />
                </div>
            </div>
        </>
    );
};

export default page;

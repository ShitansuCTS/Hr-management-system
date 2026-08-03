import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomersViewHeader from "@/components/customersView/CustomersViewHeader";
import ProfileContent from "@/components/profile/ProfileContent";

const page = () => {



    
    return (
        <>
            <div className="main-content" style={{ paddingTop: "15px !important" }} >
                <div className="row" >
                    <ProfileContent />
                </div>
            </div>
        </>
    );
};

export default page;

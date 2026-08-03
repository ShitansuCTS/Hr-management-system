import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadssTable from "@/components/leads/LeadsTable";
import Footer from "@/components/shared/Footer";
import ResumeTable from "@/components/resumes/ResumeTable";

const page = () => {
    return (
        <>
            <PageHeader>
                <LeadsHeader />
            </PageHeader>
            <div className="main-content">
                <div className="row">
                    <ResumeTable />
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default page;

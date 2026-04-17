import React from "react";
import PayrollTable from "@/components/payroll/PayrollTable";

const page = () => {
    return (
        <>
            <div className="main-content">
                <div className="row">
                    <PayrollTable />
                </div>
            </div>
        </>
    );
};

export default page;

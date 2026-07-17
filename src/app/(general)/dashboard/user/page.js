import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import SiteOverviewStatistics from "@/components/widgetsStatistics/SiteOverviewStatistics";
import PaymentRecordChart from "@/components/widgetsCharts/PaymentRecordChart";
import LeadsOverviewChart from "@/components/widgetsCharts/LeadsOverviewChart";
import TasksOverviewChart from "@/components/widgetsCharts/TasksOverviewChart";
import Project from "@/components/widgetsList/Project";
import Schedule from "@/components/widgetsList/Schedule";
import SalesMiscellaneous from "@/components/widgetsMiscellaneous/SalesMiscellaneous";
import LatestLeads from "@/components/widgetsTables/LatestLeads";
import TeamProgress from "@/components/widgetsList/Progress";
import { projectsDataTwo } from "@/utils/fackData/projectsDataTwo";
import DuplicateLayout from "@/app/duplicateLayout";
import CustomersTable from "@/components/customers/CustomersTable";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useEffect } from "react";

const Home = () => {

    // const router = useRouter();
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const checkAccess = async () => {
    //         const res = await fetch("/api/auth/me");
    //         const data = await res.json();

    //         if (!data.user) {
    //             router.push("/authentication/login/minimal");
    //             return;
    //         }

    //         if (data.user.role !== "EMPLOYEE") {
    //             router.push("/dashboard/admin");
    //             return;
    //         }

    //         setLoading(false);
    //     };

    //     checkAccess();
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="d-flex flex-column justify-content-center align-items-center vh-100">
    //             <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
    //             <h6 className="fw-semibold mb-1">Loading Dashboard</h6>
    //             <p className="text-muted small">Please wait...</p>
    //         </div>
    //     );
    // }
    return (

        <div className="main-content">
            <div className="row">
                <CustomersTable />
            </div>
        </div>

    );
};

export default Home;

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
import OrdersStatistics from "@/components/dashboard/admin/OrdersStatistics";
import EmployeementOverview from "@/components/dashboard/admin/EmployeementOverview";
import DepartmentOverview from "@/components/dashboard/admin/DepartmentOverview";
import BirthDayOverview from "@/components/dashboard/admin/BirthDayOverview";
import WorkAniversaryOverview from "@/components/dashboard/admin/WorkAniversaryOverview";
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

    //         if (data.user.role !== "ADMIN") {
    //             router.push("/dashboard/user");
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
                {/* <SiteOverviewStatistics /> */}
                <OrdersStatistics />
                {/* <br /><br /> */}
                {/* <LeadsOverviewChart chartHeight={315} /> */}
                <EmployeementOverview />
                {/* <PaymentRecordChart /> */}
                <DepartmentOverview />
                {/* <LatestLeads title={"Upcoming Birthdays"} /> */}
                <BirthDayOverview title={"Upcoming Birthdays"} />
                <WorkAniversaryOverview title={"Work Anniversaries"} />
                {/* <TeamProgress title={"Upcoming Anniversaries"} footerShow={true} /> */}
                {/* <SalesMiscellaneous isFooterShow={true} dataList={projectsDataTwo} />
          <TasksOverviewChart />
          <Schedule title={"Upcoming Schedule"} />
          <Project cardYSpaceClass="hrozintioal-card" borderShow={true} title="Project Status" /> */}
            </div>
        </div>

    );
};

export default Home;

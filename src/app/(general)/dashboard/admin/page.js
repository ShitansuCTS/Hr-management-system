"use client";

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
import { usehrdashboardStore } from "@/store/usehrdashboardStore";
import { useEffect } from "react";


const Home = () => {
  const fetchDashboard = usehrdashboardStore((s) => s.fetchDashboard);

  useEffect(() => {
    fetchDashboard(); // ✅ ONLY ONE API CALL
  }, []);

  return (
    <div className="main-content">
      <div className="row">
        <SiteOverviewStatistics />
        <LeadsOverviewChart chartHeight={315} />
        <PaymentRecordChart />
        <LatestLeads title={"Upcoming Birthdays"} />
        <TeamProgress title={"Upcoming Anniversaries"} footerShow={true} />
        {/* <SalesMiscellaneous isFooterShow={true} dataList={projectsDataTwo} />
          <TasksOverviewChart />
          <Schedule title={"Upcoming Schedule"} />
          <Project cardYSpaceClass="hrozintioal-card" borderShow={true} title="Project Status" /> */}
      </div>
    </div>
  );
};

export default Home;

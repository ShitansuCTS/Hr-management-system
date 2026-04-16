import React from "react";
import Footer from "@/components/shared/Footer";
import AttendanceHistoryTable from "@/components/holidays/AttendanceHistoryTable";

const page = () => {
  return (
    <>
      <div className="main-content">
        <div className="row">
          <AttendanceHistoryTable />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;

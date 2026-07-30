import React from "react";
import Footer from "@/components/shared/Footer";
import AllAnnouncement from "@/components/announcements/AllAnnouncement";


export const dynamic = "force-dynamic";

const page = () => {
  return (
    <>
      <div className="main-content">
        <div className="row">
          <AllAnnouncement />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default page;

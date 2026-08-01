import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import CustomersViewHeader from "@/components/customersView/CustomersViewHeader";
import CustomerContent from "@/components/customersView/CustomerContent";

const page = () => {
  return (
    <>
      <div className="main-content" style={{ paddingTop: "15px !important" }}>
        <div className="row" >
          <CustomerContent />
        </div>
      </div>
      
    </>
  );
};

export default page;

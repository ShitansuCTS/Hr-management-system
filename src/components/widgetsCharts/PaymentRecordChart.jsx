"use client";
import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { paymentRecordChartOption } from "@/utils/chartsLogic/paymentRecordChartOption";
import CardHeader from "@/components/shared/CardHeader";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PaymentRecordChart = () => {
  const baseOptions = paymentRecordChartOption();

  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  const { charts, fetchDashboard, loading } = usehrdashboardStore();

  // Fetch data
  // useEffect(() => {
  //   fetchDashboard();
  // }, []);

  // Normalize department names
  const normalizeDept = (name) => {
    if (!name) return "Unknown";
    const n = name.toLowerCase();

    if (n.includes("dev")) return "Development";
    if (n.includes("tech")) return "Technology";

    return name;
  };

  // Clean + merge data
  const cleanedDept = useMemo(() => {
    return charts.department.reduce((acc, item) => {
      const key = normalizeDept(item.name);
      const existing = acc.find((d) => d.name === key);

      if (existing) {
        existing.value += item.value;
      } else {
        acc.push({ name: key, value: item.value });
      }

      return acc;
    }, []);
  }, [charts.department]);

  // Chart data
  const series = [
    {
      name: "Employees",
      data: cleanedDept.map((d) => d.value),
    },
  ];

  const chartOptions = {
    ...baseOptions,

    xaxis: {
      categories: cleanedDept.map((d) => d.name),
    },

    // FIX: remove K from Y-axis
    yaxis: {
      labels: {
        formatter: function (val) {
          return val; // 👈 exact number (no K)
        },
      },
    },

    // FIX: remove K from tooltip
    tooltip: {
      y: {
        formatter: function (val) {
          return val; // 👈 exact number
        },
      },
    },

    // OPTIONAL: show value on top of bars
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val; // 👈 exact number
      },
    },
  };

  // Footer stats
  const totalEmployees = cleanedDept.reduce((sum, d) => sum + d.value, 0);
  const maxDept = cleanedDept.reduce(
    (max, d) => (d.value > max.value ? d : max),
    { name: "-", value: 0 }
  );

  if (isRemoved) return null;

  return (
    <div className="col-xxl-8">
      <div
        className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""
          } ${refreshKey ? "card-loading" : ""}`}
      >
        <CardHeader
          title={"Department Overview"} // 🔥 updated title
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body custom-card-action p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 280 }}>
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : !cleanedDept.length ? (
            <div className="p-4 text-center">No data available</div>
          ) : (
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="bar"
              height={377}
            />
          )}
        </div>

        {/* 🔥 Footer replaced with real data */}
        <div className="card-footer">
          <div className="row g-4">
            <Card
              bg_color={"bg-primary"}
              price={totalEmployees}
              progress={"100%"}
              title={"Total Employees"}
            />

            <Card
              bg_color={"bg-success"}
              price={maxDept.value}
              progress={"80%"}
              title={`Top: ${maxDept.name}`}
            />

            <Card
              bg_color={"bg-danger"}
              price={cleanedDept.length}
              progress={"60%"}
              title={"Departments"}
            />

            <Card
              bg_color={"bg-dark"}
              price={Math.round(totalEmployees / (cleanedDept.length || 1))}
              progress={"70%"}
              title={"Avg / Dept"}
            />
          </div>
        </div>

        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default PaymentRecordChart;

const Card = ({ title, price, progress, bg_color }) => {
  return (
    <div className="col-lg-3">
      <div className="p-3 border border-dashed rounded">
        <div className="fs-12 text-muted mb-1">{title}</div>
        <h6 className="fw-bold text-dark">{price}</h6>
        <div className="progress mt-2 ht-3">
          <div
            className={`progress-bar ${bg_color}`}
            role="progressbar"
            style={{ width: progress }}
          ></div>
        </div>
      </div>
    </div>
  );
};
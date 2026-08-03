"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CardHeader from "@/components/shared/CardHeader";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LeadsOverviewChart = ({ chartHeight = 280, isFooterShow }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  const { charts, fetchDashboard, loading } = usehrdashboardStore();

  if (isRemoved) return null;

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ✅ Format labels
  const formatLabel = (text) =>
    text.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const employmentData = charts?.employmentType || [];

  const series = employmentData.map(item => item.value);
  const labels = employmentData.map(item => formatLabel(item.name));

  const options = {
    labels,

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const value = opts.w.config.series[opts.seriesIndex];
        return `${val.toFixed(1)}% (${value})`; // 👈 exact value
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val; // 👈 no K format
        },
      },
    },

    yaxis: {
      labels: {
        formatter: function (val) {
          return val; // 👈 prevent 3K, 5K
        },
      },
    },
  };

  return (
    <div className="col-xxl-4">
      <div
        className={`card stretch stretch-full leads-overview ${isExpanded ? "card-expand" : ""
          } ${refreshKey ? "card-loading" : ""}`}
      >
        <CardHeader
          title={"Employment Overview"} // ✅ updated title
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body custom-card-action">
          {/* 🔥 Chart */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 280 }}>
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={chartHeight}
            />
          )}

          {/* 🔥 SAME UI STYLE (replacing fake data) */}
          <div className="row g-2 pt-2">
            {charts.employmentType.map((item, index) => (
              <div key={index} className="col-4">
                <Link
                  href="#"
                  className="p-2 hstack gap-2 rounded border border-dashed border-gray-5"
                >
                  {/* color dot */}
                  <span
                    className="wd-7 ht-7 rounded-circle d-inline-block"
                    style={{
                      backgroundColor: `hsl(${index * 80}, 70%, 50%)`,
                    }}
                  ></span>

                  <span className="d-flex flex-column">
                    <span className="fs-12 fw-semibold">
                      {formatLabel(item.name)}
                    </span>

                    <span className="fs-10 text-muted">
                      {item.value}
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {isFooterShow && (
          <Link
            href="#"
            className="card-footer fs-11 fw-bold text-uppercase text-center"
          >
            Updated just now
          </Link>
        )}

        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default LeadsOverviewChart;
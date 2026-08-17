"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CardHeader from "@/components/shared/CardHeader";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EmployeementOverview = ({
  chartHeight = 280,
  isFooterShow,
}) => {
  const {
    refreshKey,
    isRemoved,
    isExpanded,
    handleRefresh,
    handleExpand,
    handleDelete,
  } = useCardTitleActions();

  const {
    charts,
    fetchDashboard,
    loading,
  } = usehrdashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isRemoved) return null;

  const formatLabel = (text = "") =>
    text
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const employmentData = charts?.employmentType || [];

  /*
   * Same color combination used throughout the dashboard
   */
  const colors = [
    "#3454d1", // Primary
    "#25b865", // Success
    "#f7c948", // Warning
    "#d13b3b", // Danger
    "#845adf", // Purple
    "#17a2b8", // Info
  ];

  const series = employmentData.map((item) => Number(item.value) || 0);

  const labels = employmentData.map((item) =>
    formatLabel(item.name)
  );

  const chartColors = employmentData.map(
    (_, index) => colors[index % colors.length]
  );

  const options = useMemo(
    () => ({
      labels,

      colors: chartColors,

      legend: {
        show: false,
      },

      stroke: {
        width: 2,
      },

      dataLabels: {
        enabled: true,

        formatter: function (val, opts) {
          const value =
            opts.w.config.series[opts.seriesIndex];

          return `${val.toFixed(1)}% (${value})`;
        },

        style: {
          fontSize: "11px",
          fontWeight: 500,
        },
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} Employees`;
          },
        },
      },

      plotOptions: {
        pie: {
          donut: {
            size: "68%",

            labels: {
              show: true,

              total: {
                show: true,
                label: "Total Employees",

                formatter: function (w) {
                  return w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  );
                },
              },
            },
          },
        },
      },
    }),
    [labels, chartColors]
  );

  return (
    <div className="col-xxl-4">
      <div
        className={`card stretch stretch-full leads-overview ${
          isExpanded ? "card-expand" : ""
        } ${refreshKey ? "card-loading" : ""}`}
      >
        <CardHeader
          title="Employment Overview"
          refresh={handleRefresh}
          remove={handleDelete}
          expanded={handleExpand}
        />

        <div className="card-body custom-card-action">

          {/* DONUT CHART */}
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: 280 }}
            >
              <div
                className="spinner-border text-primary"
                role="status"
              />
            </div>
          ) : employmentData.length === 0 ? (
            <div
              className="d-flex justify-content-center align-items-center text-muted"
              style={{ height: 280 }}
            >
              No employment data available
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={chartHeight}
            />
          )}

          {/* EMPLOYMENT STATISTICS */}
          <div className="row g-2 pt-3">
            {employmentData.map((item, index) => {
              const color = colors[index % colors.length];

              return (
                <div
                  key={item.name || index}
                  className="col-6"
                >
                  <Link
                    href="#"
                    className="p-2 hstack justify-content-between rounded border border-dashed border-gray-5"
                  >
                    <div className="hstack gap-2">

                      {/* COLOR DOT */}
                      <span
                        className="wd-7 ht-7 rounded-circle d-inline-block flex-shrink-0"
                        style={{
                          backgroundColor: color,
                        }}
                      />

                      {/* LABEL */}
                      <span className="d-flex flex-column">
                        <span className="fs-12 fw-semibold text-dark">
                          {formatLabel(item.name)}
                        </span>

                        <span className="fs-10 text-muted">
                          Employees
                        </span>
                      </span>
                    </div>

                    {/* VALUE */}
                    <span
                      className="fs-12 fw-bold"
                      style={{
                        color: color,
                      }}
                    >
                      {item.value}
                    </span>
                  </Link>
                </div>
              );
            })}
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

export default EmployeementOverview;
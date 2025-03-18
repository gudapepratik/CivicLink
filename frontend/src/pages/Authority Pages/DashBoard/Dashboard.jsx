import DashboardReportItem from "@/components/DashboardReportItem/DashboardReportItem";
import { EngagementStats } from "@/components/EngagementStats/EngagementStats";
import MetricsCard from "@/components/MetricsCard/MetricsCard";
import ProgressBar from "@/components/Progress-bar/Progress-bar";
import React from "react";
import { NavLink } from "react-router";

function Dashboard() {
  const engagementStats = [
    { value: "1.2k", label: "Active Users" },
    { value: "4.8k", label: "Interactions" },
    { value: "87%", label: "Satisfaction" },
  ]

  const metricsCardData = [
    {
      title: "Total Reports",
      value: "248",
      change: {
        isPositive: true,
        value: "+12% from last week"
      }
    },
    {
      title: "Resolved",
      value: "180",
      change: {
        isPositive: true,
        value: "+8% from last week"
      }
    },
    {
      title: "Pending",
      value: "68",
      change: {
        isPositive: false,
        value: "+3% from last week"
      }
    },
    {
      title: "Avg. Response",
      value: "4.2h",
      change: {
        isPositive: true,
        value: "-0.8% from last week"
      }
    },
  ]

  const recentReports = [
    {
      id: 1,
      title: "Street light outage",
      location: "Main St & 5th Ave",
      status: "Resolved",
      time: "2h ago",
    },
    { id: 2, title: "Pothole reported", location: "Oak Lane", status: "In Progress", time: "5h ago" },
    { id: 3, title: "Graffiti on wall", location: "Central Park", status: "Pending", time: "1d ago" },
    {
      id: 4,
      title: "Fallen tree branch",
      location: "Riverside Dr",
      status: "Resolved",
      time: "1d ago",
    },
  ]

  return (
    <>
      <div className="w-full p-4 flex flex-col bg-zinc-100 dark:bg-zinc-950 min-h-screen font-outfit items-center">
        <h1 className="w-full text-xl font-medium text-left mb-4">Dashboard Overview</h1>
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
            {metricsCardData.map((card,key) => (
              <MetricsCard key={key} title={card.title} value={card.value} change={card.change}/>
            ))}
        </div>

        {/* Resolution Rate */}
        <div className="w-full mb-6">
          <ProgressBar title="Resolution Rate" value={75} target={80} additionalInfo="+5% from last month" />
        </div>

        {/* Community Engagement */}
        <div className="mb-6 w-full">
          <EngagementStats title="Community Engagement" stats={engagementStats} />
        </div>

        {/* Reports list  */}
        <div className="w-full bg-white dark:bg-zinc-800  rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <p className="font-medium text-gray-800 dark:text-white">Recent Reports</p>
          </div>
          <div className="divide-y">
            {recentReports.map((report) => (
              <DashboardReportItem key={report.id} {...report}  />
            ))}
          </div>
            <div className="p-3 border-t text-center">
              <NavLink className="text-sm text-blue-600 font-medium">
                View All Reports
              </NavLink>
            </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

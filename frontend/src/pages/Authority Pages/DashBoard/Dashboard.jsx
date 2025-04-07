import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import DashboardReportItem from "@/components/DashboardReportItem/DashboardReportItem";
import { EngagementStats } from "@/components/EngagementStats/EngagementStats";
import MetricsCard from "@/components/MetricsCard/MetricsCard";
import ProgressBar from "@/components/Progress-bar/Progress-bar";
import  PostService  from "@/api/services/post.services";
import { useSelector } from "react-redux";
import { useLocationContext } from "@/utils/Context/LocationContext";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentReports, setRecentReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.authSlice.user)
  const { location, setLocation } = useLocationContext();
  const navigate = useNavigate()

  // console.log(user)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await PostService.getAuthorityDashboardData({departmentId: user?.departmentId}); // 👈 Make sure this function returns resolvedData[0]
        setDashboardData(response?.data?.data);
      } catch (error) {
        
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchRecentReports()
  }, [user]);

  const fetchRecentReports = async () => {
    try {
      setLoading(true)
      const response = await PostService.getPostsByDepartmentAndLocation({departmentId: user?.departmentId, latitude: location.lat, longitude: location.lng, distance: 30, sortBy: ["recent"]});
      setRecentReports(response?.data?.data);
    } catch (error) {
      
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-lg">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-4 text-center text-red-500">Failed to load dashboard data</div>;
  }

  const {
    totalReports,
    resolvedReports,
    pendingReports,
    avgResponseInHours,
    resolutionRate,
    activeUsers,
  } = dashboardData;

  const metricsCardData = [
    {
      title: "Total Reports",
      value: totalReports,
      change: {
        isPositive: true,
        value: "+12% from last week", // You can make this dynamic too later
      },
    },
    {
      title: "Resolved",
      value: resolvedReports,
      change: {
        isPositive: true,
        value: "+8% from last week",
      },
    },
    {
      title: "Pending",
      value: pendingReports,
      change: {
        isPositive: false,
        value: "+3% from last week",
      },
    },
    {
      title: "Avg. Response",
      value: `${avgResponseInHours?.toFixed(1)}h`,
      change: {
        isPositive: true,
        value: "-0.8% from last week",
      },
    },
  ];

  const engagementStats = [
    { value: `${activeUsers}`, label: "Active Users" },
    { value: "4.8k", label: "Interactions" }, // static
    { value: "87%", label: "Satisfaction" }, // static
  ];

  return (
    <div className="w-full p-4 flex flex-col bg-zinc-100 dark:bg-zinc-950 min-h-screen font-outfit items-center">
      <h1 className="w-full text-xl font-medium text-left mb-4">Dashboard Overview</h1>

      <div className="w-full grid grid-cols-2 gap-4 mb-6">
        {metricsCardData && metricsCardData.map((card, key) => (
          <MetricsCard key={key} title={card.title} value={card.value} change={card.change} />
        ))}
      </div>

      {/* Resolution Rate */}
      <div className="w-full mb-6">
        <ProgressBar
          title="Resolution Rate"
          value={resolutionRate}
          target={80}
          additionalInfo="+5% from last month"
        />
      </div>

      {/* Reports list */}
      <div className="w-full bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <p className="font-medium text-gray-800 dark:text-white">Recent Reports</p>
        </div>
        <div className="divide-y">
          {recentReports && recentReports.map((report) => (
            <DashboardReportItem key={report._id} {...report} onClick={() => navigate(`/explore-posts/${report._id}`)} />
          ))}
        </div>
        <div className="p-3 border-t text-center">
          <NavLink to={'/new-reports'} className="text-sm text-blue-600 font-medium">View All Reports</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

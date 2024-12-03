import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import NumberTicker from "../../components/numberTicker";
import axios from "axios";
import AdminActivityGraph from "../../components/adminWeekActivity";

const DashboardOverview = ({ user, isCollapsed }) => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [recentCompanies, setRecentCompanies] = useState([]);
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };


  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const recentResponse = await axios.get(
          `http://localhost:4000/api/admin/recently/${user.id}`
        );
        setRecentActivities(recentResponse.data);
        const dashboardData = await axios.get(
          `http://localhost:4000/api/admin/dashboard`
        );
        setStatsData(dashboardData.data.data.overallCounts);
        setRecentCompanies(dashboardData.data.data.recentCompanies);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [user.id]);

  // Data for bar chart
  const barData = [
    { name: "Jobs", count: statsData?.JobsApplication || 0 },
    { name: "Internships", count: statsData?.InternshipApplication || 0 },
  ];

  return (
    <div
      className={`mx-auto selection:select-none pb-2 ${isCollapsed ? "max-w-7xl" : "max-w-6xl"
        }`}
    >
      <h1 className="text-2xl font-bold text-left">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <motion.div
          key="jobs"
          className="bg-teal-50 flex gap-3 p-4 rounded-lg shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="flex h-20 w-28 self-center shadow-lg rounded-2xl">
            <img src="\images\joblast.png" alt="img" />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold whitespace-nowrap capitalize text-blue-600">
              Active Jobs
            </h2>
            <p className="text-4xl font-bold mt-2">
              <NumberTicker count={statsData?.JobsApplication || 0} />
            </p>
          </div>
        </motion.div>

        <motion.div
          key="internships"
          className="p-4 gap-3 flex bg-amber-50 bg-opacity-80 rounded-lg shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex h-20 w-28  self-center shadow-lg rounded-2xl">
            <img src="/images/internlast.png" alt="img" />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold whitespace-nowrap capitalize text-blue-600">
              Active Internship
            </h2>
            <p className="text-4xl font-bold mt-2">
              <NumberTicker count={statsData?.InternshipApplication || 0} />
            </p>
          </div>
        </motion.div>
        <motion.div
          key="companies"
          className="bg-teal-100 p-4 flex bg-opacity-60 w-full rounded-lg shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex h-20 w-28  self-center shadow-lg rounded-2xl">
            <img src="/images/company.png" alt="img" />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold capitalize text-blue-600">
              Total Companies
            </h2>
            <p className="text-4xl font-bold mt-2">
              <NumberTicker count={statsData?.companies || 0} />
            </p>
          </div>
        </motion.div>

        <motion.div
          key="users"
          className="bg-orange-50 p-4 flex gap-2 rounded-lg shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex h-20 w-28  self-center shadow-lg rounded-2xl">
            <img src="/images/userlast.png" alt="img" />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold capitalize">Total Users</h2>
            <p className="text-4xl font-bold mt-2">
              <NumberTicker count={statsData?.users || 0} />
            </p>
          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-lg mb-8 ">
        <div className="flex w-full gap-2">
          {/* Recent Activities Section */}
          <div className="bg-white shadow-md rounded-lg p-2 w-8/12">
            <h3 className="text-xl font-medium text-left mb-4">Recent Activities</h3>
            {recentActivities.length === 0 ? (
              <p className="text-gray-500">No recent activities</p>
            ) : (
              <ul className="space-y-2 p-2">
                {recentActivities.map((activity, index) => (
                  <motion.li
                    key={activity._id}
                    className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm"
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="text-gray-800">{activity.action}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        {/* Weekly Activities Section */}
        <div className="w-4/12">
          <AdminActivityGraph userId={user.id} />
        </div>
        </div>
      </div>

      <div className="flex w-full gap-2">
        {/* Jobs vs Internships Chart */}
        <div className="rounded-lg shadow-lg w-4/12 bg-white p-2">
          <h2 className="text-xl font-bold mb-4">
            Jobs vs Internships
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 60, left: 8, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 14 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#4299e1"
                barSize={30}
                background={{ fill: "#eee" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recently Registered Companies */}
        <div className="rounded-lg shadow-lg w-8/12 p-2 bg-white">
          <h2 className="text-xl font-medium text-left mb-4">
            Recently Registered Companies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3 ">
            {recentCompanies.map((company, index) => (
              <motion.div
                key={index}
                className="border px-2 py-2 rounded-lg shadow lg:col-span-3 justify-between flex transition-all"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg text-cyan-950 text-left">
                    <span>{company.name}</span>
                  </h3>
                  <p className="text-sm text-slate-950  flex">
                    Current Status:
                    <span
                      className={` text-sm font-medium pl-2 self-center ${company.details === "Pending"
                          ? "text-orange-400"
                          : company.details === "Rejected"
                            ? "text-red"
                            : "text-green-400"
                        }`}
                    >
                      {company.details}
                    </span>
                  </p>
                </div>
                <div className="self-center">
                  <p className="text-sm text-violet-800 self-center font-medium justify-center">
                    Date: {new Date(company.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

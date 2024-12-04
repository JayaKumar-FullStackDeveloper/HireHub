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
import { GrFormAdd } from "react-icons/gr";
import NumberTicker from "../../components/numberTicker";
import axios from "axios";
import AdminActivityGraph from "../../components/adminWeekActivity";
import { Link } from "react-router-dom";

const DashboardOverview = ({ user, isCollapsed }) => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [recentCompanies, setRecentCompanies] = useState([]);
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4 },
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <motion.div className="col-span-4 flex shadow-cyan-100 shadow-inner border-cyan-100 rounded-lg h-28 border justify-between px-4" style={{ backgroundColor: "#f9fafe", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="flex">
            <div className="self-center">
              <img src="images/crm-bar-chart.png" className='h-28 w-28' alt="img" />
            </div>
            <div className="flex flex-col self-center justify-around relative">
              <h4 className="font-semibold  text-xl text-left font-lato" style={{ color: "#56c0f9" }}>Welcome to</h4>
              <h4 className='font-extrabold text-3xl text-left font-poppins' style={{ color: "#3179de" }}>HireHub</h4>
              <div className="self-center absolute -right-40 rotate-30">
                <img src="images/crm-line-chart.png" className='h-28 w-full' alt="img" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl self-center font-bold text-sky-800 drop-shadow-2xl shadow-cyan-300 font-poppins text-left">Dashboard Overview</h1>
          <div className="self-center">
            <Link
              className={`bg-indigo-600 flex text-white py-2 px-4 justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:bg-indigo-700 hover:shadow-sm`} to='/admin/dashboard/candidates/add'
            >
              <span className="self-center justify-center text-2xl">
                <GrFormAdd />
              </span>
              <h3 className="font-medium">
                Add Candidate
              </h3>
            </Link>
          </div>
        </motion.div>
        <motion.div
          key="jobs"
          className="bg-teal-50 flex gap-3 p-4 rounded-lg transition-shadow duration-300"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <motion.div
            className="flex h-20 w-28 self-center shadow-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="/images/joblast.png"
              alt="img"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold whitespace-nowrap capitalize text-blue-600">
              Active Jobs
            </h2>
            <NumberTicker
              count={statsData?.JobsApplication || 0}
              className="text-4xl font-bold mt-2"
            />
          </div>
        </motion.div>

        <motion.div
          key="internships"
          className="p-4 gap-3 flex bg-amber-50 bg-opacity-80 rounded-lg transition-shadow duration-300"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="flex h-20 w-28 self-center shadow-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >            <img src="/images/internlast.png" alt="img" />
          </motion.div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold whitespace-nowrap capitalize text-blue-600">
              Active Internship
            </h2>
            <NumberTicker count={statsData?.InternshipApplication || 0} className="text-4xl font-bold mt-2" />

          </div>
        </motion.div>
        <motion.div
          key="companies"
          className="bg-teal-100 p-4 flex bg-opacity-60 w-full rounded-lg transition-shadow duration-300"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="flex h-20 w-28 self-center shadow-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >            <img src="/images/company.png" alt="img" />
          </motion.div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold capitalize text-blue-600">
              Total Companies
            </h2>

            <NumberTicker count={statsData?.companies || 0} className="text-4xl font-bold mt-2" />

          </div>
        </motion.div>

        <motion.div
          key="users"
          className="bg-orange-50 p-4 flex gap-2 rounded-lg transition-shadow duration-300"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="flex h-20 w-28 self-center shadow-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >            <img src="/images/userlast.png" alt="img" />
          </motion.div>
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold capitalize">Total Users</h2>

            <NumberTicker count={statsData?.users || 0} className="text-4xl font-bold mt-2" />

          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-lg mb-8 ">
        <div className="flex w-full gap-2">
          {/* Recent Activities Section */}
          <motion.div className="bg-white shadow-md rounded-lg p-2 w-8/12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}>
            <div className="flex gap-2 self-center w-full mb-4 pl-2">
              <img src="images/recent.png" className="w-7 h-7 self-center" alt="img" />
              <h3 className="text-xl font-medium font-kanit text-sky-900 text-left self-center">Recent Activities</h3>
            </div>
            {recentActivities.length === 0 ? (
              <p className="text-gray-500">No recent activities</p>
            ) : (
              <ul className="space-y-2 p-2">
                {recentActivities.map((activity, index) => (
                  <motion.li
                    key={activity._id}
                    className="flex justify-between items-center p-3 bg-transparent rounded-lg shadow-sm border-l-4 border-indigo-700 border-opacity-90 hover:bg-sky-100 hover:bg-opacity-30"
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="text-gray-800 font-lato">{activity.action}</span>
                    <span className="text-sm text-emerald-500 font-roboto">
                      {new Date(activity.timestamp).toLocaleString().split(',')}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
          {/* Weekly Activities Section */}
          <motion.div className="w-4/12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }} >
            <AdminActivityGraph userId={user.id} />
          </motion.div>
        </div>
      </div>

      <div className="flex w-full gap-2">
        {/* Jobs vs Internships Chart */}
        <div className="rounded-lg shadow-lg w-3/12 bg-white p-2">
          <h2 className="text-xl font-medium font-kanit text-sky-900 flex self-center justify-center pt-1 text-center mb-4">
            Jobs <span className="px-1"><img src="images/vs.png" alt="img" className="w-7 h-7 self-center" /></span> Internships
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 50, left: 1, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                className="text-sm font-medium"
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
        <div className="rounded-lg shadow-lg w-9/12 p-2 bg-white">
          <div className="flex gap-2 self-center w-full mb-4 pl-2">
            <img src="images/recent-reg.png" className="w-7 h-7 self-center" alt="img" />
            <h2 className="text-xl font-medium self-center justify-center font-kanit text-sky-900 text-left">
              Recently Registered Companies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3 ">
            {recentCompanies.map((company, index) => (
              <motion.div
                key={index}
                className="px-2 py-2 rounded-lg shadow lg:col-span-3 justify-between flex border-b-2 hover:border-l-2 hover:border-sky-500 transition-all"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex flex-col">
                  <h3 className="font-medium font-lato text-base text-gray-950 text-left">
                    <span>{company.name}</span>
                  </h3>
                  <p className="text-sm text-slate-950 font-normal flex">
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
                    {new Date(company.createdAt).toLocaleString().split(',').map((part, index) => (
                      <div key={index}>{part}</div>
                    ))}                  </p>
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

import React from "react";
import { motion } from "framer-motion";
import { GrFormAdd } from "react-icons/gr";
import NumberTicker from "../../components/numberTicker";
import { Link } from "react-router-dom";

const EmpDashboardOverview = ({ userData, isCollapsed }) => {

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
          <h1 className="text-3xl self-center font-bold text-sky-800 drop-shadow-2xl shadow-cyan-300 font-poppins text-left">Employer Dashboard Overview</h1>
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
              count={30}
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
            <NumberTicker count={30} className="text-4xl font-bold mt-2" />

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

            <NumberTicker count={20} className="text-4xl font-bold mt-2" />

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

            <NumberTicker count={20} className="text-4xl font-bold mt-2" />

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmpDashboardOverview;

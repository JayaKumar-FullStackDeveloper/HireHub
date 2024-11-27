import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import NumberTicker from '../../components/numberTicker';

const DashboardOverview = () => {
  const stats = {
    totalCompanies: 120,
    totalUsers: 4500,
    activeJobs: 320,
    activeInternships: 150,
  };

  const adminActivities = [
    "Approved a new job post by 'Tech Solutions'.",
    "Reviewed 'Code Academy' company registration.",
    "Deactivated an expired internship post.",
    "Updated user privileges for 'John Doe'.",
  ];

  const recentCompanies = [
    { name: 'Tech Innovators', date: '2024-11-20', status: 'Approved' },
    { name: 'Code Solutions', date: '2024-11-22', status: 'Pending' },
    { name: 'Green Future', date: '2024-11-25', status: 'Approved' },
  ];

  const barData = [
    { name: 'Jobs', count: stats.activeJobs },
    { name: 'Internships', count: stats.activeInternships },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-extrabold text-blue-600 mb-8 text-left drop-shadow-lg">Dashboard Overview</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(stats).map(([key, value], index) => (
          <motion.div
            key={key}
            className="bg-white p-6 rounded-lg shadow-2xl hover:shadow-blue-400 transition-shadow duration-300"
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h2 className="text-xl font-semibold capitalize text-blue-600">{key.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-4xl font-bold text-blue-800 mt-2"><NumberTicker count={value}/></p>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Admin Activity</h2>
        <ul className="space-y-4">
          {adminActivities.map((activity, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-all"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
              <p className="text-blue-800 font-medium">{activity}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Jobs vs Internships</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4299e1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recently Registered Companies */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Recently Registered Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCompanies.map((company, index) => (
            <motion.div
              key={index}
              className="border p-4 rounded-lg shadow hover:shadow-blue-400 transition-all bg-gradient-to-r from-blue-50 to-blue-100"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="font-bold text-lg text-blue-700">{company.name}</h3>
              <p className="text-sm text-blue-600">Date: {company.date}</p>
              <p
                className={`text-sm font-semibold ${
                  company.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                Status: {company.status}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

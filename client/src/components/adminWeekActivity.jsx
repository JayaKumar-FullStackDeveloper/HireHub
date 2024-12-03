import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const WeeklyActivity = ({ userId }) => {
  const [chartData, setChartData] = useState([]);
  const [weekInfo, setWeekInfo] = useState({ week: "", month: "", year: "", today: "" });

  const processActivityData = useCallback((data) => {
    const today = new Date();
    const todayDateString = today.toLocaleDateString();
    const weekNumber = getWeekNumber(today);
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    setWeekInfo({ week: weekNumber, month, year, today: todayDateString });

    const dailyActivityCount = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - i)); 
      const dayString = day.toLocaleDateString();

      return {
        name: day.toLocaleString("default", { weekday: "short" }), 
        count: data.filter((activity) => {
          const activityDate = new Date(activity.timestamp);
          return activityDate.toLocaleDateString() === dayString;
        }).length,
      };
    });

    setChartData(dailyActivityCount);
  }, []);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/weekly/${userId}`);
        processActivityData(response.data);
      } catch (error) {
        console.error("Error fetching weekly activity data:", error);
      }
    };

    fetchActivityData();
  }, [userId, processActivityData]);

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date - startDate;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil(dayOfYear / 7);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-xl font-bold text-blue-600 mb-2 py-2">Weekly Activity Overview</h2>
      {/* Week Information */}
      <div className="mb-4">
        <p className="text-lg">Today: {weekInfo.today}</p>
      </div>
      {/* Bar Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -14, bottom: 20 }}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14 }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyActivity;

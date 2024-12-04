import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const WeeklyActivity = ({ userId }) => {
  const [chartData, setChartData] = useState([]);

  const processActivityData = useCallback((data) => {
    const today = new Date();
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

  return (
    <div className="bg-white shadow-lg rounded-lg w-full">
      <div className="flex self-center mb-2"> 
        <div className='self-center justify-center p-2'>
        <lord-icon
          src="https://cdn.lordicon.com/zsaomnmb.json"
          trigger="in"
          delay="500"
          style={{width:"30px" ,height:"30px"}}>
        </lord-icon>
        </div>
        <h2 className="text-xl font-kanit font-medium text-sky-900 self-center justify-center text-center py-2">Weekly Activity Overview</h2>
      </div>
      {/* Bar Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 35, left: -14, bottom: 20 }}
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

// src/features/dashboard/dashboardService.js
import axios from "axios";

export const getDashboardStats = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/dashboard/active-users");

    return {
      activeUsers: res.data.activeUsers.length,
      totalProjects: 5, // You can make dynamic if you want
      totalSkills: 3,
    };
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    throw err;
  }
};

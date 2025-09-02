// src/features/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Users, FolderKanban, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalProjects: 0,
    totalSkills: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activeUsersSnap = await getDocs(collection(db, "activeUsers"));
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        const activeUsers = activeUsersSnap.docs.filter(doc => {
          const data = doc.data();
          const lastSeen = data.lastSeen?.toDate();
          return lastSeen && now - lastSeen.getTime() < fiveMinutes;
        });

        const projectsSnap = await getDocs(collection(db, "projects"));
        const totalProjects = projectsSnap.size;

        const skillsSnap = await getDocs(collection(db, "skills"));
        const totalSkills = skillsSnap.size;

        setStats({
          activeUsers: activeUsers.length,
          totalProjects,
          totalSkills,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <Users className="text-blue-500 w-8 h-8" />,
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: <FolderKanban className="text-green-500 w-8 h-8" />,
    },
    {
      title: "Skills",
      value: stats.totalSkills,
      icon: <BrainCircuit className="text-purple-500 w-8 h-8" />,
    },
  ];

  const activityData = [
    { time: "Now", users: stats.activeUsers },
    { time: "5 Min Ago", users: Math.max(0, stats.activeUsers - 1) },
    { time: "10 Min Ago", users: Math.max(0, stats.activeUsers - 2) },
  ];

  const projectData = [
    { month: "Jan", projects: 2 },
    { month: "Feb", projects: 3 },
    { month: "Mar", projects: 5 },
    { month: "Apr", projects: 4 },
    { month: "May", projects: stats.totalProjects },
  ];

  const skillsData = [
    { name: "Frontend", value: Math.floor(stats.totalSkills * 0.5) },
    { name: "Backend", value: Math.floor(stats.totalSkills * 0.3) },
    { name: "Other", value: Math.floor(stats.totalSkills * 0.2) },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          statCards.map((stat, index) => (
            <Card key={index} className="shadow-md rounded-2xl p-4">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-xl font-semibold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Active User Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Projects Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={projectData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Skills Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {skillsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

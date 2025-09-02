import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Settings2,
  User,
  Mail,
  LogOut,
  Menu,
  Settings,
  User2,
  X,
  Settings2Icon,
} from "lucide-react";
import { TabsList, TabsTrigger } from "../components/ui/Tabs";
import Dashboard from "../components/admin/dashboard/Dashboard";
import Projects from "../components/admin/project/Projects";
import Skills from "../components/admin/skills/Skills";
import AboutEditor from "../components/admin/about/AboutEditor";
import Certificates from "../components/admin/certificates/Certificates";
import ContactEditor from "../components/admin/contact/ContactEditor";
import Profile from "../components/admin/profile/Profile";
import ContactMessages from "../components/admin/messages/ContactMessages";
import Loader from "../components/admin/loader/Loader";
import ResumeUploader from "../components/admin/resume/ResumeUploader";

const AdminPanel = ({ onLogout }) => {
  const [tab, setTab] = useState("dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("adminEmail") || "admin@panel.com";
    const username = email.split("@")[0];
    setAdminName(username);
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl font-bold text-gray-800 transition-all duration-300 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Admin{" "}
            <span className="text-xs font-normal ml-2">{adminName}</span>
          </h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hidden md:block"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
        <TabsList className="flex flex-col space-y-2">
          {[
            {
              value: "dashboard",
              icon: <LayoutDashboard size={18} />,
              label: "Dashboard",
            },
            { value: "projects", icon: <FolderKanban size={18} />, label: "Projects" },
            { value: "skills", icon: <Settings2 size={18} />, label: "Skills" },
             { value: "certificates", icon: <Settings2Icon size={18} />, label: "Certificates" },
            { value: "about", icon: <User size={18} />, label: "About" },
            { value: "contact", icon: <Mail size={18} />, label: "Contact" },
            { value: "message", icon: <User2 size={18} />, label: "Message" },
            {
              value: "resume",
              icon: <FolderKanban size={18} />,
              label: "Resume",
            },
            { value: "profile", icon: <Settings size={18} />, label: "Profile" },
          ].map(({ value, icon, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              onClick={() => {
                setTab(value);
                setMobileSidebar(false);
              }}
              className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition ${
                tab === value ? "bg-gray-200" : ""
              }`}
            >
              {icon} {!collapsed && label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <button
        onClick={() => setShowLogoutDialog(true)}
        className="mt-6 flex items-center gap-2 text-red-600 hover:text-red-800 transition"
      >
        <LogOut size={18} /> {!collapsed && "Logout"}
      </button>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center justify-between px-4 h-14">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button
          onClick={() => setMobileSidebar(true)}
          aria-label="Open sidebar"
          className="text-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 flex bg-black bg-opacity-50 transition-opacity duration-300 ${
          mobileSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebar(false)}
      >
        <aside
          className={`bg-white w-64 p-4 h-full shadow-lg relative transform transition-transform duration-300 ease-in-out ${
            mobileSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Close Button */}
          <button
            onClick={() => setMobileSidebar(false)}
            className={`absolute top-4 right-4 text-gray-600 hover:text-gray-900
              transition-opacity duration-300 ease-in-out
              ${
                mobileSidebar ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              }
            `}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
          <SidebarContent />
        </aside>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } fixed top-0 left-0 h-screen bg-white shadow-md p-4 z-40 transition-all duration-300 hidden md:flex flex-col`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 w-full pt-16 md:pt-0 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <main className="p-4">
          {tab === "dashboard" && <Dashboard />}
          {tab === "projects" && <Projects />}
          {tab === "skills" && <Skills />}
           {tab === "certificates" && <Certificates />}
          {tab === "about" && <AboutEditor />}
          {tab === "contact" && <ContactEditor />}
          {tab === "message" && <ContactMessages />}
          {tab === "resume" && <ResumeUploader />}
          {tab === "profile" && <Profile />}
        </main>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowLogoutDialog(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  setShowLogoutDialog(false);
                  localStorage.removeItem("isAdminLoggedIn");
                  if (typeof onLogout === "function") onLogout();
                  navigate("/admin");
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

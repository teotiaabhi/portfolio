import React, { useState, useEffect } from "react";

const defaultProfile = {
  id: "admin01",
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState(defaultProfile);
  const [form, setForm] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setForm(parsed);
    }
  }, []);

  const handleProfileSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(form));
    setProfile(form);
    setEditing(false);
    setMessage("✅ Profile updated successfully.");
  };

  const handlePasswordChange = () => {
    if (oldPassword !== profile.password) {
      setMessage("❌ Old password is incorrect.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("❌ New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    const updated = { ...profile, password: newPassword };
    setProfile(updated);
    setForm(updated); // Update the form as well
    localStorage.setItem("userProfile", JSON.stringify(updated));

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("✅ Password changed successfully.");
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto min-h-[80vh] shadow rounded border">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-4 md:p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 md:mb-6 text-gray-800">Profile Settings</h2>
        <div className="space-y-3">
          <button
            className={`w-full text-left px-4 py-2 rounded ${activeTab === "account" ? "bg-blue-300 text-black" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("account")}
          >
            Account Information
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${activeTab === "password" ? "bg-blue-300 text-black" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-2/3 p-4 md:p-6 space-y-6">
        {activeTab === "account" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Account Information</h3>
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="User ID"
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="w-full border rounded p-2"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className="w-full border rounded p-2"
                />
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={handleProfileSave}
                    className="bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm(profile);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>ID:</strong> {profile.id}</p>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-blue-700 text-white px-4 py-2 rounded w-full"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-gray-100 p-3 rounded text-sm text-center text-blue-800">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

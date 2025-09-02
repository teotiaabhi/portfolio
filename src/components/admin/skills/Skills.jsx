import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingType, setLoadingType] = useState(""); // '', 'add', or 'delete-<id>'

  const fetchSkills = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "skills"));
    const skillList = snap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setSkills(skillList);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return toast.error("Skill cannot be empty.");
    setLoadingType("add");
    try {
      await addDoc(collection(db, "skills"), { name: trimmed });
      toast.success("Skill added successfully!");
      setSkillInput("");
      await fetchSkills();
    } catch (error) {
      toast.error("Failed to add skill.");
    }
    setLoadingType("");
  };

  const handleDeleteSkill = async (id) => {
    setLoadingType(`delete-${id}`);
    try {
      await deleteDoc(doc(db, "skills", id));
      toast.success("Skill deleted successfully!");
      await fetchSkills();
    } catch (error) {
      toast.error("Failed to delete skill.");
    }
    setLoadingType("");
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-4">Skills Manager</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Enter a skill (e.g. React)"
          className="w-full sm:flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddSkill}
          disabled={loadingType === "add"}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto flex items-center justify-center gap-2 ${
            loadingType === "add" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loadingType === "add" && (
            <Loader className="animate-spin w-4 h-4" />
          )}
          Add
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            >
              {skill.name}
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                disabled={loadingType === `delete-${skill.id}`}
                className="text-red-600 font-bold flex items-center justify-center"
              >
                {loadingType === `delete-${skill.id}` ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  "×"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;

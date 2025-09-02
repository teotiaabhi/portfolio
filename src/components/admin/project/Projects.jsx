import React, { useState, useEffect } from "react";
import { getProjects, deleteProject } from "./projectService";
import ProjectForm from "./ProjectForm";
import { toast, Toaster } from "react-hot-toast";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageIndex, setImageIndex] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Auto-slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => {
        const updated = { ...prev };
        projects.forEach((project) => {
          const count = project.images?.length || 1;
          updated[project.id] = (updated[project.id] || 0) + 1;
          if (updated[project.id] >= count) updated[project.id] = 0;
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [projects]);

  const handleSave = () => {
    fetchProjects();
    setShowForm(false);
    setEditing(null);
    toast.success("Project saved successfully!");
  };

  const handleEdit = (project) => {
    setEditing(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;
    const deleting = toast.loading("Deleting project...");
    try {
      await deleteProject(id);
      toast.success("Project deleted!", { id: deleting });
      fetchProjects();
    } catch (err) {
      toast.error("Error deleting project", { id: deleting });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Project Manager</h2>
        {!showForm && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
          >
            + Add New Project
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm
          existing={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          showToast={toast} // pass toast instance
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded shadow">
            {project.images?.length > 0 && (
              <div className="mb-4">
                <img
                  src={project.images[imageIndex[project.id] || 0]}
                  alt="Project Slide"
                  className="h-48 w-full object-cover rounded transition-all duration-500"
                />
              </div>
            )}

            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {project.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Live
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>

            <div className="mt-3 flex gap-4 text-sm">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

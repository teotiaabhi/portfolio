import React, { useState, useEffect } from "react";
import { addProject, updateProject } from "./projectService";

const ProjectForm = ({ existing, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    liveLink: "",
    githubLink: "",
    technologies: [],
    images: [],
  });

  const [techInput, setTechInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageMessage, setImageMessage] = useState("");

  const imgbbAPIKey = "1b89022d172c644078ba8ecd91ad335b"; // Replace with your own key

  useEffect(() => {
    if (existing) setFormData(existing);
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      setImageMessage("Image(s) selected successfully ✅");
    } else {
      setImageMessage("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  const uploadImagesToImgBB = async () => {
    const urls = [];

    for (const file of selectedFiles) {
      const data = new FormData();
      data.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json?.data?.url) {
        urls.push(json.data.url);
      }
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedUrls = await uploadImagesToImgBB();
      const updatedForm = {
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      };

      if (existing) {
        await updateProject(updatedForm);
      } else {
        await addProject(updatedForm);
      }

      onSave(updatedForm);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to save project.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
      <h3 className="text-lg font-bold mb-4">{existing ? "Edit" : "Add"} Project</h3>

      {["title", "description", "liveLink", "githubLink"].map((field) => (
        <div className="mb-3" key={field}>
          <label className="block text-sm font-medium capitalize mb-1">{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required={field === "title" || field === "description"}
          />
        </div>
      ))}

      {/* Technologies */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Technologies Used</label>
        <div className="flex flex-col sm:flex-row sm:gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. React"
            className="flex-1 border px-3 py-2 rounded mb-2 sm:mb-0"
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tech}
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() => handleRemoveTech(tech)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Images</label>
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition"
        >
          <div className="text-center">
            <svg
              className="w-10 h-10 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">Click or drag images to upload</p>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {imageMessage && (
          <p className="text-green-600 text-sm mt-2">{imageMessage}</p>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          {formData.images.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt={`preview-${i}`}
                className="h-16 w-16 object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mt-4">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Save"}
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;

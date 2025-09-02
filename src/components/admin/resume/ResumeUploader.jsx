// src/components/ResumeUploader.jsx
import React, { useState, useEffect } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import axios from "axios";

const ResumeUploader = () => {
  const [storedFileName, setStoredFileName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const imgbbApiKey = "1b89022d172c644078ba8ecd91ad335b";

  useEffect(() => {
    const storedName = localStorage.getItem("resumeFileName");
    if (storedName) setStoredFileName(storedName);
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      ["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
    ) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64Image = reader.result.split(",")[1];

          const formData = new FormData();
          formData.append("key", imgbbApiKey);
          formData.append("image", base64Image);
          formData.append("name", selectedFile.name);

          const response = await axios.post("https://api.imgbb.com/1/upload", formData);

          if (response.data.success) {
            const imageUrl = response.data.data.url;

            localStorage.setItem("resumeUrl", imageUrl); // 👈 Save for user panel
            localStorage.setItem("resumeFileName", selectedFile.name);
            setStoredFileName(selectedFile.name);
            setSuccessMsg("✅ Resume image uploaded successfully!");
            setError("");
          } else {
            throw new Error("Upload failed");
          }
        } catch (err) {
          console.error(err);
          setError("❌ Failed to upload resume. Please try again.");
          setSuccessMsg("");
        }
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setStoredFileName("");
      setSuccessMsg("");
      setError("❌ Invalid file type. Please upload an image (PNG, JPG, JPEG).");
    }
  };

  const handleRemoveFile = () => {
    localStorage.removeItem("resumeUrl");
    localStorage.removeItem("resumeFileName");
    setStoredFileName("");
    setSuccessMsg("");
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 border border-gray-300 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col items-center justify-center bg-white">
      <div className="flex items-center gap-3 mb-8">
        <UploadCloud className="text-blue-600" size={32} />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Upload Resume (as Image)</h2>
      </div>

      <label className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-gray-600 text-sm sm:text-base">
          Click to browse or drag & drop your resume image
        </p>
      </label>

      {storedFileName && (
        <div className="mt-5 flex items-center justify-between text-sm text-gray-700 px-4 py-2 rounded border border-gray-200 bg-gray-50 w-full">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" size={18} />
            <span className="truncate max-w-[150px] sm:max-w-xs">{storedFileName}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove resume"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {successMsg && <p className="text-green-600 text-sm mt-4 text-center">{successMsg}</p>}
      {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
};

export default ResumeUploader;

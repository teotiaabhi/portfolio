import React from "react";

const DownloadResumeButton = () => {
  const handleDownloadResume = async () => {
    const resumeUrl = localStorage.getItem("resumeUrl");
    const fileName = localStorage.getItem("resumeFileName") || "resume.jpg";

    if (!resumeUrl) {
      alert("❌ No resume uploaded yet!");
      return;
    }

    try {
      const response = await fetch(resumeUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release blob memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("❌ Failed to download resume image.");
    }
  };

  return (
    <button
      onClick={handleDownloadResume}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition"
    >
      Download Resum
    </button>
  );
};

export default DownloadResumeButton;

import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const CertificateForm = ({ onSuccess, onCancel, editData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Array of File objects
  const [previewUrls, setPreviewUrls] = useState([]); // Array of preview URLs
  const [loading, setLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const IMGBB_API_KEY = "1b89022d172c644078ba8ecd91ad335b";

  // If editing, load existing data (images URLs are saved)
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDescription(editData.description || "");
      setIssuer(editData.issuer || "");
      setDate(editData.date || "");
      setImageFiles([]); // reset file inputs
      setPreviewUrls(editData.imageUrls || editData.imageUrl ? (Array.isArray(editData.imageUrls) ? editData.imageUrls : [editData.imageUrl]) : []);
      setSliderIndex(0);
    }
  }, [editData]);

  // Generate previews for newly selected images
  useEffect(() => {
    if (imageFiles.length === 0) {
      if (editData?.imageUrls) {
        setPreviewUrls(editData.imageUrls);
      }
      return;
    }
    const objectUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    // Cleanup URLs on unmount or new selection
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles, editData]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIssuer("");
    setDate("");
    setImageFiles([]);
    setPreviewUrls([]);
    setSliderIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !issuer || !date) {
      toast.error("Please fill all fields");
      return;
    }
    if (previewUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setLoading(true);
    toast.loading(editData ? "Updating certificate..." : "Uploading certificate...", {
      id: "upload",
    });

    try {
      let uploadedImageUrls = editData?.imageUrls || [];

      // Upload new files only if any selected
      if (imageFiles.length > 0) {
        uploadedImageUrls = [];
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await res.json();
          uploadedImageUrls.push(data.data.url);
        }
      }

      if (editData?.id) {
        const certRef = doc(db, "certificates", editData.id);
        await updateDoc(certRef, {
          title,
          description,
          issuer,
          date,
          imageUrls: uploadedImageUrls,
          updatedAt: new Date(),
        });
        toast.success("Certificate updated!", { id: "upload" });
      } else {
        await addDoc(collection(db, "certificates"), {
          title,
          description,
          issuer,
          date,
          imageUrls: uploadedImageUrls,
          createdAt: new Date(),
        });
        toast.success("Certificate saved!", { id: "upload" });
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed", { id: "upload" });
    } finally {
      setLoading(false);
    }
  };

  // Slider controls
  const nextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % previewUrls.length);
  };
  const prevSlide = () => {
    setSliderIndex((prev) => (prev - 1 + previewUrls.length) % previewUrls.length);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-gray-100 p-4 rounded-xl shadow-md mb-6
        max-w-lg mx-auto
        md:max-w-none md:rounded-none
        md:p-8
        md:mb-0
        md:h-screen md:w-full
        md:flex md:flex-col
        md:justify-center
        md:overflow-auto
      "
      style={{ minHeight: "100vh" }}
    >
      <input
        type="text"
        placeholder="Certificate Title"
        className="w-full mb-4 p-2 rounded border text-base"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="w-full mb-4 p-2 rounded border text-base resize-none"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Issuer"
        className="w-full mb-4 p-2 rounded border text-base"
        value={issuer}
        onChange={(e) => setIssuer(e.target.value)}
        required
      />
      <input
        type="date"
        className="w-full mb-4 p-2 rounded border text-base"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Multiple Image Upload */}
      <label
        htmlFor="imageUpload"
        className="cursor-pointer w-full mb-6 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-600 transition-colors duration-300"
      >
        {previewUrls.length > 0 ? (
          <div className="relative w-full max-h-64 flex items-center justify-center">
            <img
              src={previewUrls[sliderIndex]}
              alt={`Certificate Preview ${sliderIndex + 1}`}
              className="max-h-64 w-auto rounded-md object-contain"
            />
            {previewUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    prevSlide();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    nextSlide();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80"
                >
                  ›
                </button>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-xs rounded px-2 py-0.5">
                  {sliderIndex + 1} / {previewUrls.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <span className="text-sm">Click to upload images</span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG, JPEG (max 5MB each)
            </span>
          </div>
        )}
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImageFiles(files);
          }}
          required={!editData}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mt-auto">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-base disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? editData
              ? "Updating..."
              : "Uploading..."
            : editData
            ? "Update Certificate"
            : "Add Certificate"}
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 text-base"
          onClick={() => {
            resetForm();
            onCancel();
          }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;

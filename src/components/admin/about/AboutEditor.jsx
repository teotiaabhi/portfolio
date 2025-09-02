import React, { useEffect, useState } from "react";
import { UploadCloud, X, Loader } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast, { Toaster } from "react-hot-toast";

const imgbbAPI = "da470f97c1d6b55ed64589396203c5dd";

const ImageCard = ({
  label,
  image,
  type,
  onImageChange,
  onRemoveImage,
  onSaveImage,
  loadingType,
}) => {
  const isSaving = loadingType === `image-${type}`;
  const isRemoving = loadingType === `remove-${type}`;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    toast.promise(
      fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPI}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            onImageChange(type, data.data.url);
          } else {
            throw new Error("Upload failed");
          }
        }),
      {
        loading: "Uploading image...",
        success: "Image uploaded!",
        error: "Upload failed",
      }
    );
  };

  return (
    <div className="border rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-3">{label}</h3>

      <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition text-center">
        <UploadCloud className="w-6 h-6 text-blue-500 mb-1" />
        <span className="text-sm text-gray-700">Upload</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {image && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 border rounded p-3">
          <img src={image} alt="preview" className="h-20 w-20 object-cover rounded" />
          <button
            onClick={() => onRemoveImage(type)}
            className="text-red-500 hover:text-red-700"
            disabled={isRemoving}
          >
            {isRemoving ? <Loader className="animate-spin w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      )}

      <button
        onClick={() => onSaveImage(type)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm flex justify-center items-center gap-2"
        disabled={isSaving}
      >
        {isSaving && <Loader className="animate-spin w-4 h-4" />}
        Save Image
      </button>
    </div>
  );
};

const AboutEditor = () => {
  const [aboutText, setAboutText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [aboutImage, setAboutImage] = useState(null);
  const [homeImage, setHomeImage] = useState(null);
  const [loadingType, setLoadingType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "aboutSection", "content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutText(data.text || "");
        setAboutImage(data.aboutImage || null);
        setHomeImage(data.homeImage || null);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (type, url) => {
    if (type === "about") setAboutImage(url);
    else setHomeImage(url);
  };

  const handleRemoveImage = async (type) => {
    setLoadingType(`remove-${type}`);
    try {
      const docRef = doc(db, "aboutSection", "content");
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      const updatedData = {
        ...existingData,
        [type === "about" ? "aboutImage" : "homeImage"]: null,
      };
      await setDoc(docRef, updatedData);

      if (type === "about") setAboutImage(null);
      else setHomeImage(null);

      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
    setLoadingType("");
  };

  const handleSaveImage = async (type) => {
    setLoadingType(`image-${type}`);
    try {
      const docRef = doc(db, "aboutSection", "content");
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      const updatedData = {
        ...existingData,
        [type === "about" ? "aboutImage" : "homeImage"]:
          type === "about" ? aboutImage : homeImage,
      };

      await setDoc(docRef, updatedData);
      toast.success("Image saved");
    } catch {
      toast.error("Failed to save image");
    }
    setLoadingType("");
  };

  const handleSaveText = async () => {
    setLoadingType("text");
    try {
      const docRef = doc(db, "aboutSection", "content");
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      await setDoc(docRef, {
        ...existingData,
        text: aboutText,
      });

      toast.success("About text saved");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save text");
    }
    setLoadingType("");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <ImageCard
          label="About Image"
          type="about"
          image={aboutImage}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onSaveImage={handleSaveImage}
          loadingType={loadingType}
        />
        <ImageCard
          label="Home Image"
          type="home"
          image={homeImage}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onSaveImage={handleSaveImage}
          loadingType={loadingType}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Edit About Text</h2>
        <textarea
          rows={6}
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          disabled={!isEditing}
          className="w-full p-4 rounded-md border bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write about yourself..."
        />

        <div className="flex gap-4 mt-4 flex-col sm:flex-row">
          <button
            onClick={handleSaveText}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full sm:w-auto flex items-center justify-center gap-2"
            disabled={loadingType === "text"}
          >
            {loadingType === "text" && <Loader className="animate-spin w-4 h-4" />}
            Save Text
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded w-full sm:w-auto"
            disabled={loadingType === "text"}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;

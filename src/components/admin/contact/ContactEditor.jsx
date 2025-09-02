import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const defaultContact = {
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  lat: "",
  lon: "",
};

const ContactEditor = () => {
  const [contact, setContact] = useState(defaultContact);
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch from Firestore on page load
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, "contacts", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContact(data);
          if (data.lat && data.lon) {
            setCoords({ lat: data.lat, lon: data.lon });
          }
        } else {
          console.log("No contact data found.");
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        toast.error("Failed to load contact info from Firebase");
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));

    if (name === "location" && value.length > 2) {
      fetchSuggestions(value);
    } else if (name === "location") {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (query) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch location suggestions", error);
      toast.error("Failed to fetch location suggestions");
    }
    setLoadingSuggestions(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setContact((prev) => ({
      ...prev,
      location: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon,
    }));
    setCoords({ lat: suggestion.lat, lon: suggestion.lon });
    setSuggestions([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "contacts", "main"), contact);
      setSaving(false);
      setIsEditing(false);
      toast.success("Contact info saved to Firebase!");
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      toast.error("Failed to save contact info");
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => {
      const newState = !prev;
      toast(newState ? "Editing enabled" : "Editing disabled");
      return newState;
    });
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={contact.email}
            onChange={handleChange}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={!isEditing}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={contact.phone}
            onChange={handleChange}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={!isEditing}
          />
          <div className="relative md:col-span-2">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={contact.location}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={!isEditing}
            />
            {isEditing && loadingSuggestions && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isEditing && suggestions.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-1 text-sm">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer break-words"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn URL"
            value={contact.linkedin}
            onChange={handleChange}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={!isEditing}
          />
          <input
            type="text"
            name="github"
            placeholder="GitHub URL"
            value={contact.github}
            onChange={handleChange}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0 mb-6">
          <button
            onClick={toggleEdit}
            className={`px-4 py-3 rounded text-white text-center ${
              isEditing ? "bg-gray-500" : "bg-blue-600"
            }`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-3 rounded flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-3">Live Preview</h3>
        <div className="p-4 border rounded shadow space-y-2">
          <p className="break-words"><strong>Email:</strong> {contact.email || "—"}</p>
          <p className="break-words"><strong>Phone:</strong> {contact.phone || "—"}</p>
          <p className="break-words"><strong>Location:</strong> {contact.location || "—"}</p>
          <p className="break-words"><strong>LinkedIn:</strong> {contact.linkedin || "—"}</p>
          <p className="break-words"><strong>GitHub:</strong> {contact.github || "—"}</p>
        </div>

        {coords && (
          <div className="mt-8">
            <h4 className="font-medium mb-3">Location Preview</h4>
            <iframe
              title="OpenStreetMap Location"
              className="w-full h-64 rounded shadow"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon},${coords.lat},${coords.lon},${coords.lat}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
            ></iframe>
            <p className="text-sm text-center text-blue-600 mt-3">
              <a
                href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=16/${coords.lat}/${coords.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on OpenStreetMap
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactEditor;

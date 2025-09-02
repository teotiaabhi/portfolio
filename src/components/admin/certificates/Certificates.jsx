import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase";
import CertificateForm from "./CertificateForm";
import toast from "react-hot-toast";
import { Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";

// Spinner for loading
const Spinner = () => (
  <div className="flex justify-center items-center h-30">
    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  // Track current image index for each certificate by id
  const [currentSlide, setCurrentSlide] = useState({});

  // Fetch certificates from Firestore
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Navigate to previous image for a cert
  const goPrev = (certId, length) => {
    setCurrentSlide((prev) => {
      const currentIndex = prev[certId] ?? 0;
      const newIndex = (currentIndex - 1 + length) % length;
      return { ...prev, [certId]: newIndex };
    });
  };

  // Navigate to next image for a cert
  const goNext = (certId, length) => {
    setCurrentSlide((prev) => {
      const currentIndex = prev[certId] ?? 0;
      const newIndex = (currentIndex + 1) % length;
      return { ...prev, [certId]: newIndex };
    });
  };

  // Delete certificate
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this certificate?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "certificates", id));
      toast.success("Certificate deleted");
      fetchCertificates();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold">Certificates</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCert(null);
          }}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded text-sm sm:text-base hover:bg-blue-700"
        >
          + Add Certificate
        </button>
      </div>

      {(showForm || editingCert) && (
        <CertificateForm
          editData={editingCert}
          onSuccess={() => {
            fetchCertificates();
            setShowForm(false);
            setEditingCert(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCert(null);
          }}
        />
      )}

      {loading ? (
        <Spinner />
      ) : certificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => {
            // Use imageUrls array if present, else fallback to single imageUrl array
            const images =
              cert.imageUrls && cert.imageUrls.length > 0
                ? cert.imageUrls
                : cert.imageUrl
                ? [cert.imageUrl]
                : [];

            // Current slide index for this certificate (default 0)
            const slideIndex = currentSlide[cert.id] ?? 0;

            return (
              <div
                key={cert.id}
                className="bg-white shadow rounded-xl p-3 sm:p-4 border relative"
              >
                {images.length > 0 ? (
                  <div className="relative w-full h-40 overflow-hidden rounded mb-2 sm:mb-3">
                    <img
                      src={images[slideIndex]}
                      alt={`${cert.title} image ${slideIndex + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => goPrev(cert.id, images.length)}
                          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-full"
                          aria-label="Previous Image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => goNext(cert.id, images.length)}
                          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-full"
                          aria-label="Next Image"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-1 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-0.5 rounded">
                          {slideIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded mb-2 sm:mb-3 text-gray-400 text-sm">
                    No image
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-semibold">{cert.title}</h3>
                <p className="text-sm text-gray-700">{cert.description}</p>
                <p className="text-sm text-gray-500 mt-1">Issuer: {cert.issuer}</p>
                <p className="text-sm text-gray-400">Date: {cert.date}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() => setEditingCert(cert)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1 text-sm"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Certificates;

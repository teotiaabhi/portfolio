import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Loader } from "lucide-react";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const audioRef = useRef(null);
  const prevIdsRef = useRef(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);

  // Listen for first user interaction to enable audio play
  useEffect(() => {
    const onFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMsgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const currentIds = new Set(newMsgs.map((m) => m.id));
      const newMsgReceived = newMsgs.some((m) => !prevIdsRef.current.has(m.id));

      if (
        prevIdsRef.current.size > 0 &&
        newMsgReceived &&
        audioRef.current &&
        hasInteracted
      ) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked or error playing audio:", err);
        });
      }

      prevIdsRef.current = currentIds;
      setMessages(newMsgs);
      setFilteredMessages(newMsgs);
    });

    return () => unsubscribe();
  }, [hasInteracted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (showConfirm) cancelDelete();
        if (showSearch) {
          setShowSearch(false);
          setSearchTerm("");
          setFilteredMessages(messages);
        }
      } else if (e.key === "Enter" && showConfirm) {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showConfirm, showSearch, messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = messages.filter((msg) =>
        [msg.name, msg.email, msg.date || ""].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredMessages(filtered);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, messages]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, "messages", deleteId));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleSearch = (term) => setSearchTerm(term);
  const handlePrint = () => window.print();

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return timestamp || "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer />
      <audio ref={audioRef} src="/audio/notification.mp3" preload="auto" />

      <style>
        {`@media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }`}
      </style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
        <h2 className="text-xl sm:text-2xl font-bold">Contact Messages</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm border border-blue-300">
            🔍︎ Search (Ctrl + S)
          </span>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            title="Print messages"
          >
            Print
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-4 no-print">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or date"
            className="w-full px-4 py-2 border-2 border-blue-400 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
          />
        </div>
      )}

      <div id="print-section">
        <div
          className={`shadow border overflow-x-auto ${
            filteredMessages.length > 7 ? "max-h-[550px] overflow-y-auto" : ""
          }`}
        >
          <table className="min-w-full bg-white border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Name</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Email</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Message</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Date</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="p-2 sm:p-3 border border-gray-300 break-all">{msg.name}</td>
                  <td className="p-2 sm:p-3 border border-gray-300 text-blue-600 underline break-all">
                    <a
                      href={`mailto:${msg.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Send email to ${msg.email}`}
                    >
                      {msg.email}
                    </a>
                  </td>
                  <td className="p-2 sm:p-3 border border-gray-300 break-all">{msg.message}</td>
                  <td className="p-2 sm:p-3 border border-gray-300">
                    {formatDate(msg.timestamp)}
                  </td>
                  <td className="p-2 sm:p-3 border border-gray-300 no-print">
                    <button
                      onClick={() => confirmDelete(msg.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      title="Delete message"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this message?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;

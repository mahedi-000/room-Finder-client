import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatTime12h } from "../utils/timeFormat";
import ConfirmModal from "./ConfirmModal";

const StatusListModal = ({ open, onClose, room }) => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchStatuses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/roomStatuses`);
        const all = res.data?.data?.roomStatuses || [];
        const filtered = all.filter(
          (s) => (s.room?.id || s.room_id) === room.id,
        );
        // sort by day then start_time
        filtered.sort((a, b) => {
          if (a.day_of_week < b.day_of_week) return -1;
          if (a.day_of_week > b.day_of_week) return 1;
          return (a.start_time || "") < (b.start_time || "") ? -1 : 1;
        });
        setStatuses(filtered);
      } catch (error) {
        console.error("Error fetching statuses for modal:", error);
        toast.error("Failed to load statuses");
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, [open, room]);

  const handleStartDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    const id = pendingDeleteId;
    if (!id) return;
    try {
      await axios.delete(`${API_BASE}/roomStatuses/${id}`);
      setStatuses((prev) => prev.filter((s) => s.id !== id));
      toast.success("Status deleted");
      setPendingDeleteId(null);
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting status:", error);
      toast.error("Failed to delete status");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full z-10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Statuses for Room {room.room_number}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : statuses.length === 0 ? (
          <div className="p-4 text-gray-600">
            No statuses found for this room.
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-auto">
            {statuses.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 border rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="font-semibold">{s.status}</div>
                  <div className="text-sm text-gray-600">
                    {s.day_of_week || "-"} •{" "}
                    {s.start_time ? formatTime12h(s.start_time) : "-"} -{" "}
                    {s.end_time ? formatTime12h(s.end_time) : "-"}
                  </div>
                  {s.is_recurring && (
                    <div className="text-xs text-blue-600">Repeats weekly</div>
                  )}
                  {s.routine && (
                    <div className="text-xs text-gray-700">
                      Routine: {s.routine.course?.course_code || ""}{" "}
                      {s.routine.section?.section_name || ""}{" "}
                      {s.routine.teacher || ""}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDelete(s.id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          title="Delete Status"
          message="Delete this status? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default StatusListModal;

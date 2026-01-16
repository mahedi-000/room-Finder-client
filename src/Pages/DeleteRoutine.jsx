import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { formatTime12h } from "../utils/timeFormat";

const DeleteRoutine = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadRoutine = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/routines`);
        const list =
          res.data?.data?.routines || res.data?.data || res.data || [];
        const found = Array.isArray(list)
          ? list.find((r) => r.id === id)
          : null;
        setRoutine(found || null);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load routine");
      } finally {
        setLoading(false);
      }
    };

    loadRoutine();
  }, [API_BASE, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/routines/${id}`);
      toast.success("Routine deleted successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading routine...</div>;
  }

  if (!routine) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Routine not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white shadow-md border border-gray-100 rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Delete Routine</h1>
        <p className="text-gray-600">
          Are you sure you want to delete this routine?
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-semibold">Course</span>
            <span>
              {routine.course?.course_code} - {routine.course?.course_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Section</span>
            <span>{routine.section?.section_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Room</span>
            <span>{routine.room?.room_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Day</span>
            <span>{routine.day}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Time</span>
            <span>
              {formatTime12h(routine.start_time)} -{" "}
              {formatTime12h(routine.end_time)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Teacher</span>
            <span>{routine.teacher}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Class Type</span>
            <span>{routine.class_type}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoutine;

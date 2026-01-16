import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { formatTime12h } from "../utils/timeFormat";
import toast from "react-hot-toast";

const RoomDetail = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [roomsRes, routinesRes] = await Promise.all([
          axios.get(`${API_BASE}/rooms`),
          axios.get(`${API_BASE}/routines`),
        ]);

        const allRooms = roomsRes.data?.data?.rooms || [];
        const allRoutines = routinesRes.data?.data?.routines || [];

        const foundRoom = allRooms.find((r) => r.id === id);
        if (!foundRoom) {
          throw new Error("Room not found");
        }

        setRoom(foundRoom);

        const roomRoutines = allRoutines.filter((r) => r.room?.id === id);
        setRoutines(roomRoutines);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load room details");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API_BASE, id, navigate]);

  const isOccupied = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    return routines.some((r) => {
      const dayMatch = r.day?.trim().toUpperCase() === today;
      const timeMatch =
        r.start_time <= currentTime && currentTime < r.end_time;
      return dayMatch && timeMatch;
    });
  };

  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    return routines.find((r) => {
      const dayMatch = r.day?.trim().toUpperCase() === today;
      const timeMatch =
        r.start_time <= currentTime && currentTime < r.end_time;
      return dayMatch && timeMatch;
    });
  };

  if (loading) {
    return <div className="p-6">Loading room details...</div>;
  }

  if (!room) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Room not found.</p>
        <button
          onClick={() => navigate("/rooms")}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  const current = getCurrentClass();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Room: {room.room_number}
            </h1>
            <p className="text-gray-500 mt-1">{room.room_type}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              isOccupied()
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isOccupied() ? "Occupied" : "Available"}
          </span>
        </div>

        {current ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
            <h2 className="font-bold text-blue-900 text-lg">Current Class</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Teacher:</span>
                <span className="font-semibold text-gray-800">
                  {current.teacher}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="font-semibold text-gray-800">
                  {current.course?.course_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section:</span>
                <span className="font-semibold text-gray-800">
                  {current.section?.section_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-gray-800">
                  {formatTime12h(current.start_time)} -{" "}
                  {formatTime12h(current.end_time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class Type:</span>
                <span className="font-semibold text-gray-800">
                  {current.class_type}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600">No classes currently in session</p>
          </div>
        )}

        {routines.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Routines ({routines.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800">
                        {routine.day}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime12h(routine.start_time)} -{" "}
                        {formatTime12h(routine.end_time)}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold text-gray-800">
                        {routine.teacher}
                      </div>
                      <div className="text-gray-600">
                        {routine.course?.course_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {routine.course?.course_name} - {routine.section?.section_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/rooms")}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
        >
          Back to Rooms
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;

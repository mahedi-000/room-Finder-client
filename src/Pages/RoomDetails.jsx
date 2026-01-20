import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { formatTime12h } from "../utils/timeFormat";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room } = location.state || {};
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [roomStatuses, setRoomStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!room) {
      navigate("/rooms");
      return;
    }

    const loadRoomStatuses = async () => {
      setLoading(true);
      try {
        const statusesRes = await axios.get(`${API_BASE}/roomStatuses`);
        const statusesData = Array.isArray(statusesRes.data?.data?.roomStatuses)
          ? statusesRes.data.data.roomStatuses
          : [];
        setRoomStatuses(statusesData);
      } catch (error) {
        console.error("Error loading room statuses:", error);
        toast.error("Failed to load room statuses");
      } finally {
        setLoading(false);
      }
    };

    loadRoomStatuses();
  }, [room, API_BASE, navigate]);

  const getDayOfWeek = (date) => {
    return date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
  };

  const getDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  const buildDayTimeline = () => {
    const dayOfWeek = getDayOfWeek(selectedDate);
    const dateString = getDateString(selectedDate);

    // Filter statuses for this room and day
    const relevantStatuses = roomStatuses.filter((s) => {
      const roomMatch = s.room?.id === room.id || s.room_id === room.id;
      
      if (!roomMatch) return false;

      if (s.is_recurring) {
        return s.day_of_week === dayOfWeek;
      } else {
        const statusDateOnly = s.status_date?.split("T")[0];
        return statusDateOnly === dateString;
      }
    });

    // Sort by start_time
    const sortedStatuses = relevantStatuses.sort((a, b) => {
      const timeA = a.start_time || a.routine?.start_time || "00:00";
      const timeB = b.start_time || b.routine?.start_time || "00:00";
      return timeA.localeCompare(timeB);
    });

    // Build timeline - only show actual statuses, no gaps
    const timeline = [];
    const breakStart = "13:10";
    const breakEnd = "13:50";

    if (sortedStatuses.length === 0) {
      // No statuses at all for this day
      return [];
    }

    // Add break time if any status exists (always show break during business hours)
    let breakAdded = false;

    sortedStatuses.forEach((status) => {
      const statusStartTime = status.start_time || status.routine?.start_time;
      const statusEndTime = status.end_time || status.routine?.end_time;

      if (!statusStartTime || !statusEndTime) return;

      // Add break time before this status if it hasn't been added and this status is after break
      if (!breakAdded && statusStartTime >= breakStart) {
        timeline.push({
          type: "break",
          startTime: breakStart,
          endTime: breakEnd,
        });
        breakAdded = true;
      }

      // Add the actual status
      timeline.push({
        type: "status",
        startTime: statusStartTime,
        endTime: statusEndTime,
        status: status.status,
        routine: status.routine,
        teacher: status.teacher,
        course: status.course,
        section: status.section,
        isRecurring: status.is_recurring,
      });
    });

    return timeline;
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (loading) {
    return <div className="p-6">Loading room details...</div>;
  }

  if (!room) {
    return <div className="p-6">Room not found</div>;
  }

  const timeline = buildDayTimeline();

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/rooms")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Rooms
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Room {room.room_number}
        </h1>
        <p className="text-gray-600">{room.room_type}</p>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Daily Schedule
        </h2>
        {timeline.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No status records found for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeline.map((slot, index) => {
              if (slot.type === "break") {
                return (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-600 font-semibold">
                          {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
                          Break Time
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Actual status
              const bgColor =
                slot.status === "FREE"
                  ? "bg-green-50 border-green-200"
                  : slot.status === "OCCUPIED"
                  ? "bg-orange-50 border-orange-200"
                  : slot.status === "MAINTENANCE"
                  ? "bg-red-50 border-red-200"
                  : slot.status === "RESCHEDULED"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200";

              const badgeColor =
                slot.status === "FREE"
                  ? "bg-green-200 text-green-800"
                  : slot.status === "OCCUPIED"
                  ? "bg-orange-200 text-orange-800"
                  : slot.status === "MAINTENANCE"
                  ? "bg-red-200 text-red-800"
                  : slot.status === "RESCHEDULED"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-700";

              const badgeText =
                slot.status === "FREE"
                  ? "Free"
                  : slot.status === "OCCUPIED"
                  ? "Occupied"
                  : slot.status === "MAINTENANCE"
                  ? "Maintenance"
                  : slot.status === "RESCHEDULED"
                  ? "Rescheduled"
                  : slot.status;

              return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${bgColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-gray-800">
                      {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
                      {badgeText}
                    </span>
                    {slot.isRecurring && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                        Recurring
                      </span>
                    )}
                  </div>
                </div>

                {slot.routine && (
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Teacher:</span>
                      <span className="text-gray-800 font-semibold">
                        {slot.routine.teacher}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Subject:</span>
                      <span className="text-gray-800 font-semibold">
                        {slot.routine.course?.course_name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Section:</span>
                      <span className="text-gray-800 font-semibold">
                        {slot.routine.section?.section_name}
                      </span>
                    </div>
                  </div>
                )}

                {!slot.routine && (slot.teacher || slot.course || slot.section) && (
                  <div className="space-y-2 text-sm">
                    {slot.teacher && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-medium">Teacher:</span>
                        <span className="text-gray-800 font-semibold">
                          {slot.teacher}
                        </span>
                      </div>
                    )}
                    {slot.course && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-medium">Subject:</span>
                        <span className="text-gray-800 font-semibold">
                          {slot.course.course_name}
                        </span>
                      </div>
                    )}
                    {slot.section && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-medium">Section:</span>
                        <span className="text-gray-800 font-semibold">
                          {slot.section.section_name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
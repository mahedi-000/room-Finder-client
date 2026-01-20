import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { formatTime12h } from "../utils/timeFormat";
import axios from "axios";
import toast from "react-hot-toast";
import useRole from "../hooks/useRole";

const RoomCard = ({ room, routines, roomStatuses }) => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [currentClass, setCurrentClass] = useState(null);
  const [currentUserRole] = useRole();
  const canUpdateStatus = currentUserRole && currentUserRole !== "STUDENT";

  useEffect(() => {
    console.log("🔍 RoomCard Debug:");
    console.log("Room:", room);
    console.log("RoomStatuses:", roomStatuses);

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const todayDate = now.toISOString().split("T")[0];
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    console.log("Current time:", currentTime);
    console.log("Today date:", todayDate);
    console.log("Today day:", today);

    const businessStart = "10:40";
    const businessEnd = "18:20";
    const isBusinessHours =
      currentTime >= businessStart && currentTime < businessEnd;

    console.log("Is business hours:", isBusinessHours);

    if (isBusinessHours) {
      
      const matchingStatuses = roomStatuses?.filter((s) => {
        const statusDateOnly = s.status_date?.split("T")[0];
        const roomMatch = s.room?.id === room.id || s.room_id === room.id;

        const exactDateMatch = roomMatch && statusDateOnly === todayDate;

        const recurringMatch =
          s.is_recurring && roomMatch && s.day_of_week === today;

       
        if (roomMatch) {
          console.log(`Status for this room:`, {
            status: s.status,
            start_time: s.start_time,
            end_time: s.end_time,
            status_date: s.status_date,
            statusDateOnly,
            todayDate,
            is_recurring: s.is_recurring,
            day_of_week: s.day_of_week,
            today,
            exactDateMatch,
            recurringMatch,
            hasRoutine: !!s.routine
          });
        }

        return exactDateMatch || recurringMatch;
      }) || [];

      console.log("All matching statuses:", matchingStatuses);

      
      let foundActiveStatus = null;
      for (const s of matchingStatuses) {
        console.log(`Processing status:`, s.status, `start:`, s.start_time, `end:`, s.end_time);
        
        
        if (s.start_time && s.end_time) {
          let timeActive;
         
          if (s.end_time < s.start_time) {
            timeActive = currentTime >= s.start_time || currentTime < s.end_time;
          } else {
            timeActive = currentTime >= s.start_time && currentTime < s.end_time;
          }
          console.log(
            `Checking ${s.status} time slot: ${s.start_time} to ${s.end_time}, current: ${currentTime}, active: ${timeActive}`
          );
          if (timeActive) {
            foundActiveStatus = s;
            break;
          }
          continue;
        }
       
        console.log(`Status ${s.status} has no valid time range, skipping`);
      }

      
      const dbStatus = foundActiveStatus;

      console.log("Selected DB Status:", dbStatus);

      if (dbStatus) {
        setCurrentClass(dbStatus);
      } else {
        
        setCurrentClass({ status: "NO_RECORD", isNoRecord: true });
      }
      return;
    }

    console.log("Outside business hours - setting currentClass to null");
    setCurrentClass(null);
  }, [room.id, routines, roomStatuses]);

  const badgeClass =
    currentClass?.status === "NO_RECORD"
      ? "bg-gray-100 text-gray-700"
      : !currentClass || currentClass.status === "FREE"
      ? "bg-green-100 text-green-700"
      : currentClass.status === "OCCUPIED"
      ? "bg-orange-100 text-orange-700"
      : currentClass.status === "MAINTENANCE"
      ? "bg-red-100 text-red-700"
      : currentClass.status === "RESCHEDULED"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  const badgeText =
    currentClass?.status === "NO_RECORD"
      ? "No DB status"
      : !currentClass || currentClass.status === "FREE"
      ? "Available"
      : currentClass.status === "OCCUPIED"
      ? "Occupied"
      : currentClass.status === "MAINTENANCE"
      ? "Maintenance"
      : currentClass.status === "RESCHEDULED"
      ? "Rescheduled"
      : currentClass.status;

  const detailsBlock = (() => {
    if (!currentClass || currentClass.status === "FREE") {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">
            No classes currently scheduled
          </p>
        </div>
      );
    }

    if (currentClass.status === "NO_RECORD") {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-700 font-medium">
            No room status found in the database for today.
          </p>
          <p className="text-gray-500 text-sm">
            If this room should be marked occupied or maintained during business
            hours, add a room status record.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="font-semibold text-gray-900 mb-2">
          {currentClass.status === "OCCUPIED"
            ? "Currently Occupied"
            : currentClass.status === "RESCHEDULED"
            ? "Class Rescheduled"
            : currentClass.status === "MAINTENANCE"
            ? "Under Maintenance"
            : currentClass.status}
        </div>
        {currentClass.routine ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Teacher:</span>
              <span className="text-gray-800 font-semibold">
                {currentClass.routine.teacher}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Subject:</span>
              <span className="text-gray-800 font-semibold">
                {currentClass.routine.course?.course_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Section:</span>
              <span className="text-gray-800 font-semibold">
                {currentClass.routine.section?.section_name}
              </span>
            </div>
            
            {/* For RESCHEDULED: Show both original and new time */}
            {currentClass.status === "RESCHEDULED" && currentClass.start_time && currentClass.end_time ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium line-through">
                    Original: {formatTime12h(currentClass.routine.start_time)} - {formatTime12h(currentClass.routine.end_time)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">
                    New: {formatTime12h(currentClass.start_time)} - {formatTime12h(currentClass.end_time)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  {formatTime12h(currentClass.start_time || currentClass.routine.start_time)} -{" "}
                  {formatTime12h(currentClass.end_time || currentClass.routine.end_time)}
                </span>
              </div>
            )}
          </>
        ) : currentClass.teacher || currentClass.course || currentClass.section ? (
       
          <>
            {currentClass.teacher && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Teacher:</span>
                <span className="text-gray-800 font-semibold">
                  {currentClass.teacher}
                </span>
              </div>
            )}
            {currentClass.course && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Subject:</span>
                <span className="text-gray-800 font-semibold">
                  {currentClass.course.course_name}
                </span>
              </div>
            )}
            {currentClass.section && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Section:</span>
                <span className="text-gray-800 font-semibold">
                  {currentClass.section.section_name}
                </span>
              </div>
            )}
            {currentClass.start_time && currentClass.end_time && (
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  {formatTime12h(currentClass.start_time)} -{" "}
                  {formatTime12h(currentClass.end_time)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-600 font-medium">
            Status: <span className="font-bold">{currentClass.status}</span>
            {currentClass.start_time && currentClass.end_time && (
              <div className="flex items-center gap-2 mt-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  {formatTime12h(currentClass.start_time)} -{" "}
                  {formatTime12h(currentClass.end_time)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  })();

  return (
    <div 
      onClick={() => navigate("/room-details", { state: { room } })}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Room: {room.room_number}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>

      <p className="text-gray-600 text-sm">{room.room_type}</p>

      {/* Update Button - Available for ADMIN, ASSISTANT_ADMIN, TEACHER */}
      {canUpdateStatus && (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/update-room-status", {
                state: {
                  roomStatus: currentClass,
                  room: room,
                  routine: currentClass?.routine,
                },
              });
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Update Status
          </button>
          {currentClass && currentClass.isManualStatus && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    "Are you sure you want to delete this room status?"
                  )
                ) {
                  try {
                    await axios.delete(
                      `${API_BASE}/roomStatuses/${currentClass.id}`
                    );
                    toast.success("Room status deleted successfully!");
                    window.location.reload();
                  } catch (error) {
                    console.error("Error deleting room status:", error);
                    toast.error("Failed to delete room status");
                  }
                }
              }}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Delete Status
            </button>
          )}
        </div>
      )}

      {detailsBlock}
    </div>
  );
};

export default RoomCard;
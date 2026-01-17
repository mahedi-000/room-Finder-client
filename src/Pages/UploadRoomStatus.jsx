import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { to12Hour } from "../utils/timeFormat";
const UploadRoomStatus = () => {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingRoomStatuses, setExistingRoomStatuses] = useState([]);

  const [formData, setFormData] = useState({
    room_id: "",
    day: "",
    routine_id: "",
    status: "FREE",
    start_time: "",
    end_time: "",
    recurring: false,
  });

  const timeSlots = [
    { day: "SATURDAY", start_time: "10:40", end_time: "11:30" },
    { day: "SATURDAY", start_time: "11:31", end_time: "12:20" },
    { day: "SATURDAY", start_time: "12:21", end_time: "1:10" },
    { day: "SATURDAY", start_time: "1:51", end_time: "2:40" },
    { day: "SATURDAY", start_time: "2:41", end_time: "3:30" },
    { day: "SATURDAY", start_time: "3:31", end_time: "4:20" },
    { day: "SUNDAY", start_time: "10:40", end_time: "11:30" },
    { day: "SUNDAY", start_time: "11:31", end_time: "12:20" },
    { day: "SUNDAY", start_time: "12:21", end_time: "1:10" },
    { day: "SUNDAY", start_time: "1:51", end_time: "2:40" },
    { day: "SUNDAY", start_time: "2:41", end_time: "3:30" },
    { day: "SUNDAY", start_time: "3:31", end_time: "4:20" },
    { day: "MONDAY", start_time: "10:40", end_time: "11:30" },
    { day: "MONDAY", start_time: "11:31", end_time: "12:20" },
    { day: "MONDAY", start_time: "12:21", end_time: "1:10" },
    { day: "MONDAY", start_time: "1:51", end_time: "2:40" },
    { day: "MONDAY", start_time: "2:41", end_time: "3:30" },
    { day: "MONDAY", start_time: "3:31", end_time: "4:20" },
    { day: "TUESDAY", start_time: "10:40", end_time: "11:30" },
    { day: "TUESDAY", start_time: "11:31", end_time: "12:20" },
    { day: "TUESDAY", start_time: "12:21", end_time: "1:10" },
    { day: "TUESDAY", start_time: "1:51", end_time: "2:40" },
    { day: "TUESDAY", start_time: "2:41", end_time: "3:30" },
    { day: "TUESDAY", start_time: "3:31", end_time: "4:20" },
    { day: "WEDNESDAY", start_time: "10:40", end_time: "11:30" },
    { day: "WEDNESDAY", start_time: "11:31", end_time: "12:20" },
    { day: "WEDNESDAY", start_time: "12:21", end_time: "1:10" },
    { day: "WEDNESDAY", start_time: "1:51", end_time: "2:40" },
    { day: "WEDNESDAY", start_time: "2:41", end_time: "3:30" },
    { day: "WEDNESDAY", start_time: "3:31", end_time: "4:20" },
    { day: "THURSDAY", start_time: "10:40", end_time: "11:30" },
    { day: "THURSDAY", start_time: "11:31", end_time: "12:20" },
    { day: "THURSDAY", start_time: "12:21", end_time: "1:10" },
    { day: "THURSDAY", start_time: "1:51", end_time: "2:40" },
    { day: "THURSDAY", start_time: "2:41", end_time: "3:30" },
    { day: "THURSDAY", start_time: "3:31", end_time: "4:40" },
    { day: "FRIDAY", start_time: "07:00", end_time: "07:50" },
    { day: "FRIDAY", start_time: "07:51", end_time: "08:40" },
    { day: "FRIDAY", start_time: "08:41", end_time: "09:30" },
    { day: "FRIDAY", start_time: "09:31", end_time: "10:20" },
    { day: "FRIDAY", start_time: "10:21", end_time: "11:10" },
    { day: "FRIDAY", start_time: "11:11", end_time: "11:59" },
  ];

  const convertTo24Hour = (time12h) => {
    const [hours, minutes] = time12h.split(":");
    const h = parseInt(hours);
    if (h >= 1 && h <= 9) {
      return `${String(h + 12).padStart(2, "0")}:${minutes}`;
    }
    return time12h;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [roomsRes, routinesRes, statusesRes] = await Promise.all([
          axios.get(`${API_BASE}/rooms`),
          axios.get(`${API_BASE}/routines`),
          axios.get(`${API_BASE}/roomStatuses`),
        ]);

        setRooms(roomsRes.data?.data?.rooms || []);
        setRoutines(routinesRes.data?.data?.routines || []);
        setExistingRoomStatuses(statusesRes.data?.data?.roomStatuses || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API_BASE]);

  const getCurrentClass = (roomId) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    return routines.find((r) => {
      const dayMatch = r.day?.trim().toUpperCase() === today;
      const timeMatch = r.start_time <= currentTime && currentTime < r.end_time;
      return r.room?.id === roomId && dayMatch && timeMatch;
    });
  };

  const getRoomSchedule = (roomId) => {
    const now = new Date();
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    return routines
      .filter(
        (r) => r.room?.id === roomId && r.day?.trim().toUpperCase() === today
      )
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const getSelectedRoom = () => {
    return rooms.find((r) => r.id === formData.room_id);
  };

  const getRoutineForTimeSlot = (roomId, day, startTime, endTime) => {
    const start24h = convertTo24Hour(startTime);
    const end24h = convertTo24Hour(endTime);
    return routines.find(
      (r) =>
        r.room?.id === roomId &&
        r.day?.trim().toUpperCase() === day &&
        r.start_time === start24h &&
        r.end_time === end24h
    );
  };

  const getExistingRoomStatus = (roomId, startTime, endTime) => {
    const today = new Date().toISOString().split("T")[0];
    return existingRoomStatuses.find(
      (status) =>
        status.room_id === roomId &&
        status.start_time === startTime &&
        status.end_time === endTime &&
        status.status_date === today
    );
  };

  const getTodayTimeSlots = () => {
    if (!formData.day) return [];
    return timeSlots.filter((slot) => slot.day === formData.day);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);

    if (name === "routine_id") {
      const [day, startTime, endTime] = value.split("|");
      const matchedRoutine = getRoutineForTimeSlot(
        formData.room_id,
        day,
        startTime,
        endTime
      );
      const existingStatus = getExistingRoomStatus(
        formData.room_id,
        startTime,
        endTime
      );

      setFormData((prev) => ({
        ...prev,
        routine_id: matchedRoutine ? matchedRoutine.id : "",
        start_time: startTime,
        end_time: endTime,
        status: existingStatus
          ? existingStatus.status
          : matchedRoutine
          ? "OCCUPIED"
          : "FREE",
      }));
    } else if (name === "room_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        day: "",
        routine_id: "",
        start_time: "",
        end_time: "",
        status: "FREE",
      }));
    } else if (name === "day") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        routine_id: "",
        start_time: "",
        end_time: "",
        status: "FREE",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room_id) {
      toast.error("Please select a room");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      toast.error("Please select a time slot");
      return;
    }

    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    const payload = {
      room_id: formData.room_id,
      status: formData.status,
      status_date: new Date().toISOString().split("T")[0],
      updated_by: user.uid,
      day_of_week: formData.day,
      is_recurring: formData.recurring,
      start_time: convertTo24Hour(formData.start_time),
      end_time: convertTo24Hour(formData.end_time),
    };

    // Only include routine_id if it exists (Zod doesn't accept null, only undefined)
    if (formData.routine_id) {
      payload.routine_id = formData.routine_id;
    }

    console.log("Submitting payload:", payload);

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/roomStatuses`, payload);
      toast.success("Room status created successfully");
      setFormData({
        room_id: "",
        day: "",
        routine_id: "",
        status: "FREE",
        start_time: "",
        end_time: "",
        recurring: false,
      });
      navigate("/rooms");
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error message:", error.response?.data?.message);
      console.error(
        "Error details:",
        JSON.stringify(error.response?.data, null, 2)
      );
      toast.error(
        error.response?.data?.message || "Failed to create room status"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Create Room Status Card
        </h1>
        <p className="text-gray-500">Add a new room availability status</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-6 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room <span className="text-red-500">*</span>
          </label>
          <select
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Select Room</option>
            {rooms.length ? (
              rooms.map((room) => {
                return (
                  <option key={room.id} value={room.id}>
                    {room.room_number} - {room.room_type}
                  </option>
                );
              })
            ) : (
              <option disabled>No rooms available</option>
            )}
          </select>
        </div>

        {formData.room_id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day <span className="text-red-500">*</span>
            </label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Day</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
            </select>
          </div>
        )}

        {formData.room_id && formData.day && getSelectedRoom() && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot <span className="text-red-500">*</span>
            </label>
            <select
              name="routine_id"
              value={
                formData.start_time && formData.end_time
                  ? `${formData.day}|${formData.start_time}|${formData.end_time}`
                  : ""
              }
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Time Slot</option>
              {getTodayTimeSlots().map((slot, idx) => (
                <option
                  key={idx}
                  value={`${slot.day}|${slot.start_time}|${slot.end_time}`}
                >
                  {slot.start_time} - {slot.end_time}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.room_id && formData.start_time && formData.end_time && (
          <div className={`border rounded p-3 ${
            (formData.status === "OCCUPIED" || formData.status === "RESCHEDULED")
              ? 'bg-blue-50 border-blue-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`font-semibold mb-2 ${
              (formData.status === "OCCUPIED" || formData.status === "RESCHEDULED")
                ? 'text-blue-900'
                : 'text-green-900'
            }`}>
              {(formData.status === "OCCUPIED" || formData.status === "RESCHEDULED")
                ? `📋 Class Being Marked as ${formData.status}:`
                : `🕐 Time Slot for ${formData.status}:`
              }
            </div>
            {(() => {
              const matchedRoutine = getRoutineForTimeSlot(
                formData.room_id,
                formData.day,
                formData.start_time,
                formData.end_time
              );

              // For OCCUPIED/RESCHEDULED, show class details
              if (formData.status === "OCCUPIED" || formData.status === "RESCHEDULED") {
                return matchedRoutine ? (
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">Time:</span>{" "}
                      <span className="font-medium">
                        {to12Hour(matchedRoutine.start_time)} -{" "}
                        {to12Hour(matchedRoutine.end_time)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Day:</span>{" "}
                      <span className="font-medium">{matchedRoutine.day}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Course:</span>{" "}
                      <span className="font-medium">
                        {matchedRoutine.course?.course_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Teacher:</span>{" "}
                      <span className="font-medium">
                        {matchedRoutine.teacher}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Section:</span>{" "}
                      <span className="font-medium">
                        {matchedRoutine.section?.section_name}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 italic">
                      This class info will be displayed on the room card.
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-red-700">
                    ⚠️ No class scheduled for this time slot. Select OCCUPIED/RESCHEDULED only for slots with scheduled classes.
                  </div>
                );
              }
              
              // For FREE/MAINTENANCE, just show the time slot
              return (
                <div className="text-sm space-y-1 text-green-800">
                  <div>
                    <span className="text-gray-600">Time:</span>{" "}
                    <span className="font-medium">
                      {formData.start_time} - {formData.end_time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Day:</span>{" "}
                    <span className="font-medium">{formData.day}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2 italic">
                    This applies to the room during this time slot, not tied to any class.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {formData.room_id && getSelectedRoom() && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="font-bold text-gray-900 mb-2">Room Details</div>
            {(() => {
              const room = getSelectedRoom();
              const schedule = getRoomSchedule(formData.room_id);
              const currentClass = getCurrentClass(formData.room_id);

              return (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Room Number:</span>
                      <div className="font-semibold">{room.room_number}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Room Type:</span>
                      <div className="font-semibold">{room.room_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacity:</span>
                      <div className="font-semibold">
                        {room.capacity || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Building:</span>
                      <div className="font-semibold">
                        {room.building || "N/A"}
                      </div>
                    </div>
                  </div>

                  {currentClass && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                      <div className="font-semibold text-blue-900 mb-2">
                        Currently Occupied
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">Teacher:</span>{" "}
                          <span className="font-medium">
                            {currentClass.teacher}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Subject:</span>{" "}
                          <span className="font-medium">
                            {currentClass.course?.course_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Section:</span>{" "}
                          <span className="font-medium">
                            {currentClass.section?.section_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>{" "}
                          <span className="font-medium">
                            {to12Hour(currentClass.start_time)} -{" "}
                            {to12Hour(currentClass.end_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {schedule.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold text-gray-900 mb-2">
                        Today's Schedule
                      </div>
                      <div className="space-y-2">
                        {schedule.map((routine, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded p-2 text-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">
                                  {routine.course?.course_name}
                                </div>
                                <div className="text-gray-600 text-xs">
                                  {routine.teacher} •{" "}
                                  {routine.section?.section_name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-orange-600">
                                  {to12Hour(routine.start_time)} -{" "}
                                  {to12Hour(routine.end_time)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {schedule.length === 0 && !currentClass && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-3 text-center">
                      <div className="text-green-700 font-medium">
                        No classes scheduled for today
                      </div>
                      <div className="text-green-600 text-sm">
                        Room is available all day
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="FREE">Free</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
          
          {/* Status explanation */}
          <div className={`mt-3 border rounded-lg p-3 text-sm ${
            formData.status === "OCCUPIED" || formData.status === "RESCHEDULED" 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            {formData.status === "OCCUPIED" && (
              <div className="text-blue-800">
                <p className="font-semibold">📚 Class-Specific Status</p>
                <p>Marks a scheduled class as currently taking place. The class details (course, teacher, section) will be shown on the room card.</p>
              </div>
            )}
            {formData.status === "RESCHEDULED" && (
              <div className="text-blue-800">
                <p className="font-semibold">📚 Class-Specific Status</p>
                <p>Marks a scheduled class as rescheduled to a different time/room. The original class info will be shown.</p>
              </div>
            )}
            {formData.status === "FREE" && (
              <div className="text-green-800">
                <p className="font-semibold">🏠 Room-Only Status</p>
                <p>Marks the room as available during this time slot. No class information needed.</p>
              </div>
            )}
            {formData.status === "MAINTENANCE" && (
              <div className="text-green-800">
                <p className="font-semibold">🏠 Room-Only Status</p>
                <p>Marks the room as under maintenance. The room will be unavailable during this time.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            id="recurring"
            name="recurring"
            checked={formData.recurring}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recurring: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="recurring"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Repeat Weekly (same day every week)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {submitting ? "Creating..." : "Create Room Status"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadRoomStatus;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { to12Hour } from "../utils/timeFormat";

const UpdateRoomStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  const { roomStatus, room, routine } = location.state || {};

  const [formData, setFormData] = useState({
    status: roomStatus?.status || "",
    room_id: room?.id || "",
    day: routine?.day || roomStatus?.day_of_week || "",
    routine_id: routine?.id || roomStatus?.routine_id || "",
    start_time: routine?.start_time || roomStatus?.start_time || "",
    end_time: routine?.end_time || roomStatus?.end_time || "",
    is_recurring: roomStatus?.is_recurring || false,
  });

  const [rooms, setRooms] = useState([]);
  const [routines, setRoutines] = useState([]);

  const [modifyRecurring, setModifyRecurring] = useState(false);

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
    { day: "THURSDAY", start_time: "3:31", end_time: "4:20" },
    { day: "FRIDAY", start_time: "10:40", end_time: "11:30" },
    { day: "FRIDAY", start_time: "11:31", end_time: "12:20" },
    { day: "FRIDAY", start_time: "12:21", end_time: "1:10" },
    { day: "FRIDAY", start_time: "1:51", end_time: "2:40" },
    { day: "FRIDAY", start_time: "2:41", end_time: "3:30" },
    { day: "FRIDAY", start_time: "3:31", end_time: "4:20" },
  ];

  const convertTo24Hour = (time12h) => {
    const [hours, minutes] = time12h.split(":");
    const h = parseInt(hours);
    if (h >= 1 && h <= 9) {
      return `${String(h + 12).padStart(2, "0")}:${minutes}`;
    }
    return time12h;
  };

  const loadData = async () => {
    try {
      const [roomsRes, routinesRes] = await Promise.all([
        axios.get(`${API_BASE}/rooms`),
        axios.get(`${API_BASE}/routines`),
      ]);
      setRooms(roomsRes.data?.data?.rooms || []);
      setRoutines(routinesRes.data?.data?.routines || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, [roomStatus, navigate, API_BASE]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({ ...prev, status: value }));
      return;
    }

    if (name === "room_id") {
      setFormData((prev) => ({
        ...prev,
        room_id: value,
        day: "",
        routine_id: "",
        start_time: "",
        end_time: "",
      }));
      return;
    }

    if (name === "day") {
      setFormData((prev) => ({
        ...prev,
        day: value.toUpperCase(),
        start_time: "",
        end_time: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("You must be logged in");
      return;
    }

    // Validation: All statuses need room, day, and time
    if (!formData.room_id || !formData.day) {
      toast.error("Please select room and day");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      toast.error("Please select a time slot");
      return;
    }


    try {
      const payload = {
        status: formData.status,
        status_date: new Date().toISOString().split("T")[0],
        room_id: formData.room_id,
        updated_by: user.uid,
        day_of_week: formData.day,
      };

      // All statuses now use start_time/end_time directly
      if (formData.start_time && formData.end_time) {
        payload.start_time = convertTo24Hour(formData.start_time);
        payload.end_time = convertTo24Hour(formData.end_time);
      }
      
      // For OCCUPIED/RESCHEDULED, include routine_id if selected (class info comes from routine)
      if (formData.status === "OCCUPIED" || formData.status === "RESCHEDULED") {
        if (formData.routine_id) {
          payload.routine_id = formData.routine_id;
        }
      }
      
    
      payload.is_recurring = formData.is_recurring || false;

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      if (roomStatus?.id) {
        if (roomStatus.is_recurring && !modifyRecurring) {
          // Create a one-off override for today only
          const createPayload = { ...payload, is_recurring: false };
          console.log("Creating one-off override:", JSON.stringify(createPayload, null, 2));
          await axios.post(`${API_BASE}/roomStatuses`, createPayload);
          toast.success("One-off room status created for today");
        } else {
          await axios.patch(
            `${API_BASE}/roomStatuses/${roomStatus.id}`,
            payload
          );
          toast.success("Room status updated successfully!");
        }
      } else {
        // Create new status (for all status types including FREE)
        await axios.post(`${API_BASE}/roomStatuses`, {
          ...payload,
          is_recurring: false,
        });
        toast.success("Room status created successfully!");
      }

      navigate("/rooms");
    } catch (error) {
      console.error("Error updating room status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update room status"
      );
    }
  };

  // All statuses work the same way now - just time slots, not tied to specific classes
  const needsFullDetails = true; // Always need room, day, time

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Update Room Status
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="FREE">FREE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="RESCHEDULED">RESCHEDULED</option>
            </select>
          </div>

          {/* Show different checkbox based on whether original status is recurring */}
          {roomStatus?.is_recurring && roomStatus?.id ? (
            // Editing an existing RECURRING status - ask if they want to modify the rule or create one-off
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                id="modifyRecurring"
                checked={modifyRecurring}
                onChange={(e) => setModifyRecurring(e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <div>
                <label
                  htmlFor="modifyRecurring"
                  className="text-sm font-medium text-gray-800 cursor-pointer"
                >
                  Modify the recurring rule (affects all future {formData.day || "matching days"})
                </label>
                <div className="text-xs text-gray-500">
                  {modifyRecurring 
                    ? "✅ Will update the recurring entry - applies every week."
                    : "⚠️ Will create a one-off override for today only. The recurring rule stays unchanged."
                  }
                </div>
              </div>
            </div>
          ) : (
            // New status OR editing a non-recurring status - ask if it should repeat
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_recurring: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="is_recurring"
                  className="text-sm font-medium text-gray-800 cursor-pointer"
                >
                  Repeat Weekly (same day every week)
                </label>
                <div className="text-xs text-gray-500">
                  Check to apply this status every {formData.day || "selected day"}.
                </div>
              </div>
            </div>
          )}

          {needsFullDetails && (
            <>
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="text-blue-800 text-sm space-y-2">
                  <p className="font-semibold">🏠 Room Status</p>
                  <p>
                    {formData.status === "OCCUPIED" && "Mark this room as occupied during a specific time slot."}
                    {formData.status === "RESCHEDULED" && "Mark this room's class as rescheduled during a specific time slot."}
                    {formData.status === "FREE" && "Mark this room as available during a specific time slot."}
                    {formData.status === "MAINTENANCE" && "Mark this room as under maintenance during a specific time slot."}
                  </p>
                  <p className="text-xs text-blue-600 italic">
                    This status applies to the room for the selected time slot.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room *
                </label>
                <select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number} - {room.room_type}
                    </option>
                  ))}
                </select>
              </div>

              {formData.room_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day *
                  </label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {formData.day && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot *
                  </label>
                  <select
                    name="time_slot"
                    value={
                      formData.start_time && formData.end_time
                        ? `${formData.start_time}|${formData.end_time}`
                        : ""
                    }
                    onChange={(e) => {
                      const [startTime, endTime] = e.target.value.split("|");
                      setFormData((prev) => ({
                        ...prev,
                        start_time: startTime,
                        end_time: endTime,
                        routine_id: "",
                      }));
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots
                      .filter((slot) => slot.day === formData.day)
                      .map((slot, index) => (
                        <option
                          key={index}
                          value={`${slot.start_time}|${slot.end_time}`}
                        >
                          {slot.start_time} - {slot.end_time}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Routine/Class picker for OCCUPIED/RESCHEDULED - shows ALL routines */}
              {(formData.status === "OCCUPIED" || formData.status === "RESCHEDULED") && formData.start_time && formData.end_time && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-3">
                    <strong>📚 Select the class being {formData.status === "OCCUPIED" ? "held" : "rescheduled"} in this room:</strong>
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pick from Scheduled Classes
                      {formData.status === "OCCUPIED" && (
                        <span className="text-blue-600 ml-1">(Today's classes only)</span>
                      )}
                    </label>
                    <select
                      name="routine_id"
                      value={formData.routine_id}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          routine_id: e.target.value,
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Select a class --</option>
                      {routines
                        .filter((r) => {
                          // For OCCUPIED: show only today's classes
                          if (formData.status === "OCCUPIED") {
                            const today = new Date().toLocaleString("en-US", { weekday: "long" }).toUpperCase();
                            return r.day?.toUpperCase() === today;
                          }
                          // For RESCHEDULED: show all routines
                          return true;
                        })
                        .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.course?.course_code} - {r.section?.section_name} - {r.teacher} ({r.day} {to12Hour(r.start_time)}-{to12Hour(r.end_time)})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-blue-600 mt-2 italic">
                      {formData.status === "RESCHEDULED" 
                        ? "Select the original class. The routine's time is the ORIGINAL time, the selected time slot above is the NEW time."
                        : "Class info (course, section, teacher) will be pulled from the selected routine."
                      }
                    </p>
                  </div>

                  {/* Show original vs new time for RESCHEDULED */}
                  {formData.status === "RESCHEDULED" && formData.routine_id && (
                    <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      {(() => {
                        const selectedRoutine = routines.find(r => r.id === formData.routine_id);
                        return selectedRoutine ? (
                          <div className="text-sm space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-red-600 font-semibold">❌ Original:</span>
                              <span>{selectedRoutine.day} {to12Hour(selectedRoutine.start_time)} - {to12Hour(selectedRoutine.end_time)}</span>
                              <span className="text-gray-500">({selectedRoutine.room?.room_number || "N/A"})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-semibold">✅ New:</span>
                              <span>{formData.day} {to12Hour(formData.start_time)} - {to12Hour(formData.end_time)}</span>
                              <span className="text-gray-500">({rooms.find(r => r.id === formData.room_id)?.room_number || "N/A"})</span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {formData.start_time && formData.end_time && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    ⚠️ You are about to set:
                  </h3>
                  <div className="space-y-1 text-sm text-yellow-800">
                    <p>
                      <strong>Status:</strong> {formData.status}
                    </p>
                    <p>
                      <strong>Room:</strong>{" "}
                      {rooms.find(r => r.id === formData.room_id)?.room_number || "N/A"}
                    </p>
                    <p>
                      <strong>Day:</strong> {formData.day}
                    </p>
                    <p>
                      <strong>Time:</strong> {to12Hour(formData.start_time)} - {to12Hour(formData.end_time)}
                    </p>
                    {(formData.status === "OCCUPIED" || formData.status === "RESCHEDULED") && formData.routine_id && (
                      (() => {
                        const selectedRoutine = routines.find(r => r.id === formData.routine_id);
                        return selectedRoutine ? (
                          <>
                            <p>
                              <strong>Course:</strong> {selectedRoutine.course?.course_name || "N/A"}
                            </p>
                            <p>
                              <strong>Section:</strong> {selectedRoutine.section?.section_name || "N/A"}
                            </p>
                            <p>
                              <strong>Teacher:</strong> {selectedRoutine.teacher || "N/A"}
                            </p>
                            {formData.status === "RESCHEDULED" && (
                              <div className="mt-2 pt-2 border-t border-yellow-300">
                                <p className="text-red-700">
                                  <strong>Original Time:</strong> {selectedRoutine.day} {to12Hour(selectedRoutine.start_time)} - {to12Hour(selectedRoutine.end_time)} ({selectedRoutine.room?.room_number || "N/A"})
                                </p>
                                <p className="text-green-700">
                                  <strong>Rescheduled To:</strong> {formData.day} {to12Hour(formData.start_time)} - {to12Hour(formData.end_time)} ({rooms.find(r => r.id === formData.room_id)?.room_number || "N/A"})
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()
                    )}
                  </div>
                  <p className="text-xs text-yellow-600 mt-2 italic">
                    Click "Update Status" to save this new status.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Update Status
            </button>
            <button
              type="button"
              onClick={() => navigate("/rooms")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoomStatus;
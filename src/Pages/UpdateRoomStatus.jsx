import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { to12Hour } from "../utils/timeFormat";
import useAuth from "../hooks/useAuth";

const UpdateRoomStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  const { roomStatus, room, routine } = location.state || {};

  const [formData, setFormData] = useState({
    status: roomStatus?.status || "",
    room_id: room?.id || "",
    day: routine?.day || "",
    routine_id: routine?.id || "",
    start_time: routine?.start_time || "",
    end_time: routine?.end_time || "",
  });

  const [rooms, setRooms] = useState([]);
  const [routines, setRoutines] = useState([]);

  const [modifyRecurring, setModifyRecurring] = useState(false);

  const timeSlots = [
    { day: "SATURDAY", start_time: "10:40", end_time: "11:30" },
    { day: "SATURDAY", start_time: "11:31", end_time: "12:20" },
    { day: "SATURDAY", start_time: "12:21", end_time: "1:10" },
    { day: "SATURDAY", start_time: "1:50", end_time: "2:40" },
    { day: "SATURDAY", start_time: "2:41", end_time: "3:30" },
    { day: "SATURDAY", start_time: "3:31", end_time: "4:20" },
    { day: "SUNDAY", start_time: "10:40", end_time: "11:30" },
    { day: "SUNDAY", start_time: "11:31", end_time: "12:20" },
    { day: "SUNDAY", start_time: "12:21", end_time: "1:10" },
    { day: "SUNDAY", start_time: "1:50", end_time: "2:40" },
    { day: "SUNDAY", start_time: "2:41", end_time: "3:30" },
    { day: "SUNDAY", start_time: "3:31", end_time: "4:20" },
    { day: "MONDAY", start_time: "10:40", end_time: "11:30" },
    { day: "MONDAY", start_time: "11:31", end_time: "12:20" },
    { day: "MONDAY", start_time: "12:21", end_time: "1:10" },
    { day: "MONDAY", start_time: "1:50", end_time: "2:40" },
    { day: "MONDAY", start_time: "2:41", end_time: "3:30" },
    { day: "MONDAY", start_time: "3:31", end_time: "4:20" },
    { day: "TUESDAY", start_time: "10:40", end_time: "11:30" },
    { day: "TUESDAY", start_time: "11:31", end_time: "12:20" },
    { day: "TUESDAY", start_time: "12:21", end_time: "1:10" },
    { day: "TUESDAY", start_time: "1:50", end_time: "2:40" },
    { day: "TUESDAY", start_time: "2:41", end_time: "3:30" },
    { day: "TUESDAY", start_time: "3:31", end_time: "4:20" },
    { day: "WEDNESDAY", start_time: "10:40", end_time: "11:30" },
    { day: "WEDNESDAY", start_time: "11:31", end_time: "12:20" },
    { day: "WEDNESDAY", start_time: "12:21", end_time: "1:10" },
    { day: "WEDNESDAY", start_time: "1:50", end_time: "2:40" },
    { day: "WEDNESDAY", start_time: "2:41", end_time: "3:30" },
    { day: "WEDNESDAY", start_time: "3:31", end_time: "4:20" },
    { day: "THURSDAY", start_time: "10:40", end_time: "11:30" },
    { day: "THURSDAY", start_time: "11:31", end_time: "12:20" },
    { day: "THURSDAY", start_time: "12:21", end_time: "1:10" },
    { day: "THURSDAY", start_time: "1:50", end_time: "2:40" },
    { day: "THURSDAY", start_time: "2:41", end_time: "3:30" },
    { day: "THURSDAY", start_time: "3:31", end_time: "4:20" },
    { day: "FRIDAY", start_time: "10:40", end_time: "11:30" },
    { day: "FRIDAY", start_time: "11:31", end_time: "12:20" },
    { day: "FRIDAY", start_time: "12:21", end_time: "1:10" },
    { day: "FRIDAY", start_time: "1:50", end_time: "2:40" },
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

  const getTodayTimeSlots = () => {
    if (!formData.room_id || !formData.day) return [];

    return routines
      .filter(
        (r) =>
          (r.room?.id === formData.room_id || r.room_id === formData.room_id) &&
          r.day?.trim().toUpperCase() === formData.day
      )
      .map((r) => ({
        day: r.day?.trim().toUpperCase(),
        start_time: r.start_time,
        end_time: r.end_time,
      }));
  };

  const getRoutineForTimeSlot = (roomId, day, startTime, endTime) => {
    const start24h = convertTo24Hour(startTime);
    const end24h = convertTo24Hour(endTime);
    return routines.find(
      (r) =>
        (r.room?.id === roomId || r.room_id === roomId) &&
        r.day?.trim().toUpperCase() === day &&
        r.start_time === start24h &&
        r.end_time === end24h
    );
  };

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
        routine_id: "",
        start_time: "",
        end_time: "",
      }));
      return;
    }

    if (name === "routine_id") {
      const [startTime, endTime] = value.split("|");
      const matchingRoutine = getRoutineForTimeSlot(
        formData.room_id,
        formData.day,
        startTime,
        endTime
      );

      if (matchingRoutine) {
        setFormData((prev) => ({
          ...prev,
          routine_id: matchingRoutine.id,
          start_time: startTime,
          end_time: endTime,
        }));
      }
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

    if (formData.status !== "FREE") {
      if (!formData.room_id || !formData.day || !formData.routine_id) {
        toast.error("Please fill all required fields");
        return;
      }
    }

    try {
      const payload = {
        status: formData.status,
        status_date: new Date().toISOString().split("T")[0],
        room_id: formData.room_id,
        updated_by: user.uid,
      };

      if (formData.routine_id && formData.routine_id.trim() !== "") {
        payload.routine_id = formData.routine_id;
      }

      if (roomStatus?.id) {
        if (roomStatus.recurring && !modifyRecurring) {
          await axios.post(`${API_BASE}/roomStatuses`, {
            ...payload,
            day_of_week: formData.day,
            is_recurring: false,
          });
          toast.success("One-off room status created for today");
        } else {
          await axios.patch(
            `${API_BASE}/roomStatuses/${roomStatus.id}`,
            payload
          );
          toast.success("Room status updated successfully!");
        }
      } else {
        if (formData.status !== "FREE") {
          await axios.post(`${API_BASE}/roomStatuses`, {
            ...payload,
            day_of_week: formData.day,
            is_recurring: false,
          });
          toast.success("Room status created successfully!");
        } else {
          toast.info("No need to create record for FREE status");
        }
      }

      navigate("/rooms");
    } catch (error) {
      console.error("Error updating room status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update room status"
      );
    }
  };

  const isChangingToFree = formData.status === "FREE";
  const needsFullDetails = !isChangingToFree || !roomStatus?.id;

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

          {roomStatus?.recurring && roomStatus?.id && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="modifyRecurring"
                checked={modifyRecurring}
                onChange={(e) => setModifyRecurring(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="modifyRecurring"
                  className="text-sm font-medium text-gray-800 cursor-pointer"
                >
                  Modify recurring entry (affects all future matching days)
                </label>
                <div className="text-xs text-gray-500">
                  Leave unchecked to apply this change only for the specific
                  date.
                </div>
              </div>
            </div>
          )}

          {needsFullDetails && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠ Please provide complete details for this status change
                </p>
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
                    Time Slot *
                  </label>
                  {getTodayTimeSlots().length === 0 ? (
                    <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
                      No classes scheduled for this room on {formData.day}
                    </div>
                  ) : (
                    <select
                      name="routine_id"
                      value={
                        formData.start_time && formData.end_time
                          ? `${formData.start_time}|${formData.end_time}`
                          : ""
                      }
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Time Slot</option>
                      {getTodayTimeSlots().map((slot, index) => (
                        <option
                          key={index}
                          value={`${slot.start_time}|${slot.end_time}`}
                        >
                          {to12Hour(slot.start_time)} -{" "}
                          {to12Hour(slot.end_time)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {formData.routine_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Selected Class Details:
                  </h3>
                  {(() => {
                    const selectedRoutine = routines.find(
                      (r) => r.id === formData.routine_id
                    );
                    return selectedRoutine ? (
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>
                          <strong>Course:</strong>{" "}
                          {selectedRoutine.course?.course_name}
                        </p>
                        <p>
                          <strong>Section:</strong>{" "}
                          {selectedRoutine.section?.section_name}
                        </p>
                        <p>
                          <strong>Teacher:</strong> {selectedRoutine.teacher}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {to12Hour(selectedRoutine.start_time)} -{" "}
                          {to12Hour(selectedRoutine.end_time)}
                        </p>
                      </div>
                    ) : null;
                  })()}
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

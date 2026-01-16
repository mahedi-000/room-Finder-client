import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { formatTime12h } from "../utils/timeFormat";

const UpdateRoutine = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    day: "",
    start_time: "",
    end_time: "",
    class_type: "",
    teacher: "",
    course_id: "",
    section_id: "",
    room_id: "",
  });
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sectionsRes, allRoutinesRes] = await Promise.all([
          axios.get(`${API_BASE}/sections`),
          axios.get(`${API_BASE}/routines`),
        ]);

        const sectionsData = sectionsRes.data?.data?.sections || [];
        const allRoutinesData = allRoutinesRes.data?.data?.routines || [];

        const routine = allRoutinesData.find((r) => r.id === id);

        const sortedSections = sectionsData.sort((a, b) => {
          const [aNum = "0", aChar = ""] =
            a.section_name.match(/\d+|[A-Z]+/g) || [];
          const [bNum = "0", bChar = ""] =
            b.section_name.match(/\d+|[A-Z]+/g) || [];
          return aNum !== bNum
            ? Number(aNum) - Number(bNum)
            : aChar.localeCompare(bChar);
        });

        const uniqueCourses = [];
        const courseIds = new Set();
        allRoutinesData.forEach((r) => {
          if (r.course && !courseIds.has(r.course.id)) {
            courseIds.add(r.course.id);
            uniqueCourses.push(r.course);
          }
        });

        const uniqueRooms = [];
        const roomIds = new Set();
        allRoutinesData.forEach((r) => {
          if (r.room && !roomIds.has(r.room.id)) {
            roomIds.add(r.room.id);
            uniqueRooms.push(r.room);
          }
        });

        setSections(sortedSections);
        setCourses(uniqueCourses);
        setRooms(uniqueRooms);

        if (!routine) {
          throw new Error("Routine not found");
        }

        setFormData({
          day: routine.day || "",
          start_time: routine.start_time || "",
          end_time: routine.end_time || "",
          class_type: routine.class_type || "",
          teacher: routine.teacher || "",
          course_id: routine.course?.id?.toString() || "",
          section_id: routine.section?.id?.toString() || "",
          room_id: routine.room?.id?.toString() || "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load routine");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API_BASE, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {};
    if (formData.day) payload.day = formData.day.toUpperCase();
    if (formData.start_time) payload.start_time = formData.start_time;
    if (formData.end_time) payload.end_time = formData.end_time;
    if (formData.teacher) payload.teacher = formData.teacher;
    if (formData.class_type) payload.class_type = formData.class_type;
    if (formData.course_id) payload.course_id = String(formData.course_id);
    if (formData.section_id) payload.section_id = String(formData.section_id);
    if (formData.room_id) payload.room_id = String(formData.room_id);

    try {
      await axios.patch(`${API_BASE}/routines/${id}`, payload);
      toast.success("Routine updated successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading routine...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Routine</h1>
        <p className="text-gray-500">Update the routine details and save.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-6 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <input
            type="text"
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="SATURDAY"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-xs text-gray-500">
              {formatTime12h(formData.start_time)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-xs text-gray-500">
              {formatTime12h(formData.end_time)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher
          </label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Type
          </label>
          <input
            type="text"
            name="class_type"
            value={formData.class_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Course</option>
              {courses.length ? (
                courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} - {c.course_name}
                  </option>
                ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              name="section_id"
              value={formData.section_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Section</option>
              {sections.length ? (
                sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.section_name}
                  </option>
                ))
              ) : (
                <option disabled>No sections available</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <select
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Room</option>
            {rooms.length ? (
              rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.room_number}
                </option>
              ))
            ) : (
              <option disabled>No rooms available</option>
            )}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRoutine;

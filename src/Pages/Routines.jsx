import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { formatTime12h } from "../utils/timeFormat";

const DAY_ORDER = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const normalizeDay = (day = "") => day.trim().toUpperCase();

const Cell = ({ entry, onEdit, onDelete }) => {
  if (!entry) {
    return (
      <div className="border border-gray-400 px-2 py-2 text-center text-sm">
        —
      </div>
    );
  }

  return (
    <div className="border border-gray-400 px-2 py-2 text-center text-sm leading-tight group relative">
      <div className="font-medium">{entry.course.course_code}</div>
      <div className="text-xs">{entry.room.room_number}</div>
      <div className="text-xs">{entry.teacher}</div>

      <div className="absolute inset-0 backdrop-blur-md rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
        <button
          onClick={() => onEdit(entry)}
          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const SectionRoutine = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .all([
        axios.get(`${API_BASE}/sections`),
        axios.get(`${API_BASE}/routines`),
      ])
      .then(
        axios.spread((sectionsRes, allRoutinesRes) => {
          const sectionsData = sectionsRes.data.data.sections || [];
          const allRoutinesData = allRoutinesRes.data.data.routines || [];

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

          const sorted = sectionsData.sort((a, b) => {
            const [aNum = "0", aChar = ""] =
              a.section_name.match(/\d+|[A-Z]+/g) || [];
            const [bNum = "0", bChar = ""] =
              b.section_name.match(/\d+|[A-Z]+/g) || [];
            return aNum !== bNum
              ? Number(aNum) - Number(bNum)
              : aChar.localeCompare(bChar);
          });

          setSections(sorted);
          setCourses(uniqueCourses);
          setRooms(uniqueRooms);

          if (sorted.length) setSectionId(sorted[0].id);
          setLoading(false);
        })
      );
  }, [API_BASE]);

  useEffect(() => {
    if (!sectionId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/routines`, {
        params: { section_id: sectionId },
      })
      .then((res) => {
        setRoutines(res.data.data.routines || []);
        setLoading(false);
      });
  }, [sectionId, API_BASE]);

  const handleDelete = (routineId) => {
    navigate(`/delete-routine/${routineId}`);
  };

  const handleEdit = (routine) => {
    navigate(`/update-routine/${routine.id}`);
  };


  if (loading && sections.length === 0)
    return <p className="p-6">Loading...</p>;

  const normalized = routines.map((r) => ({ ...r, day: normalizeDay(r.day) }));

  const timeSlots = Array.from(
    new Set(normalized.map((r) => `${r.start_time}-${r.end_time}`))
  ).sort((a, b) => a.localeCompare(b));

  const days = Array.from(new Set(normalized.map((r) => r.day))).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  const getClass = (day, slot) => {
    const [start, end] = slot.split("-");
    return normalized.find(
      (r) => r.day === day && r.start_time === start && r.end_time === end
    );
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Section Routine
            </h1>
            <div className="h-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-2">View class schedules by section</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Select Section:
              </span>
              <select
                className="select select-bordered select-lg bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 focus:border-orange-500 w-72 font-medium text-gray-700 hover:border-red-300 transition-all duration-200"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.section_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!sectionId || normalized.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xl text-gray-400 font-medium">
                No routines found for this section
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <div
                className="grid gap-px bg-gray-200 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(200px, 1fr))`,
                }}
              >
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 text-white font-bold text-center flex items-center justify-center shadow-sm">
                  <span className="text-lg">Day</span>
                </div>

                {timeSlots.map((slot) => {
                  const [s, e] = slot.split("-");
                  return (
                    <div
                      key={slot}
                      className="bg-gradient-to-br from-red-600 to-red-700 p-4 text-white font-semibold text-center flex flex-col items-center justify-center shadow-sm"
                    >
                      <div className="text-sm">{formatTime12h(s)}</div>
                      <div className="text-xs opacity-90">to</div>
                      <div className="text-sm">{formatTime12h(e)}</div>
                    </div>
                  );
                })}

                {days.map((day) => (
                  <React.Fragment key={day}>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 font-bold text-center flex items-center justify-center text-orange-900">
                      <span className="text-base">{day.slice(0, 3)}</span>
                    </div>

                    {timeSlots.map((slot) => {
                      const cls = getClass(day, slot);
                      return (
                        <Cell
                          key={day + slot}
                          entry={cls}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SectionRoutine;

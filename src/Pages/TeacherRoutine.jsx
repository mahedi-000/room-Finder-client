import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
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
const getTeacherName = (routine) => routine?.teacher || "";
const unique = (arr) => Array.from(new Set(arr)).filter(Boolean);
const sortTeachers = (arr) => arr.sort();

const Cell = ({ entry }) => {
  if (!entry) {
    return (
      <div className="border border-gray-400 px-2 py-2 text-center text-sm">
        —
      </div>
    );
  }

  return (
    <div className="border border-gray-400 px-2 py-2 text-center text-sm leading-tight">
      <div className="font-medium">{entry.course.course_code}</div>
      <div className="text-xs">{entry.section.section_name}</div>
      <div className="text-xs">{entry.room.room_number}</div>
    </div>
  );
};

const TeacherRoutine = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [routines, setRoutines] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/routines`).then((res) => {
      const data = res.data.data.routines || [];
      setRoutines(data);

      const teachers = sortTeachers(unique(data.map(getTeacherName)));
      if (teachers.length) {
        setTeacher(teachers[0]);
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const teachers = sortTeachers(unique(routines.map(getTeacherName)));

  const teacherRoutines = routines
    .filter((r) => r.teacher === teacher)
    .map((r) => ({ ...r, day: normalizeDay(r.day) }));

  const timeSlots = unique(
    teacherRoutines.map((r) => `${r.start_time}-${r.end_time}`)
  ).sort();

  const days = unique(teacherRoutines.map((r) => r.day)).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  const getClass = (day, slot) => {
    const [start, end] = slot.split("-");
    return teacherRoutines.find(
      (r) => r.day === day && r.start_time === start && r.end_time === end
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Teacher Schedule
            </h1>
            <div className="h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-2">View class schedules by teacher</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Select Teacher:
              </span>
              <select
                className="select select-bordered select-lg bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 focus:border-green-500 w-72 font-medium text-gray-700 hover:border-teal-300 transition-all duration-200"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
              >
                {teachers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {teacherRoutines.length === 0 ? (
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
                No routines found for this teacher
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100">
           
            <div className="block sm:hidden text-center text-xs text-gray-500 mb-2">
              ← Swipe to view schedule →
            </div>
            <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
              <div
                className="grid gap-px bg-gray-200 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(180px, 1fr))`,
                  minWidth: 'fit-content'
                }}
              >
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 text-white font-bold text-center flex items-center justify-center shadow-sm">
                  <span className="text-lg">Day</span>
                </div>

                {timeSlots.map((slot) => {
                  const [s, e] = slot.split("-");
                  return (
                    <div
                      key={slot}
                      className="bg-gradient-to-br from-teal-600 to-teal-700 p-4 text-white font-semibold text-center flex flex-col items-center justify-center shadow-sm"
                    >
                      <div className="text-sm">{formatTime12h(s)}</div>
                      <div className="text-xs opacity-90">to</div>
                      <div className="text-sm">{formatTime12h(e)}</div>
                    </div>
                  );
                })}

                {days.map((day) => (
                  <React.Fragment key={day}>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 font-bold text-center flex items-center justify-center text-green-900">
                      <span className="text-base">{day.slice(0, 3)}</span>
                    </div>

                    {timeSlots.map((slot) => {
                      const cls = getClass(day, slot);
                      return (
                        <Cell
                          key={day + slot}
                          entry={cls}
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

export default TeacherRoutine;

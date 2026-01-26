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
const getRoomName = (routine) => routine?.room?.room_number || "";
const unique = (arr) => Array.from(new Set(arr)).filter(Boolean);
const sortRooms = (arr) => arr.sort();

const Cell = ({ entry, isBreak }) => {
  if (isBreak) {
    return (
      <div className="border border-gray-400 px-2 py-2 text-center text-sm font-medium">
        Break
      </div>
    );
  }

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
      <div className="text-xs">{entry.teacher}</div>
    </div>
  );
};

const RoomRoutine = () => {
  const [routines, setRoutines] = useState([]);
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = "http://localhost:3000/routines";

    axios
      .get(url)
      .then((res) => {
        const data = res.data.data.routines || [];
        console.log(data);
        setRoutines(data);
        if (data.length && !room) setRoom(getRoomName(data[0]));
      })
      .catch((err) => {
        console.error("Failed to fetch routines:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const rooms = sortRooms(unique(routines.map(getRoomName)));
  const activeRoom = room || rooms[0] || "";

  const roomRoutines = routines
    .filter((r) => getRoomName(r) === activeRoom)
    .map((r) => ({ ...r, day: normalizeDay(r.day) }));

  const timeSlots = unique(
    roomRoutines.map((r) => `${r.start_time}-${r.end_time}`)
  ).sort((a, b) => {
    const [aStart] = a.split("-");
    const [bStart] = b.split("-");
    return aStart.localeCompare(bStart);
  });

  const days = unique(roomRoutines.map((r) => r.day)).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  const getClass = (day, slot) => {
    const [start, end] = slot.split("-");
    return roomRoutines.find(
      (r) =>
        r.day.toUpperCase() === day &&
        r.start_time === start &&
        r.end_time === end
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-360 mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Room Schedule
            </h1>
            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-2">View class schedules by room</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Select Room:
              </span>
              <select
                className="select select-bordered select-lg bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 focus:border-blue-500 w-72 font-medium text-gray-700 hover:border-purple-300 transition-all duration-200"
                value={activeRoom}
                onChange={(e) => setRoom(e.target.value)}
              >
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!activeRoom || roomRoutines.length === 0 ? (
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
                No routines found for this room
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100">
            {/* Mobile scroll hint */}
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
                {/* Header - Day */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white font-bold text-center flex items-center justify-center shadow-sm">
                  <span className="text-lg">Day</span>
                </div>

                {/* Header - Time Slots */}
                {timeSlots.map((slot) => {
                  const [s, e] = slot.split("-");
                  return (
                    <div
                      key={slot}
                      className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 text-white font-semibold text-center flex flex-col items-center justify-center shadow-sm"
                    >
                      <div className="text-sm">{formatTime12h(s)}</div>
                      <div className="text-xs opacity-90">to</div>
                      <div className="text-sm">{formatTime12h(e)}</div>
                    </div>
                  );
                })}

                {/* Body - Days and Classes */}
                {days.map((day) => (
                  <React.Fragment key={day}>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 font-bold text-center flex items-center justify-center text-blue-900">
                      <span className="text-base">{day.slice(0, 3)}</span>
                    </div>

                    {timeSlots.map((slot) => {
                      const cls = getClass(day, slot);
                      return (
                        <div
                          key={day + slot}
                          className={`bg-white p-3 min-h-24 flex flex-col justify-center items-center transition-all duration-200 ${
                            cls
                              ? "hover:bg-blue-50 hover:shadow-md cursor-pointer"
                              : ""
                          }`}
                        >
                          {cls ? (
                            <div className="text-center space-y-1">
                              <div className="font-bold text-blue-700 text-sm">
                                {cls.course.course_code}
                              </div>
                              <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                {cls.section.section_name}
                              </div>
                              <div className="text-xs text-gray-600 font-medium">
                                {cls.teacher}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-2xl">—</span>
                          )}
                        </div>
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

export default RoomRoutine;

import React from "react";

const timeSlots = [
  { key: "slot1", label: "10:40–11:30" },
  { key: "slot2", label: "11:30–12:20" },
  { key: "slot3", label: "12:20–1:10" },
  { key: "break", label: "1:10-1:50" },
  { key: "slot5", label: "1:50–2:40" },
  { key: "slot6", label: "2:40–3:30" },
  { key: "slot7", label: "3:30–4:20" },
];

const teacherSchedule = [
  {
    day: "Sat",
    entries: {
      slot2: {
        course: "CSE-2321",
        room: "C102",
        section: "3AM",
      },
      slot6: {
        course: "CSE-3532",
        room: "CX602",
        section: "5DM",
      },
      slot7: {
        course: "CSE-3532",
        room: "CX602",
        section: "5DM",
      },
    },
  },
  {
    day: "Sun",
    entries: {
      slot1: {
        course: "CSE-2321 ",
        room: "CX505",
        section: "3AM",
      },
    },
  },
  {
    day: "Mon",
    entries: {
      slot1: {
        course: " CSE-1122",
        room: " C101",
        section: "1AM",
      },
      slot2: {
        course: "CSE-1122",
        room: " CX204",
        section: "1AM",
      },
      slot3: {
        course: "CSE-1122",
        room: " C101",
        section: "1AM",
      },
    },
  },
  {
    day: "Tue",
    entries: {
      slot1: {
        course: "MDP-3505",
        room: "CX602",
        section: "5DM",
      },
      slot2: {
        course: " CSE-3532",
        room: " CX602",
        section: " 5DM",
      },
      slot3: {
        course: "CSE-3532",
        room: "CX602",
        section: "5DM",
      },
    },
  },
  {
    day: "Wed",
    entries: {
      slot1: {
        course: "CSE-1121",
        room: "CX502",
        section: "1AM",
      },
      slot2: {
        course: "CSE-1121",
        room: "CX502",
        section: "1AM",
      },
      slot3: {
        course: "CSE-2322",
        room: "C101",
        section: "3AM",
      },
    },
  },
];

const Cell = ({ entry, isBreak }) => {
  if (isBreak) {
    return (
      <div className="border border-gray-400 px-2 py-2 text-center text-sm font-medium">
        Break
      </div>
    );
  }

  if (!entry) {
    return <div className="border border-gray-400 px-2 py-2 text-center text-sm">—</div>;
  }

  return (
    <div className="border border-gray-400 px-2 py-2 text-center text-sm leading-tight">
      <div className="font-medium">{entry.course}</div>
      <div className="text-xs">{entry.section}</div>
      <div className="text-xs">{entry.room}</div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold text-center">
        Teacher Schedule
      </h2>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[90px_repeat(7,minmax(110px,1fr))]">
          <div className="border border-gray-400 p-2 text-center font-semibold">Day</div>
          {timeSlots.map((slot) => (
            <div
              key={slot.key}
              className="border border-gray-400 p-2 text-center font-semibold text-sm"
            >
              {slot.label}
            </div>
          ))}
          {teacherSchedule.map((row) => (
            <React.Fragment key={row.day}>
              <div className="border border-gray-400 p-2 text-center font-semibold">
                {row.day}
              </div>

              {timeSlots.map((slot) => (
                <Cell
                  key={slot.key}
                  entry={row.entries[slot.key]}
                  isBreak={slot.key === "break"}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

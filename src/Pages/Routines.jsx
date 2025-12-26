import React from "react";

const timeSlots = [
  { key: "slot1", label: "10:40–11:30" },
  { key: "slot2", label: "11:30–12:20" },
  { key: "slot3", label: "12:20–1:10" },
  { key: "break", label: "Break" },
  { key: "slot5", label: "1:50–2:40" },
  { key: "slot6", label: "2:40–3:30" },
  { key: "slot7", label: "3:30–4:20" },
];

const schedule = [
  {
    day: "Sat",
    entries: {
      slot1: {
        course: "URED-3601 (CX104)",
        instructor: "DMMA",
      },
      slot2: { course: "CSE-3524 (CX401)", instructor: "TIK_ADJ" },
      slot3: { course: "CSE-3524 (CX401)", instructor: "TIK_ADJ" },
      slot5: { course: "URED-3503 (CX202)", instructor: "MNN" },
      slot6: { course: "CSE-3532 (CX602)", instructor: "JAA" },
      slot7: { course: "CSE-3532 (CX602)", instructor: "JAA" },
    },
  },
  {
    day: "Sun",
    entries: {
      slot1: { course: "CSE-3521 (CX102)", instructor: "NAB" },
      slot2: { course: "CSE-3527 (CX102)", instructor: "RIT_ADJ" },
      slot3: { course: "CSE-3527 (CX102)", instructor: "RIT_ADJ" },
      slot5: { course: "CSE-3523 (CX404)", instructor: "TIK_ADJ" },

      slot6: { course: "CSE-3523 (CX404)", instructor: "TIK_ADJ" },

      slot7: { course: "CSE-3523 (CX404)", instructor: "TIK_ADJ" },
    },
  },
  {
    day: "Mon",
    entries: {
      slot1: {
        course: "CSE-3529,(CXB204)",
        instructor: "NKS_ADJ",
      },
      slot2: {
        course: "CSE-3529,(CXB204)",
        instructor: "NKS_ADJ",
      },
      slot3: {
        course: "CSE-3529,(CXB204)",
        instructor: "NKS_ADJ",
      },
      slot5: {
        course: "EEE-2421,(CX302)",
        instructor: "MAO",
      },
      slot6: { course: "EEE-2421,(CX302)", instructor: "MAO" },
    },
  },
  {
    day: "Tue",
    entries: {
      slot1: { course: "MDP-3505 (CX602)", instructor: "JAA" },
      slot2: { course: "CSE-3532 (CX602)", instructor: "JAA" },
      slot3: { course: "CSE-3532 (CX602)", instructor: "JAA" },

      slot5: {
        course: "CSE-3528,(C501)",
        instructor: "RIT_ADJ",
      },
      slot6: {
        course: "CSE-3528,(C501)",
        instructor: "RIT_ADJ",
      },
      slot7: {
        course: "CSE-3527,(C501)",
        instructor: "RIT_ADJ",
      },
    },
  },
  {
    day: "Wed",
    entries: {
      slot1: { course: "CSE-3521 (CX403)", instructor: "NAB" },
      slot2: { course: "CSE-3521 (CX403)", instructor: "NAB" },
      slot5: {
        course: "EEE-2421,(CX302)",
        instructor: "MAO",
      },
      slot6: {
        course: "URED-3503,(CX103)",
        instructor: "MNN",
      },
    },
  },
];

const Cell = ({ entry, isBreak }) => {
  if (isBreak) {
    return (
      <div className="border border-gray-400 p-4 text-center font-semibold">
        Break
      </div>
    );
  }

  if (!entry) {
    return <div className="border border-gray-400 p-4 text-center">—</div>;
  }

  return (
    <div className="border border-gray-400 p-3 text-center">
      <p className="font-semibold">{entry.course}</p>
      <p className="text-sm">{entry.instructor}</p>
    </div>
  );
};

const Routines = () => {
  return (
    <div className="p-6">
      <select defaultValue="Sections" className="select select-info">
        <option disabled={true}>Sections</option>
        <option>3AM</option>
        <option>5DM</option>
        <option>4AM</option>
        <option>7BM</option>
      </select>{" "}
      <h1 className="mb-4 text-2xl font-bold text-center">Class Schedule</h1>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[100px_repeat(7,minmax(120px,1fr))] border border-gray-400">
          <div className="border border-gray-400 p-3 font-bold text-center">
            Day
          </div>
          {timeSlots.map((slot) => (
            <div
              key={slot.key}
              className="border border-gray-400 p-3 font-bold text-center"
            >
              {slot.label}
            </div>
          ))}

          {schedule.map((row) => (
            <React.Fragment key={row.day}>
              <div className="border border-gray-400 p-3 font-bold text-center">
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

export default Routines;

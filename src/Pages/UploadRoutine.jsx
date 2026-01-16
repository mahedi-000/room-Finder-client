import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadRoutine = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classType, setClassType] = useState("");
  const [teacher, setTeacher] = useState("");

  const days = [
    "SATURDAY",
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ];

  const timeSlots = [
    { start: "10:40", end: "11:30" },
    { start: "11:31", end: "12:20" },
    { start: "12:21", end: "1:10" },
    { start: "1:51", end: "2:40" },
    { start: "2:41", end: "3:30" },
    { start: "3:31", end: "4:20" },
  ];

  useEffect(() => {
    axios.get("/courses").then((res) => {
      console.log("courses:", res.data);
      setCourses(res.data?.data?.courses || []);
    });

    axios.get("/sections").then((res) => {
      console.log("sections:", res.data);
      setSections(res.data?.data?.sections || []);
    });

    axios.get("/rooms").then((res) => {
      console.log("rooms:", res.data);
      setRooms(res.data?.data?.rooms || []);
    });
  }, []);
  const resetForm = () => {
    setDay("");
    setStartTime("");
    setEndTime("");
    setClassType("");
    setTeacher("");

    setSelectedCourseId("");
    setSelectedSectionId("");
    setSelectedRoomId("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      day,
      start_time: startTime,
      end_time: endTime,
      class_type: classType,
      teacher,
      course_id: selectedCourseId,
      section_id: selectedSectionId,
      room_id: selectedRoomId,
    };

    console.log("POST /routines payload:", payload);
    axios
      .post("/routines", payload)
      .then((res) => {
        console.log("POST /routines response:", res.data);
        toast.success("Routine created successfully!");
        resetForm();
      })

      .catch((err) => {
        console.error("POST /routines error:", err.response?.data || err);
        toast.error("Failed to create routine");
      });
  };

  return (
    <div className="p-16 rounded-2xl shadow-lg max-w-4xl mx-auto my-12 border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto p-6"
      >
        <select
          className="select select-accent w-full"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        >
          <option value="">Select Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="select select-accent w-full"
          value={classType}
          onChange={(e) => setClassType(e.target.value)}
          required
        >
          <option value="">Select Class Type</option>
          <option value="THEORY">Theory</option>
          <option value="LAB">Lab</option>
        </select>

        <input
          className="input input-accent w-full"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <input
          className="input input-accent w-full"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <input
          className="input input-accent w-full md:col-span-2"
          type="text"
          placeholder="Teacher"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          required
        />

        <select
          className="select select-accent w-full"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          required
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_code} - {course.course_name}
            </option>
          ))}
        </select>

        <select
          className="select select-accent w-full"
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
          required
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.section_name}
            </option>
          ))}
        </select>

        <select
          className="select select-accent w-full md:col-span-2"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          required
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_number} - {room.room_type}
            </option>
          ))}
        </select>

        <button
          className="btn rounded-full hover:scale-105 transition-all duration-300 bg-teal-600 text-white md:col-span-2 mt-4"
          type="submit"
        >
          Create Routine
        </button>
      </form>
    </div>
  );
};

export default UploadRoutine;

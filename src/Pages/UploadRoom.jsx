import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const UploadRoom = () => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");

  const resetForm = () => {
    setRoomNumber("");
    setRoomType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      room_number: roomNumber,
      room_type: roomType,
    };

    console.log("POST /rooms payload:", payload);

    axios
      .post("/rooms", payload)
      .then((res) => {
        console.log("POST /rooms response:", res.data);
        toast.success("Room created successfully!");
        resetForm();
      })
      .catch((err) => {
        console.error(err.response?.data || err);
        toast.error("Failed to create room");
      });
  };

  return (
    <div className="p-16 rounded-2xl shadow-lg max-w-xl mx-auto my-12 border border-gray-200">
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Admin Panel
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Upload Room</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-accent w-full"
          type="text"
          placeholder="Room Number (e.g. C101)"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />

        <input
          className="input input-accent w-full"
          type="text"
          placeholder="Room Type (Lab / Classroom)"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
        />

        <button
          className="btn bg-teal-600 text-white w-full mt-4"
          type="submit"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default UploadRoom;

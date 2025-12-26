import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadRoom = () => {
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

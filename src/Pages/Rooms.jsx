import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../Components/RoomCard";
import toast from "react-hot-toast";
import { formatTime12h } from "../utils/timeFormat";

const Rooms = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [rooms, setRooms] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("📡 Loading data from API_BASE:", API_BASE);

        const [roomsRes, routinesRes] = await Promise.all([
          axios.get(`${API_BASE}/rooms`),
          axios.get(`${API_BASE}/routines`),
        ]);

        const roomsData = roomsRes.data?.data?.rooms || [];
        const routinesData = routinesRes.data?.data?.routines || [];

        console.log("✅ Rooms loaded:", roomsData.length, "rooms");
        console.log("✅ Routines loaded:", routinesData.length, "routines");

        setRooms(roomsData);
        setRoutines(routinesData);

        try {
          const statusesRes = await axios.get(`${API_BASE}/roomStatuses`);
          console.log("🔍 Room statuses API response:", statusesRes.data);

          const statusesData = Array.isArray(
            statusesRes.data?.data?.roomStatuses
          )
            ? statusesRes.data.data.roomStatuses
            : [];

          console.log(
            "✅ Room statuses loaded:",
            statusesData.length,
            "statuses"
          );
          console.log("Status data:", statusesData);

          setRoomStatuses(statusesData);
        } catch (statusError) {
          console.error("❌ Room statuses error:", statusError.message);
          console.error("Full error:", statusError);
          setRoomStatuses([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API_BASE]);

  const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getTodayDayOfWeek = () => {
    const now = new Date();
    return now.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
  };

  const getAvailableRooms = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const todayDate = getTodayDate();
    const todayDay = getTodayDayOfWeek();

    const breakStart = "13:10";
    const breakEnd = "13:50";
    const isBreakTime = currentTime >= breakStart && currentTime < breakEnd;

    if (isBreakTime) {
      return rooms;
    }

    const businessStart = "10:40";
    const businessEnd = "18:20";
    const isBusinessHours =
      currentTime >= businessStart && currentTime < businessEnd;

    const filtered = rooms.filter((room) => {
      if (isBusinessHours) {
    
        const matchingStatuses = roomStatuses.filter((s) => {
          const roomMatch = s.room?.id === room.id || s.room_id === room.id;
          
          if (s.is_recurring) {
            return roomMatch && s.day_of_week === todayDay;
          } else {
            const statusDateOnly = s.status_date?.split("T")[0];
            return roomMatch && statusDateOnly === todayDate;
          }
        });

       
        const activeOccupiedStatus = matchingStatuses.find((s) => {
          if (s.status === "OCCUPIED" && s.routine) {
            return (
              currentTime >= s.routine.start_time &&
              currentTime < s.routine.end_time
            );
          }
          return false;
        });

        
        if (activeOccupiedStatus) {
          return false;
        }

        
        const activeFreeStatus = matchingStatuses.find((s) => {
          if (s.status === "FREE") {
           
            if (s.start_time && s.end_time) {
              
              if (s.end_time < s.start_time) {
                return currentTime >= s.start_time || currentTime < s.end_time;
              }
              return currentTime >= s.start_time && currentTime < s.end_time;
            }
          }
          return false;
        });

       
        if (activeFreeStatus) {
          return true;
        }

        
        return false;
      }

      return true;
    });

    return filtered;
  };

  const getNextClassTime = (roomId) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const today = now
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    const upcomingClasses = routines
      .filter((r) => {
        const dayMatch = r.day?.trim().toUpperCase() === today;
        const roomMatch = r.room?.id === roomId;
        const timeMatch = r.start_time > currentTime;
        return dayMatch && roomMatch && timeMatch;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return upcomingClasses.length > 0 ? upcomingClasses[0].start_time : null;
  };

  if (loading) {
    return <div className="p-6">Loading rooms...</div>;
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const todayDate = getTodayDate();

  const breakStart = "13:10";
  const breakEnd = "13:50";
  const isBreakTime = currentTime >= breakStart && currentTime < breakEnd;

  const businessStart = "10:40";
  const businessEnd = "18:20";
  const isBusinessHours =
    currentTime >= businessStart && currentTime < businessEnd;

  const displayRooms = isBreakTime
    ? rooms 
    : isBusinessHours
    ? rooms.filter((room) => {
        const todayDay = getTodayDayOfWeek();
        const dbStatus = roomStatuses.find((s) => {
          const roomMatch = s.room?.id === room.id || s.room_id === room.id;
          
          if (s.is_recurring) {
            return roomMatch && s.day_of_week === todayDay;
          } else {
            const statusDateOnly = s.status_date?.split("T")[0];
            return roomMatch && statusDateOnly === todayDate;
          }
        });
        return !!dbStatus; 
      })
    : rooms;

  const availableRooms = getAvailableRooms();

  return (
    <div className="px-6 py-6">
      {availableRooms.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-lg mb-3 text-green-900">
            Available Rooms ({availableRooms.length}):
            {isBreakTime && (
              <span className="ml-2 text-sm bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">
                Break Time (1:11 PM - 1:50 PM)
              </span>
            )}
          </h2>
          <div className="space-y-2">
            {availableRooms.map((room) => {
              const nextClassTime = getNextClassTime(room.id);
              return (
                <div
                  key={room.id}
                  className="flex justify-between items-center hover:bg-green-100 p-2 rounded cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-gray-600">
                    <span className="text-green-600 font-bold">
                      {room.room_number}
                    </span>{" "}
                    - {room.room_type}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {nextClassTime
                      ? `Free till ${formatTime12h(nextClassTime)}`
                      : "Available all day"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            routines={routines}
            roomStatuses={roomStatuses}
          />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
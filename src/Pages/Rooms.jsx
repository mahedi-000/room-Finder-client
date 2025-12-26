import RoomCard from "../Components/RoomCard";

const Rooms = () => {
  const rooms = [
    {
      roomNo: "C102",
      type: "Classroom",
      status: "occupied",
      teacher: "JAA",
      subject: "Data Structure",
      section: "3DM",
      time: "10:40 - 11:30",
    },
    {
      roomNo: "C101",
      type: "Lab",
      status: "rescheduled",
      teacher: "JAA",
      subject: "C Programming Lab",
      section: "1BM",
      time: "11:00 - 11:50",
    },
    {
      roomNo: "CX301",
      type: "Classroom",
      status: "maintenance",
      freeTill: "11:50 PM",
    },
    {
      roomNo: "Cx302",
      type: "Classroom",
      status: "occupied",
      teacher: "MKIS",
      subject: "Theory Of Computation",
      section: "4AM",
      time: "12:20 - 01:10",
    },
    {
      roomNo: "C402",
      type: "Lab",
      status: "free",
      teacher: "KTS",
      subject: "Networks Lab",
      section: "7BM",
      freeTill: "12:20 pm",
    },
    {
      roomNo: "CX503",
      type: "Classroom",
      status: "rescheduled",
      teacher: "TA",
      subject: "Computer Algorithms",
      section: "4DM",
      time: "10:00 - 10:50",
    },
    
  ];

  const freeRooms = rooms.filter((room) => room.status === "free");

  return (
    <div className="px-6 py-6">

      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
        <h2 className="font-semibold text-lg mb-2">Rooms Available:</h2>

        {freeRooms.map((room) => (
          <p key={room.roomNo} className="font-semibold text-gray-500">
            <span className="text-green-600 font-semibold">{room.roomNo}</span>{" "}
            is free till {room.freeTill}
          </p>
        ))}

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room, index) => (
          <RoomCard key={index} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;

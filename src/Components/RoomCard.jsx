const RoomCard = ({ room }) => {
  const {
    roomNo,
    type,
    status,
    teacher,
    subject,
    section,
    time,
    freeTill,
  } = room;

  
  const statusColor = {
    free: "bg-green-100 text-green-700",
    occupied: "bg-orange-100 text-orange-700",
    maintenance: "bg-red-100 text-red-700",
    rescheduled: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="shadow-2xl rounded-2xl  cursor-pointer p-4 bg-white max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">Room: {roomNo}</h2>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-3">
        <span>{type}</span>
      </div>

      {status !== "free" ? (
        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Teacher:</span>
            <span className="font-bold">{teacher}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Subject:</span>
            <span className="font-bold">{subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Section:</span>
            <span className="font-bold">{section}</span>
          </div>

          <div className=" text-gray-500">
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="w-4 h-4 fill-current"
              >
                <path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
              </svg>

              <span>{time}</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 text-green-700 text-sm">
          Free until {freeTill}
        </div>
      )}

      <button className="btn bg-teal-600 hover:scale-105 transition transform text-white w-full mt-2 rounded-full">Room Details</button>
    </div>
  );
};

export default RoomCard;

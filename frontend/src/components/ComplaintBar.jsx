import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// const complaints = [
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     due: new Date("2025-10-05T18:00:00"),
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     due: new Date("2025-10-03T12:00:00"),
//   },
// ];

const complaints = useSelector((state) => state.complaints.items);

function ComplaintBar({ complaint }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = complaint.due - now;

      if (diff <= 0) {
        setTimeLeft("Due!");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [complaint.due]);

  return (
    <div
      className="grid grid-cols-[1fr_150px_150px_150px_150px] gap-4 p-4 
      bg-white rounded-2xl shadow-2xs mb-3 
      transform transition duration-200 
      hover:scale-105 hover:shadow-lg"
    >
      {/* Title */}
      <span className="font-semibold truncate">{complaint.title}</span>

      {/* Department */}
      <span className="text-sm">{complaint.department}</span>

      {/* Locality */}
      <span className="text-sm">{complaint.locality}</span>

      {/* Status */}
      <span className="text-sm">{complaint.status}</span>

      {/* Due Timer */}
      <span className={timeLeft === "Due!" ? "text-red-500 font-bold" : ""}>
        {timeLeft}
      </span>
    </div>
  );
}

export default function ComplaintList() {


  return (
    <div>
      {/* Header row */}
      <div className="grid grid-cols-[1fr_150px_150px_150px_150px] gap-4 p-4 font-bold text-gray-700">
        <span>Title</span>
        <span>Department</span>
        <span>Locality</span>
        <span>Status</span>
        <span>Time Left</span>
      </div>

      {/* Complaint rows */}
      {complaints.map((c, i) => (
        <ComplaintBar key={i} complaint={c} />
      ))}
    </div>
  );
}



   
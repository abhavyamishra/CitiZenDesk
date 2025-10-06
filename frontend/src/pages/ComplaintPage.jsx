import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"


export default function ComplaintDetails() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

// const complaint = {
//   "_id": "1",
//   "title": "Garbage not collected",
//   "description": "Garbage not collected in my street for 3 days lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   "status": "Being Processed",
//   "dept": "Sanitation",
//   "due": "2025-10-10T18:00:00Z",
//   "author": "Abhavya Mishra",
//   "locality": "Sector 21, Noida",
//   "media": [
//   "/garbage.jpg",
//   "/garbage2.png",
//   "/vdo.mp4",
//   "chudgayeguru.jpg"
// ]
// }

  const calculateTimeRemaining = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due - now
    if (diff <= 0) return "Due!"
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    return `${days}d ${hours}h remaining`
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/complaints/${id}`)
      .then((response) => {
        setComplaint(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaint:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-5">Loading complaint...</p>
  }

  if (!complaint) {
    return <p className="text-center mt-5 text-red-500">Complaint not found</p>
  }

  const [selected, setSelected] = useState(null)
  const [scale, setScale] = useState(1)

  if (!complaint.media || complaint.media.length === 0) return null

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) setScale((s) => Math.min(s + 0.1, 3))
    else setScale((s) => Math.max(s - 0.1, 1))
  }

  return (
    
      <Card className="w-full shadow-lg bg-white h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{complaint.title}</CardTitle>
          <p className="text-sm text-gray-500">Filed by {complaint.author}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{complaint.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status: </span>
              <span className="text-blue-600">{complaint.status}</span>
            </div>
            <div>
              <span className="font-medium">Department: </span>
              {complaint.dept}
            </div>
            <div>
              <span className="font-medium">Locality: </span>
              {complaint.locality}
            </div>
            <div>
              <span className="font-medium">Due: </span>
              {calculateTimeRemaining(complaint.due)}
            </div>
          </div>

          {/* Media Preview */}
          {complaint.media && complaint.media.length > 0 && (
            <div className="mt-4">
      <h3 className="font-medium mb-2">Attachments</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {complaint.media.map((file, index) => (
          <div
            key={index}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => { setSelected(file); setScale(1) }}
          >
            {file.endsWith(".mp4") ? (
              <video
                src={file}
                className="rounded-lg h-75 w-auto object-contain"
                muted
              />
            ) : (
              <img
                src={file}
                alt={`Media ${index + 1}`}
                className="rounded-lg h-75 w-auto object-contain"
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="relative max-w-full max-h-full">
            <button
              className="absolute top-2 right-2 text-black text-9xl font-bold z-50"
              onClick={() => setSelected(null)}
            >
              X
            </button>

            {selected.endsWith(".mp4") ? (
              <video
                src={selected}
                controls
                autoPlay
                className="max-w-full max-h-[90vh]"
              />
            ) : (
              <img
                src={selected}
                alt="Preview"
                onWheel={handleWheel}
                style={{ transform: `scale(${scale})` }}
                className="max-w-full max-h-[90vh] object-contain transition-transform"
              />
            )}
          </div>
        </div>
      )}
    </div>
            )}

        </CardContent>
      </Card>
    
  )
}
/*

*/
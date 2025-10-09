import { io } from "socket.io-client";
import { store } from "../redux/store";
import { complaintAdded, complaintUpdated } from "../features/complaints/complaintSlice";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export const setupSocketListeners = () => {
    socket.on('new_complaint', (newComplaint) => {
        store.dispatch(complaintAdded(newComplaint));
    });

    socket.on('complaint_updated', (updatedComplaint) => {
        store.dispatch(complaintUpdated(updatedComplaint));
    });
};
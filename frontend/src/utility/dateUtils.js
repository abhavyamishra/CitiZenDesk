// src/utils/dateUtils.js

/**
 * Calculates the due date and formats the remaining time into a readable string.
 * @param {string | Date} startTime - The time the complaint was registered.
 * @param {number} durationHours - The number of hours after which the complaint is due.
 * @returns {string} The formatted time string (e.g., "5d 10h left", "Overdue").
 */
export const formatTimeLeft = (startTime, durationHours) => {
    const start = new Date(startTime);
    
    // Calculate the due date by adding the duration to the start time
    const dueDate = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    
    // Calculate the time left in milliseconds
    const now = new Date();
    const ms = dueDate - now;

    if (ms < 0) return "Overdue";

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    if (minutes > 0) return `${minutes}m left`;
    
    return "Due now";
};


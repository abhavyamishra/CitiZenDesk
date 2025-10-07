import { useMemo } from 'react';
import { useSelector } from 'react-redux';
   

export const useFilteredComplaints = () => {
    const allComplaints = useSelector(state => state.complaints.items);
    const filters = useSelector(state => state.complaints.filters);

    const processedComplaints = useMemo(() => {
        const now = new Date();

        let complaints = allComplaints.map(complaint => ({
            ...complaint,
            timeLeft: new Date(complaint.dueDate) - now,
        }));

        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            complaints = complaints.filter(c => {
                const complaintDate = new Date(c.date);
                return complaintDate >= start && complaintDate <= end;
            });
        }


        // Type(Department)
        if (filters.type.length > 0) {
            complaints = complaints.filter(c => filters.type.includes(c.type));
        }

        // Locality
        if (filters.locality.length > 0) {
            complaints = complaints.filter(c => filters.locality.includes(c.locality));
        }

        if (filters.status.length > 0) {
            complaints = complaints.filter(c => filters.status.includes(c.status));
        }

        switch (filters.sortBy) {
            case 'timeLeft_asc':
                complaints.sort((a, b) => a.timeLeft - b.timeLeft);
                break;
            case 'older':
                complaints.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'completion_time':
                complaints.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
                break;
            case 'newer':
            default:
                complaints.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        return complaints;

    }, [allComplaints, filters]); 

    return processedComplaints;
};
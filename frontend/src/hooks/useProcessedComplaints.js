import { useMemo } from 'react';
import { useSelector } from 'react-redux';


// string to number mapping for urgency levels taki sorting easy ho jaye
const urgencyMap = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
};


export const useProcessedComplaints = (inputComplaints) => {
    // const allComplaints = useSelector(state => state.complaints.items);
    const filters = useSelector(state => state.complaints.filters);
    const pagination = useSelector(state => state.complaints.pagination);

    const processedData = useMemo(() => {
        let complaints = [...(inputComplaints || [])];

        // filtering
        if (filters.department.length > 0) complaints = complaints.filter(c => filters.department.includes(c.deptName));
        if (filters.locality.length > 0) complaints = complaints.filter(c => filters.locality.includes(c.locality));
        if (filters.status.length > 0) complaints = complaints.filter(c => filters.status.includes(c.status));
        if (filters.urgency.length > 0) complaints = complaints.filter(c => filters.urgency.includes(c.urgency));
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate).setHours(0, 0, 0, 0);
            const end = new Date(filters.endDate).setHours(23, 59, 59, 999);
            complaints = complaints.filter(c => {
                const complaintDate = new Date(c.date);
                return complaintDate >= start && complaintDate <= end;
            });
        }

        // sorting
        switch (filters.sortBy) {
            case 'urgency_desc':
                complaints.sort((a, b) => (urgencyMap[b.urgency] || 0) - (urgencyMap[a.urgency] || 0));
                break;
            case 'urgency_asc':
                complaints.sort((a, b) => (urgencyMap[a.urgency] || 0) - (urgencyMap[b.urgency] || 0));
                break;
            case 'older':
                complaints.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'newer':
            default:
                complaints.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        // pagination
        const totalItems = complaints.length;
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        const paginatedItems = complaints.slice(startIndex, endIndex);

        return {
            paginatedItems,
            totalItems,
            totalPages: Math.ceil(totalItems / pagination.itemsPerPage),
            currentPage: pagination.currentPage,
            itemsPerPage: pagination.itemsPerPage,
        };

    }, [inputComplaints, filters, pagination]);

    return processedData;
};
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import  ComplaintHeatmap  from '../components/ComplaintHeatmap'; 
import { Charts } from "../components/Charts"


const getWeightFromUrgency = (urgency) => {
    switch (urgency.toLowerCase()) {
        case 'critical':
            return 14;
        case 'high':
            return 10;
        case 'medium':
            return 5;
        case 'low':
            return 2;
        default:
            return 1;
    }
};

const DashboardPage = () => {

    // const allComplaints = useSelector(state => state.complaints.items);

    // const heatmapData = useMemo(() => {
    //     if (!allComplaints || !window.google) {
    //         return [];
    //     }

    //     return allComplaints.map(complaint => ({
    //         location: new window.google.maps.LatLng(complaint.latitude, complaint.longitude),
    //         weight: getWeightFromUrgency(complaint.urgency),
    //     }));
        
    // }, [allComplaints]); 

     const allComplaints = [
    // --- Hotspot 1: Civil Lines (Commercial Hub) ---
    { lat: 25.4529, lng: 81.8349, weight: 6 }, // Major: Broken traffic light at main crossing
    { lat: 25.4540, lng: 81.8349, weight: 10 }, // Minor: Garbage overflow near a restaurant
    { lat: 25.4555, lng: 81.8349, weight: 4 }, // Moderate: Large pothole on a busy road

    // --- Hotspot 2: Katra (Busy Market & University Area) ---
    { lat: 25.4745, lng: 81.8415, weight: 3 }, // Moderate: Illegal street vendor setup blocking traffic
    { lat: 25.4750, lng: 81.8425, weight: 5 }, // Major: Frequent power outage reported by students
    { lat: 25.4740, lng: 81.8400, weight: 2 }, // Minor: Stray animal nuisance near market

    // --- Critical Issue in Naini (Industrial Area) ---
    { lat: 25.3996, lng: 81.8907, weight: 10 }, // Critical: Illegal industrial waste dumping near the river

    // --- Dense Residential Area Complaints ---
    { lat: 25.4718, lng: 81.8653, weight: 5 }, // Allahpur: Major water logging after rain
    { lat: 25.4725, lng: 81.8660, weight: 3 }, // Allahpur: Broken streetlight on a main lane
    { lat: 25.4325, lng: 81.8050, weight: 6 }, // Kareli: Damaged equipment in a public park
    { lat: 25.4330, lng: 81.8065, weight: 4 }, // Kareli: Sewage overflow issue

    // --- Other Spread-out Localities ---
    { lat: 25.5341, lng: 81.8538, weight: 3,},    // Phaphamau: Damaged public water tap
    { lat: 25.4420, lng: 81.7879, weight: 4 },    // Subedarganj: Irregular garbage collection
    { lat: 25.4442, lng: 81.7426, weight: 5 },    // Bamrauli: Poor road condition near airport
    { lat: 25.5539, lng: 81.9333, weight: 7 },    // Jhunsi: Major water supply contamination reported
    { lat: 25.4650, lng: 81.8480, weight: 2 },    // George Town: Minor issue with overgrown trees
  ];
    const heatmapData = () => {
       
        return  allComplaints.map(complaint => ({
            location: new window.google.maps.LatLng(complaint.lat, complaint.lng),
            weight: complaint.weight,
        }));
    }

    return (
                <div className="w-full p-4 bg-background relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Complaint Density Heatmap</h2>
                
            </div>
            
            <div className="h-[100vh] w-full rounded-lg border">
                <ComplaintHeatmap complaints={allComplaints} />
            </div>
            
            <Charts />

            {/* ... other components ... */}
        </div>
    );
};

export default DashboardPage;
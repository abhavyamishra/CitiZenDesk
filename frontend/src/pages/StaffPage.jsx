import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ComplaintsDashboard } from './ComplaintsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    const allComplaints = useSelector(state => state.complaints.items);
    const currentStaffId = useSelector(state => state.auth.isAuthenticated? state.auth.id : null);

    const complaintsForDashboard = useMemo(() => {
        if (activeTab === 'user' && currentStaffId) {
         
            return allComplaints.filter(complaint => complaint.assignedStaff === currentStaffId && complaint.status in ['being_processed', 'active', 'elapsed']);
        }
        return allComplaints.filter(complaint => complaint.assignedStaff === currentStaffId);
    }, [activeTab, allComplaints, currentStaffId]);

    return (
        <div className="container mx-auto p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">Assigned Complaints</TabsTrigger>
                    <TabsTrigger value="user">Your Complaints</TabsTrigger>
                </TabsList>

                <ComplaintsDashboard complaintsData={complaintsForDashboard} />
                
            </Tabs>
        </div>
    );
};
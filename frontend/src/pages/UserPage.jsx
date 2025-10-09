import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ComplaintsDashboard } from './ComplaintsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    const allComplaints = useSelector(state => state.complaints.items);
    const currentUserId = useSelector(state => state.auth.isAuthenticated? state.auth.id : null);

    const complaintsForDashboard = useMemo(() => {
        if (activeTab === 'user' && currentUserId) {
            // If on "Your Complaints" tab, filter the list
            return allComplaints.filter(complaint => complaint.createdBy === currentUserId);
        }
        return allComplaints;
    }, [activeTab, allComplaints, currentUserId]);

    return (
        <div className="container mx-auto p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Complaints</TabsTrigger>
                    <TabsTrigger value="user">Your Complaints</TabsTrigger>
                </TabsList>

                <ComplaintsDashboard complaintsData={complaintsForDashboard} />
                
            </Tabs>
        </div>
    );
};
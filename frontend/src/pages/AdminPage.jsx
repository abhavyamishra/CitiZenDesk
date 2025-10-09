import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ComplaintsDashboard } from './ComplaintsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminPage = () => {
    // const [activeTab, setActiveTab] = useState('all');

    const allComplaints = useSelector(state => state.complaints.items);
    const currentAdminId = useSelector(state => state.auth.isAuthenticated? state.auth.id : null);

    const complaintsForDashboard = useMemo(() => {
       
            return allComplaints;
        
    }, [ allComplaints, currentAdminId]);

    return (
        <div className="container mx-auto p-4">
           
                

                <ComplaintsDashboard complaintsData={complaintsForDashboard} />
                
        
        </div>
    );
};
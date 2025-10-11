import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ComplaintsDashboard } from './ComplaintsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ManagerPage = () => {
    // const [activeTab, setActiveTab] = useState('all');

    const allComplaints = useSelector(state => state.complaints.items);
    const currentManagerId = useSelector(state => state.auth.isAuthenticated? state.auth.id : null);

    const complaintsForDashboard = useMemo(() => {
       
       
            return allComplaints.filter(complaint => complaint.deptName === currentManagerId.deptName);
        
        
    }, [ allComplaints, currentManagerId]);

    return (
        <div className="container mx-auto p-4">
           
                

                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="complaints">Complaints</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                     {/* Complaints Tab */}
      <TabsContent value="complaints">
        <ComplaintsDashboard complaintsData={complaintsForDashboard} />
      </TabsContent>

      {/* Staff Tab */}
      <TabsContent value="staff">
        <StaffDashboard />
      </TabsContent>
                
        
        </div>
    );
};
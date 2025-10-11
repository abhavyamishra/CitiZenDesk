import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ComplaintsDashboard } from './ComplaintsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get('tab'); 

  const [activeTab, setActiveTab] = useState(initialTab === 'user' ? 'user' : 'all');

  const allComplaints = useSelector(state => state.complaints.items);
  const currentUserId = useSelector(state => state.auth.isAuthenticated ? state.auth.id : null);


  const userComplaints = useMemo(() => {
    if (!currentUserId) return [];
    return allComplaints.filter(complaint => complaint.author === currentUserId);
  }, [allComplaints, currentUserId]);

    useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="user">Your Complaints</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ComplaintsDashboard complaintsData={allComplaints} />
        </TabsContent>
        <TabsContent value="user">
          <ComplaintsDashboard complaintsData={userComplaints} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

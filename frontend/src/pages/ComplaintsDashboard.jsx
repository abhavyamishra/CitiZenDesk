import React, { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProcessedComplaints } from '../hooks/useProcessedComplaints';
import { setPagination } from '../slices/complaintSlice';
import { FilterBar } from '../components/FilterBar';
import { formatTimeLeft } from '../utility/dateUtils';

import { StickyHeader } from '../components/StickyHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from 'react';

export const ComplaintsDashboard = ({ complaintsData }) => {
    const dispatch = useDispatch();
    const { 
        paginatedItems, 
        totalItems , 
        totalPages, 
        currentPage, 
        itemsPerPage 
    } = useProcessedComplaints(complaintsData);

const allStatuses = ["active", "being_processed", "elapsed", "completed", "completed_late"];
const allUrgencies = ["critical", "high", "medium", "low"];

  const person = useSelector(state => state.auth.role);
  const deptName = useSelector(state => state.auth.dept);
  const staffMembers = useSelector(state => state.staff.members); 

  useEffect(() => {
    if (person === 'manager' && deptName) {
      dispatch(fetchStaffByDept(deptName));
    }
  }, [person, deptName, dispatch]);

//     const paginatedItems = [
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",
//     due: new Date("2025-10-05T18:00:00"),
//     date: "2025-09-20"
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
//   {
//     title: "Street light not working",
//     department: "Electricity",
//     locality: "Sector 12",
//     status: "Pending",
//     urgency: "High",    
//     StartTime: "2025-09-20",
//     durationHours: 72
//   },
//   {
//     title: "Water leakage in pipeline. meri choli m cockroach. maine khayi chipkali ki tatti yayyyyyyyy. mai hu disco dancer uhnn",
//     department: "Water Supply",
//     locality: "Sector 7",
//     status: "In Progress",
//     urgency: "Critical",
//     due: new Date("2025-10-03T12:00:00"),
//     date: "2025-09-18"
//   },
// ];
// const totalItems = paginatedItems.length;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPagination({ currentPage: newPage }));
        }
    };

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ itemsPerPage: Number(value), currentPage: 1 }));
    };

    const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const toItem = Math.min(currentPage * itemsPerPage, totalItems);

    
    return (
        <div className="container mx-auto p-4 space-y-6">
            <StickyHeader></StickyHeader>
            <div className="overflow-y-auto border rounded-lg">
                
                
                {/* <FilterBar /> */}
                <Table className="border-collapse-separate w-full">
                    
  <TableHeader className="sticky top-0 z-10 bg-background">
    <TableRow>
      <TableHead className="w-[300px] px-4 text-left">Title</TableHead>
      <TableHead className="px-4 text-left">Department</TableHead>
      <TableHead className="px-4 text-left">Locality</TableHead>
      <TableHead className="px-4 text-left">Status</TableHead>
      <TableHead className="px-4 text-left">Urgency</TableHead>
      <TableHead className="px-4 text-left">Date</TableHead>
      <TableHead className="px-4 text-left">Due</TableHead>
      {person?.role === 'manager' && <TableHead>Assigned To</TableHead>}
    </TableRow>
  </TableHeader>
  

  <TableBody>
    {paginatedItems.map((complaint, i) => (
      <TableRow key={i} className="hover:bg-muted/50">
        <TableCell className="p-4 align-middle">
          <div className="max-w-[300px] truncate" title={complaint.title}>
            {complaint.title}
          </div>
        </TableCell>
        <TableCell className="p-4 align-middle">{complaint.deptName}</TableCell>
        <TableCell className="p-4 align-middle">
  <div className="max-w-[300px] truncate" title={complaint.locality}>
    {complaint.locality}
  </div>
</TableCell>
         <TableCell>
            {person?.role === 'staff' ? (
                              <Select value={complaint.status} onValueChange={(newStatus) => handleStatusChange(complaint.complaintId, newStatus)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-background">
                                        {allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                      </SelectContent>
                              </Select>
                              ) : ( complaint.status )}
          </TableCell>
        <TableCell>
            {(person?.role === 'manager' && person.dept === complaint.deptName) ? (
                                <Select value={complaint.urgency} onValueChange={(newUrgency) => handleUrgencyChange(complaint.complaintId, newUrgency)}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-background">
                                    {allUrgencies.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                ) : ( complaint.urgency )}
        </TableCell>

        
        <TableCell className="p-4 align-middle">
          {new Date(complaint.startTime).toLocaleDateString()}
        </TableCell>
        <TableCell className="p-4 align-middle">
          {(() => {
            if (complaint.status === 'completed' || complaint.status === 'completed_late')
              return <span>-</span>;
            if (complaint.status === 'elapsed')
              return <span className="text-red-500 font-semibold">Overdue</span>;
            return <span>{formatTimeLeft(complaint.startTime, complaint.durationHours)}</span>;
          })()}
        </TableCell>

        {person?.role === 'manager' && (
                           <TableCell>
                              {complaint.assignedStaff ? (
                                complaint.assignedStaff.staffId
                                ) : ((complaint.status === 'active' || complaint.status === 'elapsed')) ? (
                                <Select onValueChange={(staffId) => handleAssignStaff(complaint.complaintId, staffId)}>
                                                {/* ... Select component for assigning staff ... */}

                                  <SelectTrigger><SelectValue placeholder="Assign..." /></SelectTrigger>
                                        <SelectContent className="bg-background">
                                            {staffMembers.map(staff => <SelectItem key={staff.staffId} value={staff.staffId}>{staff.name}</SelectItem>)}
                                        </SelectContent>
                                </Select>
                                ) : (
                                 '-'
                                )}
                          </TableCell>
        )}
      </TableRow>
    ))}
  </TableBody>
</Table>
            </div>
            
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {fromItem} to {toItem} of {totalItems} complaints.
                </div>
                <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2">
                        <p className="text-sm">Rows per page</p>
                         <Select value={`${itemsPerPage}`} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger className="w-[85px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-background'>
                                {[10, 25, 50].map(size => (
                                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};








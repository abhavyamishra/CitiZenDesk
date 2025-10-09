import { useSelector } from 'react-redux';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const StaffDashboard = () => {
    const person = useSelector(state => state.auth.role);
  const deptName = useSelector(state => state.auth.dept);
  const staffMembers = useSelector(state => state.staff.members);
  const status = useSelector(state => state.staff.status); // idle/loading/succeeded/failed

  useEffect(() => {
    if (person === 'manager' && deptName && status === 'idle') {
      dispatch(fetchStaffByDept(deptName));
    }
  }, [person, deptName, dispatch, status]);

  if (status === 'loading') {
    return <div>Loading staff members...</div>;
  }


    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Staff Performance</CardTitle>
                    <CardDescription>
                        Overview of assigned and resolved complaints per staff member.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff ID</TableHead>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Active Complaints</TableHead>
                                <TableHead>Solved Complaints</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          
                            
                               {staffMembers.map(staff => (
                                    <TableRow key={staff.staffId}>
                                        <TableCell className="font-mono">{staff.staffId}</TableCell>
                                        <TableCell className="font-medium">{staff.staffName}</TableCell>
                                        <TableCell>{staff.complaintsAssigned}</TableCell>
                                        <TableCell>{staff.complaintsSolved}</TableCell>
                                    </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
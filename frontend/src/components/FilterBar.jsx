import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../slices/complaintSlice';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const localities = ["shivpuri", "civil lines", "bamrauli", "subedarganj", "phaphamau"];
const statuses = ["completed", "completed_late", "being_processed", "active", "elapsed", "closed"];
const urgencies = ["critical", "high", "average", "low"];
const departments = ["water", "road", "garbage"];

export const FilterBar = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.complaints.filters);
    const role = useSelector(state => state.auth.role);

    const handleCheckboxChange = (filterName, value) => {
        // console.log(`Checkbox clicked! Dispatching: ${filterName}, ${value}`);
        dispatch(setFilter({ filterName, value }));
    };

    const handleSingleValueChange = (filterName, value) => {
        dispatch(setFilter({ filterName, value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filters & Sorting</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

                {/* department filter (only for user)*/}
                {(role === 'user' || role === 'admin') && (
                    <div>
                    <h4 className="font-semibold mb-2">Department</h4>
                    {departments.map(dept => (
                        <div key={dept} className="flex items-center space-x-2 mb-1">
                            <Checkbox
                                id={`dept-${dept}`}
                                checked={filters.department.includes(dept)}
                                onCheckedChange={() => handleCheckboxChange('department', dept)}
                            />
                            <label htmlFor={`dept-${dept}`} className="text-sm capitalize">{dept}</label>
                        </div>
                    ))}
                </div>)}

                {/* Locality Filter */}
                <div>
                    <h4 className="font-semibold mb-2">Locality</h4>
                    {localities.map(loc => (
                        <div key={loc} className="flex items-center space-x-2 mb-1">
                            <Checkbox
                                id={`loc-${loc}`}
                                checked={filters.locality.includes(loc)}
                                onCheckedChange={() => handleCheckboxChange('locality', loc)}
                            />
                            <label htmlFor={`loc-${loc}`} className="text-sm capitalize">{loc}</label>
                        </div>
                    ))}
                </div>

                {/* Status Filter */}
                <div>
                     <h4 className="font-semibold mb-2">Status</h4>
                    {statuses.map(stat => (
                         <div key={stat} className="flex items-center space-x-2 mb-1">
                            <Checkbox
                                id={`stat-${stat}`}
                                checked={filters.status.includes(stat)}
                                onCheckedChange={() => handleCheckboxChange('status', stat)}
                            />
                            <label htmlFor={`stat-${stat}`} className="text-sm capitalize">{stat.replace('_', ' ')}</label>
                        </div>
                    ))}
                </div>

                {/* Urgency Filter */}
                <div>
                    <h4 className="font-semibold mb-2">Urgency</h4>
                    {urgencies.map(urg => (
                         <div key={urg} className="flex items-center space-x-2 mb-1">
                            <Checkbox
                                id={`urg-${urg}`}
                                checked={filters.urgency.includes(urg)}
                                onCheckedChange={() => handleCheckboxChange('urgency', urg)}
                            />
                            <label htmlFor={`urg-${urg}`} className="text-sm capitalize">{urg}</label>
                        </div>
                    ))}
                </div>

                {/* Date Filter */}
                <div className="flex flex-col space-y-2">
                    <h4 className="font-semibold mb-2">Date Range</h4>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.startDate ? format(new Date(filters.startDate), "PPP") : <span>Pick a start date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                                onSelect={(date) => handleSingleValueChange('startDate', date ? format(date, 'yyyy-MM-dd') : null)}
                            />
                        </PopoverContent>
                    </Popover>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.endDate ? format(new Date(filters.endDate), "PPP") : <span>Pick an end date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                             <Calendar
                                mode="single"
                                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                                onSelect={(date) => handleSingleValueChange('endDate', date ? format(date, 'yyyy-MM-dd') : null)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Sort By */}
                <div>
                     <h4 className="font-semibold mb-2">Sort By</h4>
                    <Select value={filters.sortBy} onValueChange={(value) => handleSingleValueChange('sortBy', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select sort order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="urgency_desc">Urgency (High to Low)</SelectItem>
                            <SelectItem value="urgency_asc">Urgency (Low to High)</SelectItem>
                            <SelectItem value="newer">Newest</SelectItem>
                            <SelectItem value="older">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};
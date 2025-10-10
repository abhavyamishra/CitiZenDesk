"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the validation schema using Zod
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  deptName: z.string({ required_error: "Please select a department." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),

});



export function ComplaintCreationForm() {
    const dispatch = useDispatch(); 

    const [isAddressValid, setIsAddressValid] = useState(false);
    const [geocodeStatus, setGeocodeStatus] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const debouncedGeocode = useCallback(
        debounce(async (address) => {
            if (address.length < 10) { /* ... */ return; }
            setGeocodeStatus("Checking address...");
            try {
               
                const response = await axios.post(`${import.meta.VITE_BACKEND_URL}/api/geocode`, { address });
                if (response.data.success) {
                    setGeocodeStatus("✅ Address is valid.");
                    setIsAddressValid(true);
                    setCoordinates(response.data.coordinates); 
                } else {
                    setGeocodeStatus("❌ Address not found.");
                    setIsAddressValid(false);
                }
            } catch (error) {
                setGeocodeStatus("⚠️ Validation service error.");
                setIsAddressValid(false);
            }
        }, 800),
        []
    );

   
    const addressValue = form.watch("address");
    useEffect(() => {
        if (addressValue) {
            debouncedGeocode(addressValue);
        }
    }, [addressValue, debouncedGeocode]);



    async function onSubmit(values) {
      
        const finalComplaintData = {
            ...values,
            userId,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
        };

   
        console.log("Dispatching addComplaint with:", finalComplaintData);
        dispatch(addComplaint(finalComplaintData)); // <<< THE THUNK IS CALLED HERE

       
        form.reset({ title: '', description: '', deptName: '', address: '' });
        setGeocodeStatus("");
        setIsAddressValid(false);
    }
    const userID = useSelector(state => state.auth.id);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>File a New Complaint</CardTitle>
        <span className="text-sm text-muted-foreground">User ID: {userID}</span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Water not coming" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Provide a detailed description of the issue." {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="deptName" render={({ field }) => ( <FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent><SelectItem value="electricity">Road</SelectItem><SelectItem value="waterworks">Water</SelectItem><SelectItem value="publicworks">Garbage</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="e.g., 112 MG Marg, Civil Lines, Prayagraj" {...field} /></FormControl><FormDescription>{geocodeStatus}</FormDescription><FormMessage /></FormItem> )} />
            <FormItem><FormLabel>Media (Optional)</FormLabel><FormControl><Input type="file" onChange={(e) => setMediaFile(e.target.files[0])} /></FormControl></FormItem>
            
            <Button type="submit" disabled={!form.formState.isValid || !isAddressValid}>
              Submit Complaint
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
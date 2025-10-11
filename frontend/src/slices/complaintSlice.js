import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/complaints`;

export const fetchComplaints = createAsyncThunk(
    'complaints/fetchAll',  // createSlice m name hai complaints + action name fetchAll
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addComplaint = createAsyncThunk(
    'complaints/addComplaint',
    async (complaintData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, complaintData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteComplaint = createAsyncThunk(
    'complaints/deleteComplaint',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    items: [
        {
    locality: "indira nagar sardar vallebh chown Civil Lines",
    title: "Broken traffic light at main crossing no green signal no red signal",
    author: "652f47b1e78a3b6e56d0f1a2",
    description: "Traffic signal not working for past 3 days causing jams.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "high",
    startTime: new Date("2025-09-29T09:00:00"),
    resolvedAt: new Date("2025-09-29T16:00:00"),
    durationHours: 73,
    location: { type: "Point", coordinates: [81.8349, 25.4529] },
  },
  {
    locality: "pvr Civil Lines",
    title: "Garbage overflow near restaurant",
    author: "652f47b1e78a3b6e56d0f1a3",
    description: "Waste bins are overflowing creating unhygienic conditions.",
    media: [],
    deptName: "garbage",
    status: "completed_late",
    urgency: "medium",
    startTime: new Date("2025-09-27T10:00:00"),
    resolvedAt: new Date("2025-09-28T18:00:00"),
    durationHours: 33, 
    location: { type: "Point", coordinates: [81.8349, 25.4540] },
  },
  {
    locality: "chauraha chowk Katra",
    title: "Illegal street vendor blocking road",
    author: "652f47b1e78a3b6e56d0f1a4",
    description: "Vendors are causing frequent jams in university area.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "low",
    startTime: new Date("2025-09-20T08:00:00"),
    resolvedAt: new Date("2025-09-20T18:00:00"),
    location: { type: "Point", coordinates: [81.8415, 25.4745] },
  },
  {
    locality: "113 sector N Naini",
    title: "Illegal industrial waste dumping",
    author: "652f47b1e78a3b6e56d0f1a5",
    description: "Toxic waste dumped near river creating pollution hazard.",
    media: [],
    deptName: "garbage",
    status: "closed",
    urgency: "critical",
    startTime: new Date("2025-09-15T10:00:00"),
    resolvedAt: new Date("2025-09-17T10:00:00"),
    location: { type: "Point", coordinates: [81.8907, 25.3996] },
  },
  {
    locality: "shiv mandir Allahpur",
    title: "Water logging after rainfall",
    author: "652f47b1e78a3b6e56d0f1a6",
    description: "Severe waterlogging disrupting daily commute.",
    media: [],
    deptName: "water",
    status: "being_processed",
    urgency: "high",
    startTime: new Date("2025-10-01T11:00:00"),
    location: { type: "Point", coordinates: [81.8653, 25.4718] },
  },
  {
    locality: "water park Kareli",
    title: "Damaged playground equipment",
    author: "652f47b1e78a3b6e56d0f1a7",
    description: "Broken swing and slide posing safety risks to children.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-18T09:00:00"),
    resolvedAt: new Date("2025-09-19T12:00:00"),
    location: { type: "Point", coordinates: [81.8050, 25.4325] },
  },
  {
    locality: "Phaphamau",
    title: "Public water tap damaged",
    author: "652f47b1e78a3b6e56d0f1a8",
    description: "Continuous water leakage from public tap.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "medium",
    startTime: new Date("2025-09-22T07:00:00"),
    resolvedAt: new Date("2025-09-23T16:00:00"),
    location: { type: "Point", coordinates: [81.8538, 25.5341] },
  },
  {
    locality: "Subedarganj",
    title: "Irregular garbage collection",
    author: "652f47b1e78a3b6e56d0f1a9",
    description: "Garbage not collected for the last 5 days.",
    media: [],
    deptName: "garbage",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-25T09:00:00"),
    resolvedAt: new Date("2025-09-26T13:00:00"),
    location: { type: "Point", coordinates: [81.7879, 25.4420] },
  },
  {
    locality: "sector c house no 234 vijaya chowk Bamrauli",
    title: "Potholes near airport road",
    author: "652f47b1e78a3b6e56d0f1b0",
    description: "Deep potholes causing vehicle damage.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "high",
    startTime: new Date("2025-09-10T09:00:00"),
    resolvedAt: new Date("2025-09-11T20:00:00"),
    location: { type: "Point", coordinates: [81.7426, 25.4442] },
  },
  {
    locality: "alla Jhunsi",
    title: "Water contamination issue",
    author: "652f47b1e78a3b6e56d0f1b1",
    description: "Residents complaining of foul-smelling tap water.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "critical",
    startTime: new Date("2025-09-14T08:00:00"),
    resolvedAt: new Date("2025-09-15T22:00:00"),
    location: { type: "Point", coordinates: [81.9333, 25.5539] },
  },
  {
    locality: "George Town",
    title: "Overflowing drainage system",
    author: "652f47b1e78a3b6e56d0f1a2",
    description: "Drainage water overflowing onto main road causing foul smell.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "high",
    startTime: new Date("2025-09-21T08:00:00"),
    resolvedAt: new Date("2025-09-22T18:00:00"),
    location: { type: "Point", coordinates: [81.8480, 25.4650] },
  },
  {
    locality: "Mumfordganj",
    title: "Street lights not working",
    author: "652f47b1e78a3b6e56d0f1a3",
    description: "Entire lane in darkness after 7pm, unsafe for pedestrians.",
    media: [],
    deptName: "road",
    status: "being_processed",
    urgency: "medium",
    startTime: new Date("2025-10-05T19:00:00"),
    location: { type: "Point", coordinates: [81.8540, 25.4705] },
  },
  {
    locality: "Chowk",
    title: "Garbage pile-up near market area",
    author: "652f47b1e78a3b6e56d0f1a4",
    description: "Garbage not collected for 4 days causing hygiene issues.",
    media: [],
    deptName: "garbage",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-24T09:00:00"),
    resolvedAt: new Date("2025-09-24T20:00:00"),
    location: { type: "Point", coordinates: [81.8411, 25.4583] },
  },
  {
    locality: "Teliarganj",
    title: "Sewage water leaking onto street",
    author: "652f47b1e78a3b6e56d0f1a5",
    description: "Open drainage near school creating mosquito breeding zone.",
    media: [],
    deptName: "water",
    status: "completed",
    urgency: "critical",
    startTime: new Date("2025-09-26T07:30:00"),
    resolvedAt: new Date("2025-09-27T16:00:00"),
    location: { type: "Point", coordinates: [81.8650, 25.4930] },
  },
  {
    locality: "Kareli",
    title: "Broken footpath tiles",
    author: "652f47b1e78a3b6e56d0f1a6",
    description: "Pedestrians tripping over loose tiles near park area.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "low",
    startTime: new Date("2025-09-19T09:00:00"),
    resolvedAt: new Date("2025-09-19T18:00:00"),
    location: { type: "Point", coordinates: [81.8075, 25.4315] },
  },
  {
    locality: "Civil Lines",
    title: "Water supply disruption",
    author: "652f47b1e78a3b6e56d0f1a7",
    description: "No water supply since morning in residential area.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "high",
    startTime: new Date("2025-10-02T08:00:00"),
    resolvedAt: new Date("2025-10-03T12:00:00"),
    location: { type: "Point", coordinates: [81.8355, 25.4539] },
  },
  {
    locality: "Katra",
    title: "Illegal hoardings near shops",
    author: "user123",
    description: "Unauthorized advertisements blocking road view.",
    media: [],
    deptName: "road",
    status: "active",
    urgency: "low",
    startTime: new Date("2025-10-25T09:00:00"),
    durationHours: 108,
    location: { type: "Point", coordinates: [81.8420, 25.4740] },
  },
  {
    locality: "Naini",
    title: "Overflowing garbage near factory",
    author: "652f47b1e78a3b6e56d0f1a9",
    description: "Industrial waste mixing with domestic garbage pile.",
    media: [],
    deptName: "garbage",
    status: "completed",
    urgency: "critical",
    startTime: new Date("2025-09-25T08:00:00"),
    resolvedAt: new Date("2025-09-26T15:00:00"),
    location: { type: "Point", coordinates: [81.8912, 25.4002] },
  },
  {
    locality: "Jhunsi",
    title: "Street flooding due to heavy rain",
    author: "652f47b1e78a3b6e56d0f1b0",
    description: "Poor drainage leading to knee-deep water after rain.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "high",
    startTime: new Date("2025-09-23T11:00:00"),
    resolvedAt: new Date("2025-09-24T23:00:00"),
    location: { type: "Point", coordinates: [81.9315, 25.5545] },
  },
  {
    locality: "George Town",
    title: "Potholes after drainage repair",
    author: "652f47b1e78a3b6e56d0f1b1",
    description: "Road left unpatched after maintenance work.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-18T09:00:00"),
    resolvedAt: new Date("2025-09-18T17:00:00"),
    location: { type: "Point", coordinates: [81.8470, 25.4640] },
  },
  {
    locality: "Mumfordganj",
    title: "Garbage burning at night",
    author: "652f47b1e78a3b6e56d0f1a2",
    description: "People burning garbage causing pollution and smell.",
    media: [],
    deptName: "garbage",
    status: "closed",
    urgency: "medium",
    startTime: new Date("2025-09-30T21:00:00"),
    resolvedAt: new Date("2025-10-01T08:00:00"),
    location: { type: "Point", coordinates: [81.8535, 25.4725] },
  },
  {
    locality: "Phaphamau",
    title: "Street sign fallen",
    author: "652f47b1e78a3b6e56d0f1a3",
    description: "Broken street name board lying on footpath.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "low",
    startTime: new Date("2025-09-15T09:00:00"),
    resolvedAt: new Date("2025-09-15T16:00:00"),
    location: { type: "Point", coordinates: [81.8545, 25.5349] },
  },
  {
    locality: "Civil Lines",
    title: "Water leakage near post office",
    author: "652f47b1e78a3b6e56d0f1a4",
    description: "Continuous leakage from pipe onto road surface.",
    media: [],
    deptName: "water",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-27T08:00:00"),
    resolvedAt: new Date("2025-09-27T15:00:00"),
    location: { type: "Point", coordinates: [81.8365, 25.4535] },
  },
  {
    locality: "Kareli",
    title: "Garbage not cleared from park",
    author: "652f47b1e78a3b6e56d0f1a5",
    description: "Park littered with plastic and bottles for 3 days.",
    media: [],
    deptName: "garbage",
    status: "being_processed",
    urgency: "medium",
    startTime: new Date("2025-10-08T09:00:00"),
    location: { type: "Point", coordinates: [81.8062, 25.4335] },
  },
  {
    locality: "Subedarganj",
    title: "Pothole under railway bridge",
    author: "652f47b1e78a3b6e56d0f1a6",
    description: "Large pothole collecting water during rains.",
    media: [],
    deptName: "road",
    status: "completed",
    urgency: "high",
    startTime: new Date("2025-09-19T07:00:00"),
    resolvedAt: new Date("2025-09-19T20:00:00"),
    location: { type: "Point", coordinates: [81.7889, 25.4415] },
  },
  {
    locality: "djgh motilal nehru nit allahabad campus ganga gate Teliarganj",
    title: "Broken drainage cover",
    author: "652f47b1e78a3b6e56d0f1a7",
    description: "Open drain poses accident risk near school.",
    media: [],
    deptName: "water",
    status: "completed_late",
    urgency: "critical",
    startTime: new Date("2025-09-13T08:00:00"),
    resolvedAt: new Date("2025-09-14T20:00:00"),
    location: { type: "Point", coordinates: [81.8662, 25.4940] },
  },
  {
    locality: "Naini",
    title: "Factory noise disturbance",
    author: "652f47b1e78a3b6e56d0f1a8",
    description: "Continuous loud machinery noise disturbing nearby houses.",
    media: [],
    deptName: "road",
    status: "active",
    urgency: "low",
    startTime: new Date("2025-10-09T10:00:00"),
    location: { type: "Point", coordinates: [81.8895, 25.3985] },
  },
  {
    locality: "pilibhit George Town",
    title: "Garbage truck not arriving on schedule",
    author: "652f47b1e78a3b6e56d0f1a9",
    description: "Truck missed collection twice this week.",
    media: [],
    deptName: "garbage",
    status: "completed",
    urgency: "medium",
    startTime: new Date("2025-09-22T09:00:00"),
    resolvedAt: new Date("2025-09-22T15:00:00"),
    location: { type: "Point", coordinates: [81.8478, 25.4648] },
  },
  {
    locality: "ihfdioj ihfiewj oifhjo Jhunsi",
    title: "Broken handpump in colony",
    author: "652f47b1e78a3b6e56d0f1b0",
    description: "Primary water source for colony not functional.",
    media: [],
    deptName: "water",
    status: "active",
    urgency: "high",
    startTime: new Date("2025-10-06T08:00:00"),
    location: { type: "Point", coordinates: [81.9322, 25.5532] },
  },
    ],
    status: 'idle', // completed, completed_late, elapsed, active, being_processed, closed
    error: null,
    filters: {
        department: [],       // Department
        locality: [],
        status: [],
        urgency: [],   
        startDate: null,
        endDate: null,
        sortBy: 'urgency_desc' // default sort
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10 // Default items per page
    }
};

export const complaintSlice = createSlice({
    name: 'complaints',
    initialState,
 
    reducers: {
        complaintAdded: (state, action) => {
            state.items.push(action.payload);
        },
        complaintDeleted: (state, action) => {
            state.items = state.items.filter(complaint => complaint.id !== action.payload);
        },
        setFilter: (state, action) => {
            const { filterName, value } = action.payload;
            if (Array.isArray(state.filters[filterName])) {
                const currentArray = state.filters[filterName];
                if (currentArray.includes(value)) {
                    state.filters[filterName] = currentArray.filter(item => item !== value);
                } else {
                    currentArray.push(value);
                }
            } else {
                state.filters[filterName] = value;
            }
            // page 1 pr aa jao change hone pr
            state.pagination.currentPage = 1;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        complaintUpdated: (state, action) => {
            const updatedComplaint = action.payload; // The full object from the server
            const index = state.items.findIndex(item => item._id === updatedComplaint._id);
            if (index !== -1) {
                // Just replace the old object with the new one
                state.items[index] = updatedComplaint;
            }
        },
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComplaints.pending, (state) => {  
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addComplaint.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.items = state.items.filter(complaint => complaint.id !== action.payload);
            });
    },
});
export const { setFilter, setPagination } = complaintSlice.actions;
export const { complaintAdded, complaintDeleted, complaintUpdated } = complaintSlice.actions;
export default complaintSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-store",
  },
});

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

const handleAsyncError = (error, rejectWithValue) => {
  const errorData = error.response?.data;
  return rejectWithValue({
    message: errorData?.message || "An error occurred",
    details: errorData?.errors || null,
  });
};

// Async Thunks
export const fetchProfile = createAsyncThunk(
  "customerProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/customer/profile");
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const saveProfile = createAsyncThunk(
  "customerProfile/saveProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/customer/profile", profileData);
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const clearProfile = createAsyncThunk(
  "customerProfile/clearProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/customer/profile");
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

const customerProfileSlice = createSlice({
  name: "customerProfile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
    clearProfileState: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload.data;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Save Profile
    builder.addCase(saveProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload.data;
      state.successMessage = action.payload.message;
    });
    builder.addCase(saveProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Clear Profile
    builder.addCase(clearProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(clearProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload.data;
      state.successMessage = action.payload.message;
    });
    builder.addCase(clearProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetProfileState, clearProfileState } = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
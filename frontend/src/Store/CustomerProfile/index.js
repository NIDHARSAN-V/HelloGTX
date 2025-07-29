import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
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

export const fetchProfile = createAsyncThunk(
  "customerProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/customer/profile`);
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
      const { data } = await api.post(`/customer/profile`, profileData);
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
      const { data } = await api.delete(`/customer/profile`);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(clearProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clearProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = null;
        state.successMessage = action.payload.message;
      })
      .addCase(clearProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProfileState } = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
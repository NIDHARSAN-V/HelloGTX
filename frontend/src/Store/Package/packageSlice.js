import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/api/packages");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  "packages/fetchPackageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/packages/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const filterPackages = createAsyncThunk(
  "packages/filterPackages",
  async (tag, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/packages?tag=${tag}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchPackages = createAsyncThunk(
  "packages/searchPackages",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/packages/search?q=${query}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const packageSlice = createSlice({
  name: "packages",
  initialState: {
    packages: [],
    filteredPackages: [],
    currentPackage: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        state.filteredPackages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPackages = action.payload;
      })
      .addCase(filterPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPackages = action.payload;
      })
      .addCase(searchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPackage } = packageSlice.actions;
export default packageSlice.reducer;

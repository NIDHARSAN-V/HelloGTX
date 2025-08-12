// customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  customerData: null,
  exists: false,
  error: null,
  leadData: null,
  employeeLeads: [] // For storing created lead info
};

// ✅ Check customer by email
export const checkCustomerByEmail = createAsyncThunk(
  "customer/checkByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/check-customer",
        { email }
      );
      return {
        exists: response.data.exists,
        customer: response.data.customer || null
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Register new customer
export const registerNewCustomerLead = createAsyncThunk(
  "customer/registerNewCustomerLead",
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/register-new-customer",
        registrationData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create new lead
export const createNewLead = createAsyncThunk(
  "customer/createNewLead",
  async (leadData, { rejectWithValue }) => {
    try {

      console.log(leadData , "Lead data in reducers ")
      const response = await axios.post(
        "http://localhost:8000/api/employee/create-lead",
        leadData
      );
      return response.data; // The created lead object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const getLeadfromEmployee = createAsyncThunk(
  "customer/getLeadfromEmployee",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/get-employee-lead/${employeeId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



const leadSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomerCheck: (state) => {
      state.exists = false;
      state.customerData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check customer by email
      .addCase(checkCustomerByEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkCustomerByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exists = action.payload.exists;
        state.customerData = action.payload.customer;
      })
      .addCase(checkCustomerByEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to check customer";
      })

      // Register new customer
      .addCase(registerNewCustomerLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerNewCustomerLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerData = action.payload;
      })
      .addCase(registerNewCustomerLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to register new customer";
      })

      // Create new lead
      .addCase(createNewLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadData = action.payload;
      })
      .addCase(createNewLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create lead";
      })

           .addCase(getLeadfromEmployee.pending, (state) => {
              state.isLoading = true;
              state.error = null;
            })
            .addCase(getLeadfromEmployee.fulfilled, (state, action) => {
              state.isLoading = false;
              state.employeeLeads = action.payload.leads;
            })
            .addCase(getLeadfromEmployee.rejected, (state, action) => {
              state.isLoading = false;
              state.error = null;
            });
  }
});

export const { resetCustomerCheck } = leadSlice.actions;
export default leadSlice.reducer;

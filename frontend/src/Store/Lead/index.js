// customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  customerData: null,
  exists: false,
  error: null
};





export const checkCustomerByEmail = createAsyncThunk(
  'customer/checkByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/employee/check-customer', { email });
      console.log(response.data.customer);
      return {
        exists: response.data.exists,
        customer: response.data.customer || null
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const registerNewCustomerLead = createAsyncThunk(
  'customer/registerNewCustomerLead',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/employee/register-new-customer',
        registrationData
      );
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);






const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerCheck: (state) => {
      state.exists = false;
      state.customerData = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || 'Failed to check customer';
      });
  }
});

export const { resetCustomerCheck } = customerSlice.actions;
export default customerSlice.reducer;
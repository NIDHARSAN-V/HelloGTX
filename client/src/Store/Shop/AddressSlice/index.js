import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
  isLoading: false,
  addressList: []
};



export const addNewAddress = createAsyncThunk('/addresses/addNewddress', async function (formData) {
  const response = await axios.post("http://localhost:8000/api/shop/address/add", formData);
  return response.data;
});





export const fetchAllAddress = createAsyncThunk('/addresses/fetchAllAddress', async function (userId) {
  const response = await axios.get(`http://localhost:8000/api/shop/address/get/${userId}`);
  return response.data;
});




export const editAddress = createAsyncThunk('/addresses/editAddress', async function ({ userId, addressId, formData }) {
  const response = await axios.put(`http://localhost:8000/api/shop/address/update/${userId}/${addressId}`, formData);
  return response.data;
});





export const deleteAddress = createAsyncThunk('/addresses/deleteAddress', async function ({ userId, addressId }) {
  const response = await axios.delete(`http://localhost:8000/api/shop/address/delete/${userId}/${addressId}`);
  return response.data;
});





const AddressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })


      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });

      
  }
});

export default AddressSlice.reducer;

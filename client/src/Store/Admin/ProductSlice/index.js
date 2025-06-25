
//admin Product slice

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
    isLoading : false , 
    productList : []

}


export  const addNewProduct = createAsyncThunk('/products/addnewproduct' , async function(formData)

{
     const result = await axios.post("http://localhost:8000/api/admin/products/add" , formData ,{
        headers : {
            'Content-Type' : 'application/json'
        }
     })

     return result.data
})


export  const fetchAllProduct = createAsyncThunk('/products/fetchAllProducts' , async function(formData)

{
     const result = await axios.get("http://localhost:8000/api/admin/products/get"  )

     return result.data;
})





export  const editAProduct = createAsyncThunk('/products/editProduct' , async function({id , formData})
{
     const result = await axios.put(`http://localhost:8000/api/admin/products/edit/${id}` , formData )
     return result.data
})






export  const deleteProduct = createAsyncThunk('/products/deleteproduct' , async function(id)

{
     const result = await axios.delete(`http://localhost:8000/api/admin/products/delete/${id}`)

     return result.data
})




const AdminProductSlice = createSlice({
    name :  'adminproducts',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
    
        .addCase(fetchAllProduct.pending ,(state)=>{
            state.isLoading = true
        })
        .addCase(fetchAllProduct.fulfilled ,(state , action)=>{
            state.isLoading = false
            state.productList = action.payload
        })
        .addCase(fetchAllProduct.rejected,(state)=>{
            state.isLoading = false;
            state.productList=[]
            
        })
    }


})


export  default AdminProductSlice.reducer
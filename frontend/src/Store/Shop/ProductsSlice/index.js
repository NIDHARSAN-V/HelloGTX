//User Shopping slice 


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    productList : [],
    productDetails : null
}


export  const fetchAllFilteredProduct = createAsyncThunk('/products/fetchAllProducts' , async function({filterParams ,sortParams })

{
    console.log("In shop slice")
    const query = new URLSearchParams({
        ...filterParams,
        sortBy : sortParams
    })
     const result = await axios.get(`http://localhost:8000/api/shop/products/get?${query}`  )

     return result.data;
})



export  const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails' , async function(id)

{
    
     const result = await axios.get(`http://localhost:8000/api/shop/products/get/${id}`  )

     return result.data;
})


const ShoppingProductSlice = createSlice({
    name : "shoppingProducts",
    initialState,
    reducer:{
        setProductDetails:(state)=>{
            state.productDetails = null
        }
    },
    extraReducers : (builder)=>
    {
       builder.addCase(fetchAllFilteredProduct.pending , (state , action)=>{
        state.isLoading = true;

       })

       .addCase(fetchAllFilteredProduct.fulfilled , (state , action)=>{
        console.log(action.payload , "For Shop FIltered ")
        state.isLoading = false;
        state.productList  = action.payload
        
       })


       .addCase(fetchAllFilteredProduct.rejected , (state , action)=>{
        state.isLoading = false;
        state.productList=[]
        
       })



       .addCase(fetchProductDetails.pending , (state , action)=>{
        state.isLoading = true;
        // state.productList=[]
        
       })
       .addCase(fetchProductDetails.fulfilled , (state , action)=>{
        state.isLoading = false;
        state.productDetails = action.payload.data
        
       })
       .addCase(fetchProductDetails.rejected , (state , action)=>{
        state.isLoading = false;
        state.productDetails=null
        
       })
    
    }

})

export const {setProductDetails} = ShoppingProductSlice.actions
export default ShoppingProductSlice.reducer
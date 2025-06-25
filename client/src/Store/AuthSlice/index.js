//Auth Slice

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    isAuthenticated:false,
    isLoading : true,
    user : null
}

export const registerUser = createAsyncThunk("/auth/register" , 
    async function(formData)
    {
        console.log("In register Auth Slice")
       const response = await axios.post('http://localhost:8000/api/auth/register' , formData,
       {
       withCredentials:true,
       })
console.log("In registerUser Auth Slicer")
       console.log(response.data)
       return response.data
    }
)



export const loginUser = createAsyncThunk("/auth/login" , 
    async function(formData)
    {
        console.log("In Login Auth Slice")
       const response = await axios.post('http://localhost:8000/api/auth/login' , formData,
       {
       withCredentials:true,
       })
console.log("In LoginUser Auth Slicer")
       console.log(response.data)
       return response.data
    }
)



export const logoutUser = createAsyncThunk("/auth/logout" , 
    async function()
    {
        console.log("In Login Auth Slice")
       const response = await axios.get('http://localhost:8000/api/auth/logout',
       {
       withCredentials:true,
       })
console.log("In LogOut Auth Slicer")
       console.log(response.data)
       return response.data
    }
)




export const checkAuth = createAsyncThunk("/auth/checkauth" , 
    async function()
    {
   
       const response = await axios.get('http://localhost:8000/api/auth/check-auth' ,
       {
       withCredentials:true,
       headers:{
        'Cache-Control' : 'no-store , no-cache , must-validate , proxy-revalidate '
       }
       })
console.log("CheckAuth Auth Slicer")
       console.log(response.data)
       return response.data
    }
)





const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
         setUser:function(state  , action)
         {
               ///default state and action 
         }
    },
    extraReducers:(builder)=> {
        builder.addCase(registerUser.pending , (state)=>{
            state.isLoading = true
        })
        
        .addCase(registerUser.fulfilled, (state , action)=>
        {
            state.isLoading = false
            state.user  = null
            state.isAuthenticated = false
        })
        
        .addCase(registerUser.rejected, (state , action)=>
            {
                state.isLoading = false
                state.user  = null
                state.isAuthenticated = false
            })
           
            

        
        .addCase(loginUser.pending , (state)=>{
                state.isLoading = true
            })
            
        .addCase(loginUser.fulfilled, (state , action)=>
            {
                console.log("Login Fullfilled " , action)
                state.isLoading = false
                state.user  = action.payload.success  ?  action.payload.user : null 
                state.isAuthenticated = action.payload.success  ? true : false
            })
            
        .addCase(loginUser.rejected, (state , action)=>
                {
                    state.isLoading = false
                    state.user  = null
                    state.isAuthenticated = false
                })




                .addCase(checkAuth.pending, (state) => {
                    state.isLoading = true;
                  })
                  .addCase(checkAuth.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.user = action.payload.success ? action.payload.user : null;
                    state.isAuthenticated = action.payload.success;
                  })
                  .addCase(checkAuth.rejected, (state, action) => {
                    state.isLoading = false;
                    state.user = null;
                    state.isAuthenticated = false;
                  })

                  .addCase(logoutUser.fulfilled , (state,action)=>
                {
                state.isLoading = false
                state.user=null;
                state.isAuthenticated = false
                })








    
 
    }

})



export const {setUser} = authSlice.actions;
export default authSlice.reducer;

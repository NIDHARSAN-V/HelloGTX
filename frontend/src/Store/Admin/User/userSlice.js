// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // Create configured Axios instance
// const api = axios.create({
//   baseURL: "http://localhost:8000/api/admin",
//   withCredentials: true, // For cookie-based auth
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Async Thunks
// export const fetchUsers = createAsyncThunk(
//   "users/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/users");
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const fetchUserById = createAsyncThunk(
//   "users/fetchUserById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/users/${id}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const updateUserRole = createAsyncThunk(
//   "users/updateUserRole",
//   async ({ id, role }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/users/${id}/role`, { role });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const updateUser = createAsyncThunk(
//   "users/updateUser",
//   async ({ id, userData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/users/${id}`, userData);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   "users/deleteUser",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/users/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const searchUsers = createAsyncThunk(
//   "users/searchUsers",
//   async (searchTerm, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/users?search=${searchTerm}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   users: [],
//   filteredUsers: [],
//   currentUser: null,
//   loading: false,
//   error: null,
// };

// // Slice
// const userSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {
//     clearCurrentUser: (state) => {
//       state.currentUser = null;
//     },
//     clearUsersError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     const handlePending = (state) => {
//       state.loading = true;
//       state.error = null;
//     };

//     const handleRejected = (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     };

//     builder
//       .addCase(fetchUsers.pending, handlePending)
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//         state.filteredUsers = action.payload;
//       })
//       .addCase(fetchUsers.rejected, handleRejected)

//       .addCase(fetchUserById.pending, handlePending)
//       .addCase(fetchUserById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentUser = action.payload;
//       })
//       .addCase(fetchUserById.rejected, handleRejected)

//       .addCase(updateUserRole.pending, handlePending)
//       .addCase(updateUserRole.fulfilled, (state, action) => {
//         state.loading = false;
//         updateUserState(state, action.payload);
//       })
//       .addCase(updateUserRole.rejected, handleRejected)

//       .addCase(updateUser.pending, handlePending)
//       .addCase(updateUser.fulfilled, (state, action) => {
//         state.loading = false;
//         updateUserState(state, action.payload);
//       })
//       .addCase(updateUser.rejected, handleRejected)

//       .addCase(deleteUser.pending, handlePending)
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = state.users.filter((user) => user._id !== action.payload);
//         state.filteredUsers = state.filteredUsers.filter(
//           (user) => user._id !== action.payload
//         );
//         if (state.currentUser?._id === action.payload) {
//           state.currentUser = null;
//         }
//       })
//       .addCase(deleteUser.rejected, handleRejected)

//       .addCase(searchUsers.pending, handlePending)
//       .addCase(searchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.filteredUsers = action.payload;
//       })
//       .addCase(searchUsers.rejected, handleRejected);
//   },
// });

// // Helper function to update user state
// function updateUserState(state, payload) {
//   state.users = state.users.map((user) =>
//     user._id === payload._id ? payload : user
//   );
//   state.filteredUsers = state.filteredUsers.map((user) =>
//     user._id === payload._id ? payload : user
//   );
//   if (state.currentUser?._id === payload._id) {
//     state.currentUser = payload;
//   }
// }

// export const { clearCurrentUser, clearUsersError } = userSlice.actions;
// export default userSlice.reducer;

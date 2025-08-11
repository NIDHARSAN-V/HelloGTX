// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Async Thunks
// export const registerEmployee = createAsyncThunk(
//   'employees/register',
//   async (employeeData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/admin/register', employeeData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchAllEmployees = createAsyncThunk(
//   'employees/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/employees');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchEmployeeById = createAsyncThunk(
//   'employees/fetchById',
//   async (employeeId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/employees/${employeeId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const updateEmployeeDetails = createAsyncThunk(
//   'employees/update',
//   async ({ id, employeeData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`/api/employees/${id}`, employeeData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deactivateEmployee = createAsyncThunk(
//   'employees/deactivate',
//   async (employeeId, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`/api/employees/${employeeId}/deactivate`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Slice
// const employeeSlice = createSlice({
//   name: 'employees',
//   initialState: {
//     employees: [],
//     currentEmployee: null,
//     loading: false,
//     error: null,
//     success: false,
//     registerStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     fetchStatus: 'idle',
//     updateStatus: 'idle',
//   },
//   reducers: {
//     resetEmployeeState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//       state.registerStatus = 'idle';
//       state.fetchStatus = 'idle';
//       state.updateStatus = 'idle';
//     },
//     clearCurrentEmployee: (state) => {
//       state.currentEmployee = null;
//     },
//     // Manual employee addition (for testing/demo purposes)
//     addEmployeeManually: (state, action) => {
//       state.employees.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register Employee
//       .addCase(registerEmployee.pending, (state) => {
//         state.loading = true;
//         state.registerStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(registerEmployee.fulfilled, (state, action) => {
//         state.loading = false;
//         state.registerStatus = 'succeeded';
//         state.employees.push(action.payload.data.employee);
//         state.success = true;
//       })
//       .addCase(registerEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.registerStatus = 'failed';
//         state.error = action.payload?.message || action.error.message;
//       })

//       // Fetch All Employees
//       .addCase(fetchAllEmployees.pending, (state) => {
//         state.loading = true;
//         state.fetchStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchAllEmployees.fulfilled, (state, action) => {
//         state.loading = false;
//         state.fetchStatus = 'succeeded';
//         state.employees = action.payload.data;
//       })
//       .addCase(fetchAllEmployees.rejected, (state, action) => {
//         state.loading = false;
//         state.fetchStatus = 'failed';
//         state.error = action.payload?.message || action.error.message;
//       })

//       // Fetch Employee By ID
//       .addCase(fetchEmployeeById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEmployeeById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentEmployee = action.payload.data;
//       })
//       .addCase(fetchEmployeeById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || action.error.message;
//       })

//       // Update Employee
//       .addCase(updateEmployeeDetails.pending, (state) => {
//         state.loading = true;
//         state.updateStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(updateEmployeeDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.updateStatus = 'succeeded';
//         state.currentEmployee = action.payload.data;
//         state.employees = state.employees.map(emp => 
//           emp._id === action.payload.data._id ? action.payload.data : emp
//         );
//         state.success = true;
//       })
//       .addCase(updateEmployeeDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.updateStatus = 'failed';
//         state.error = action.payload?.message || action.error.message;
//       })

//       // Deactivate Employee
//       .addCase(deactivateEmployee.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deactivateEmployee.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = state.employees.filter(
//           emp => emp._id !== action.meta.arg
//         );
//         if (state.currentEmployee?._id === action.meta.arg) {
//           state.currentEmployee = null;
//         }
//         state.success = true;
//       })
//       .addCase(deactivateEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || action.error.message;
//       });
//   },
// });

// export const { resetEmployeeState, clearCurrentEmployee, addEmployeeManually } = employeeSlice.actions;

// export default employeeSlice.reducer;





import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const registerEmployee = createAsyncThunk(
  'employees/register',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/admin/register', employeeData);
      return response.data; // Ensure your backend returns { data: { employee: {...} } }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/employees');
      return response.data; // Ensure this returns { data: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/employees/${employeeId}`);
      return response.data; // Ensure this returns { data: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const updateEmployeeDetails = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/employees/${id}`, employeeData);
      return response.data; // Ensure this returns { data: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deactivateEmployee = createAsyncThunk(
  'employees/deactivate',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/employees/${employeeId}/deactivate`);
      return response.data; // Ensure this returns { data: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    currentEmployee: null,
    loading: false,
    error: null,
    success: false,
    registerStatus: 'idle',
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  reducers: {
    resetEmployeeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registerStatus = 'idle';
      state.fetchStatus = 'idle';
      state.updateStatus = 'idle';
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    addEmployeeManually: (state, action) => {
      state.employees.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Employee
      .addCase(registerEmployee.pending, (state) => {
        state.loading = true;
        state.registerStatus = 'loading';
        state.error = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.registerStatus = 'succeeded';
        // Modified to handle different response structures
        const newEmployee = action.payload?.data?.employee || action.payload?.employee || action.payload;
        if (newEmployee) {
          state.employees.push(newEmployee);
        }
        state.success = true;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.loading = false;
        state.registerStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      // Fetch All Employees
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchStatus = 'succeeded';
        // Modified to handle different response structures
        state.employees = action.payload?.data || action.payload || [];
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.fetchStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      // Fetch Employee By ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        // Modified to handle different response structures
        state.currentEmployee = action.payload?.data || action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // Update Employee
      .addCase(updateEmployeeDetails.pending, (state) => {
        state.loading = true;
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateEmployeeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'succeeded';
        // Modified to handle different response structures
        const updatedEmployee = action.payload?.data || action.payload;
        if (updatedEmployee) {
          state.currentEmployee = updatedEmployee;
          state.employees = state.employees.map(emp => 
            emp._id === updatedEmployee._id ? updatedEmployee : emp
          );
        }
        state.success = true;
      })
      .addCase(updateEmployeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.updateStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      // Deactivate Employee
      .addCase(deactivateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const employeeId = action.meta.arg;
        state.employees = state.employees.filter(emp => emp._id !== employeeId);
        if (state.currentEmployee?._id === employeeId) {
          state.currentEmployee = null;
        }
        state.success = true;
      })
      .addCase(deactivateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { resetEmployeeState, clearCurrentEmployee, addEmployeeManually } = employeeSlice.actions;

export default employeeSlice.reducer;
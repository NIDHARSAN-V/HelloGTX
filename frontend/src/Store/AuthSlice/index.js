import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  otp: {
    sent: false,
    verified: false,
    email: null,
  },
  passwordReset: {
    emailSent: false,
    verified: false,
    email: null,
  },
  passwordReset: {
    emailSent: false,
    verified: false,
    email: null,
  },
  error: null,
};

// API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-store",
  },
});

// Helper function to handle errors
const handleAsyncError = (error, rejectWithValue) => {
  const errorData = error.response?.data;
  return rejectWithValue({
    message: errorData?.message || "An error occurred",
    details: errorData?.errors || null,
  });
};

// Register User - Step 1: Send OTP
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Verify Registration OTP - Step 2
export const verifyRegistrationOTP = createAsyncThunk(
  "auth/verifyRegistrationOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      console.log("OTP Verification Data:", { email, otp });
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/logout");
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Check Authentication Status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/check-auth");
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Forgot Password - Send OTP
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

// Reset Password with OTP Verification
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.otp = initialState.otp;
      state.error = null;
    },
    resetPasswordResetState: (state) => {
      state.passwordReset = initialState.passwordReset;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetPasswordResetState: (state) => {
      state.passwordReset = initialState.passwordReset;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otp = {
          sent: true,
          verified: false,
          email: action.meta.arg.email,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify Registration OTP
      .addCase(verifyRegistrationOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyRegistrationOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otp = {
          ...state.otp,
          verified: true,
        };
      })
      .addCase(verifyRegistrationOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        console.log(state.user)
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check Authentication
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordReset = {
          emailSent: true,
          verified: false,
          email: action.meta.arg,
        };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordReset = {
          ...state.passwordReset,
          verified: true,
        };
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetOtpState,
  resetPasswordResetState,
  clearError,
  setAuthLoading,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.error;
export const selectOtpState = (state) => state.auth.otp;
export const selectPasswordResetState = (state) => state.auth.passwordReset;

export default authSlice.reducer;

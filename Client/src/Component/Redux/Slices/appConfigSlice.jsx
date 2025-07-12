import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../../Utlits/axiosClient";

export const getmyinfo = createAsyncThunk("user/getmyinfo", async () => {
  try {
    const response = await axiosClient.get("/user/getmyinfo");
    return response.result;
  } catch (error) {
    Promise.reject(error);
  }
});
export const updateMyProfile = createAsyncThunk(
  "user/updatemyprofile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user", body);
      return response.result;
    } catch (error) {
      Promise.reject(error);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData: {},
    myProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getmyinfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigSlice.reducer;
export const { setLoading, showToast } = appConfigSlice.actions;

import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { axiosClient } from "../../../Utlits/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getuserprofile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getuserprofile", body);
      return response.result;
    } catch (error) {
      Promise.reject(error);
    }
  }
);

export const likeORUnlikePost = createAsyncThunk(
  "post/like",
  async (body, ThunkAPI) => {
    try {
      const response = await axiosClient.post("post/likes", body);
      return response.result;
    } catch (error) {
    } finally {
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likeORUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id == post._id
        );
        console.log(index, post);

        if (index != undefined && index != -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postsSlice.reducer;

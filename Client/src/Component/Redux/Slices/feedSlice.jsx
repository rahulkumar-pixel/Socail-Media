import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { axiosClient } from "../../../Utlits/axiosClient";
import { likeORUnlikePost } from "./postsSlice";

export const getUserFeed = createAsyncThunk(
  "user/getuserfeeddashboard",
  async () => {
    try {
      const response = await axiosClient.get("/user/getfeeddashboard");
      return response.result;
    } catch (error) {
      Promise.reject(error);
    }
  }
);
export const followUnfollowUser = createAsyncThunk(
  "user/followUnfollow",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/follow", body);
      return response.result;
    } catch (error) {
      Promise.reject(error);
    }
  }
);

const UserFeedSlice = createSlice({
  name: "UserFeed",
  initialState: {
    myFeed: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserFeed.fulfilled, (state, action) => {
        state.myFeed = action.payload;
      })
      .addCase(likeORUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.myFeed?.posts?.findIndex(
          (items) => items._id == post._id
        );
        if (index != undefined && index != -1) {
          state.myFeed.posts[index] = post;
        }
      })
      .addCase(followUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;
        const index = state?.myFeed?.followings?.findIndex(
          (items) => items._id == user._id
        );
        if (index != undefined && index != -1) {
          state?.myFeed?.followings?.splice(index, 1);
        } else {
          state?.myFeed?.followings?.push(user);
        }
      });
  },
});

export default UserFeedSlice.reducer;

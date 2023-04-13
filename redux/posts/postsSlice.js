import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "./postsOperations";

const state = {
  posts: [],
};
export const postSlice = createSlice({
  name: "post",
  initialState: state,
  extraReducers: (builder) =>
    builder.addCase(getAllPosts.fulfilled, (state, { payload }) => {
    }),
});

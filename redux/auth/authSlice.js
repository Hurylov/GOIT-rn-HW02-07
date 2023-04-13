import { createSlice } from "@reduxjs/toolkit";
import { logOut, signIn, signUp, updateUserStatus } from "./authOperations";
const state = {
  isLoggedIn: false,
  isLoading: false,
  userData: {
    id: null,
    photo: null,
    name: null,
    email: null,
  },
};
export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  extraReducers: (builder) =>
    builder
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.userData.id = payload.uid;
        state.userData.photo = payload.photo;
        state.userData.name = payload.name;
        state.userData.email = payload.email;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(signUp.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(signUp.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.userData.id = payload.uid;
        state.userData.photo = payload.photo;
        state.userData.name = payload.name;
        state.userData.email = payload.email;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(signIn.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(signIn.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateUserStatus.fulfilled, (state, { payload }) => {
        state.userData.id = payload.uid;
        state.userData.photo = payload.photo;
        state.userData.name = payload.name;
        state.userData.email = payload.email;
        state.isLoggedIn = payload.isLoggedIn;
        state.isLoading = false;
      })
      .addCase(updateUserStatus.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(updateUserStatus.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(logOut.fulfilled, () => ({
        ...state,
      }))
      .addCase(logOut.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(logOut.rejected, (state, { payload }) => {
        state.isLoading = false;
      }),
});

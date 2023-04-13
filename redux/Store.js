import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { postSlice } from "./posts/postsSlice";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [postSlice.name]: postSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

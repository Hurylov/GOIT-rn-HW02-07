import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase/config";
import uploadAvatarImg from "../../firebase/uploadAvatarImg";
import { Toast } from "toastify-react-native";

export const signUp = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const newUser = await auth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );
      const newUserData = newUser.user;
      const photoUrl = await uploadAvatarImg(userData.photo, newUserData.uid);

      await newUserData.updateProfile({
        displayName: userData.name,
        photoURL: photoUrl,
      });

      return {
        uid: newUserData.uid,
        photo: photoUrl,
        name: userData.name,
        email: newUserData.email,
      };
    } catch (error) {
      Toast.error(`${error.code}`);
      return rejectWithValue(error);
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password } = userData;
      const user = await auth.signInWithEmailAndPassword(email, password);
      return {
        uid: user.user.uid,
        photo: user.user.photoURL,
        name: user.user.displayName,
        email: user.user.email,
      };
    } catch (error) {
      Toast.error(`${error.code}`);
      return rejectWithValue(error);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "auth/updateUserStatus",
  async (_, { rejectWithValue }) => {
    try {
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          resolve(user);
        }, reject);
      });

      if (user) {
        const currentUser = {
          uid: user.uid,
          photo: user.photoURL,
          email: user.email,
          name: user.displayName,
        };
        return { ...currentUser, isLoggedIn: true };
      } else {
        return { currentUser: null, isLoggedIn: false };
      }
    } catch (error) {
      Toast.error(`${error.code}`);
      return rejectWithValue(error);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async () => {
  try {
    await auth.signOut();
  } catch (error) {
    Toast.error(`${error.code}`);
    return rejectWithValue(error);
  }
});

export const updatePhoto = createAsyncThunk(
  "auth/updatePhoto",
  async (photo, { getState, rejectWithValue }) => {
    try {
      const { uid } = getState().auth.currentUser;
      const photoUrl = await uploadAvatarImg(photo, uid);
      await auth.currentUser.updateProfile({
        photoURL: photoUrl,
      });
      return photoUrl;
    } catch (error) {
      Toast.error(`${error.code}`);
      return rejectWithValue(error);
    }
  }
);

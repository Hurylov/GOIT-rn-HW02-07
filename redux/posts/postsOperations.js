import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";

export const addPost = createAsyncThunk(
  "posts/add",
  async (postData, { rejectWithValue }) => {
    try {
      await db.collection("posts").add(postData);
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (setPosts, { rejectWithValue }) => {
    try {
      await db.collection("posts").onSnapshot((snapshot) => {
        const allPosts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          postId: doc.id,
        }));
        setPosts(allPosts);
      });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (commentData, { rejectWithValue }) => {
    try {
      await db
        .collection("posts")
        .doc(commentData.postId)
        .collection("comments")
        .add({ ...commentData });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "posts/getAllComments",
  async (getCommentsData, { rejectWithValue }) => {
    const { postId, setComments } = getCommentsData;
    try {
      await db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          const allComments = snapshot.docs.map((doc) => ({
            ...doc.data(),
            commentId: doc.id,
          }));
          setComments(allComments);
        });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getNumberOfComments = createAsyncThunk(
  "posts/getNumberOfComments",
  async (commentsArrData, { rejectWithValue }) => {
    const { posts, setCommentsNumObj } = commentsArrData;
    try {
      posts.forEach((post) => {
      db.collection("posts")
        .doc(post.postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          const allCommentsByPostId = snapshot.docs.map((doc) => ({
            ...doc.data(),
            commentId: doc.id,
          }));
          setCommentsNumObj((prevState) => ({
            ...prevState,
            [post.postId]: allCommentsByPostId.length,
          }));
        });
    });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


// userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
  // add other fields your backend returns
}

export interface Follower {
  follower_id: number;
}

export interface Following {
  following_id: number;
}

export interface Post {
  id: number;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

interface UserState {
    user: User | null;
    followers: Follower[];
    followings: Following[];
    posts: Post[];
    notifications: Notification[];
}

const initialState: UserState = {
  user: null,
  followers: [],
  followings: [],
  posts: [],
  notifications: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setFollowers(state, action: PayloadAction<Follower[]>) {
      state.followers = action.payload;
    },
    setFollowings(state, action: PayloadAction<Following[]>) {
      state.followings = action.payload;
    },
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    logOut(state) {
      state.user = null;
      state.followers = [];
      state.followings = [];
      state.posts = [];
      state.notifications = [];
    }
  },
});

export const { setUser, setFollowers, setFollowings, setPosts, setNotifications, logOut } = userSlice.actions;
export default userSlice.reducer;

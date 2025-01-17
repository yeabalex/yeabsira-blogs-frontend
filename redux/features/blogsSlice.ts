import { createSlice } from "@reduxjs/toolkit";

type Article = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  content: string;
  topics: string[];
  likes: number;
  views: number;
  comments: number;
  username: string;
  userid: string;
  createdAt: string;
  updatedAt: string;
};

const initialState: { blog: Article[] | null } = {
  blog: null,
};

export const blogsSlice = createSlice({
  name: "blogSlice",
  initialState,
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
  },
});


export const { setBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
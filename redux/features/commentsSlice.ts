import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Comment } from "@/components/article-page/comment";

interface CommentsState {
  comments: Comment[]; // Array of comments
  isLoading: boolean;  // Loading state
  error: string | null; // Error state
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },

  },
});

// Export actions
export const {
  addComment,
} = commentsSlice.actions;

// Export reducer
export default commentsSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"
import blogReducer from "./features/blogsSlice"
import commentsReducer from "./features/commentsSlice"
import aiSummaryReducer from "./features/aiSummarySlice"

export const store = configureStore({
    reducer:{
        userReducer,
        blogReducer,
        commentsReducer,
        aiSummaryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
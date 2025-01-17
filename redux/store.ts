import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"
import blogReducer from "./features/blogsSlice"

export const store = configureStore({
    reducer:{
        userReducer,
        blogReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
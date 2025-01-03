import { createSlice } from "@reduxjs/toolkit";


type User = {
    token:string | null,
    user:{
      id:string | null,
      username:string | null,
      email:string | null
    }|null
  }

  const initialState: { userData: User } = {
    userData: {
      token: null,
      user:{
        email:null,
        id:null,
        username:null
      }
    },
  };
  
  export const userSlcie = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.userData = action.payload;
      },
    },
  });
  
  export const { setUser } = userSlcie.actions;
  export default userSlcie.reducer;
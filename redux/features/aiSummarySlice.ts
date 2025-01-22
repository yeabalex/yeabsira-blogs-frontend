import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AISummaryProp } from "@/components/article-page/ai-summary";

interface AISummaryState {
  summaries: AISummaryProp[]; 
  isLoading: boolean;         
  error: string | null;      
}

const initialState: AISummaryState = {
  summaries: [],
  isLoading: false,
  error: null,
};

const aiSummarySlice = createSlice({
  name: "aiSummary",
  initialState,
  reducers: {
    addSummary(state, action: PayloadAction<AISummaryProp>) {
      state.summaries.push(action.payload);
    },
  },
});

export const {
  addSummary,
} = aiSummarySlice.actions;

export default aiSummarySlice.reducer;

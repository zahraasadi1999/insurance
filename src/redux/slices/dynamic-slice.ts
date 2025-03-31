import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

// Properly typed initial state
const initialState = {
  resault: [], // Initialize as empty array
};

const dynamicSlice = createSlice({
  name: "dynamic",
  initialState,
  reducers: {
    setDynamicData: (state, action: PayloadAction<any>) => {
      state.resault = action.payload;
    },

    // Add more reducers as needed
  },
});

// Selector
export const selectDynamicData = (state: RootState) => state.dynamic;

// Actions
export const { setDynamicData } = dynamicSlice.actions;

// Reducer
export default dynamicSlice.reducer;

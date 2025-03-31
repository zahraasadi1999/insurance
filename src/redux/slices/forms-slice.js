import { createSlice } from "@reduxjs/toolkit";
import setDataReducer from "../global-reducers/global";
import { forms } from "../../configs/constants";

const initialState = {
  resault: {},
};

Object.keys(forms).forEach((key) => {
  initialState[key] = {
    isDirty: false,
  };
});

export const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setData: setDataReducer,
    setDefaultData: (state, action) => {
      state.resault = action.payload;
    },
  },
});

export const { setData, setDefaultData } = formsSlice.actions;
export default formsSlice.reducer;

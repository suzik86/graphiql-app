import { createSlice } from "@reduxjs/toolkit";

export const initialState = {};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /*
    setPersonalDataReactHookForm(state, action: PayloadAction<FormTypes>) {
     
    },
   */
  },
});

// export const {
//   //setPersonalDataReactHookForm
// } = appSlice.actions;

export default appSlice.reducer;

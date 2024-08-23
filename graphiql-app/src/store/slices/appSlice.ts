import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
interface AppState {
  
}

export const initialState: AppState = {
 
};
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
export const { 
  //setPersonalDataReactHookForm 

 } =
  appSlice.actions;
export default appSlice.reducer;
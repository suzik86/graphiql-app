import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import graphiqlSlice from "./slices/graphiql/graphiqlSlice";

export const rootReducer = combineReducers({
  appSlice: appSlice,
  graphiqlSlice: graphiqlSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

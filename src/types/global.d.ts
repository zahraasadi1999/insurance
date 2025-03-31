import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

declare global {
  type DispatchType = ThunkDispatch<RootState, undefined, AnyAction>;
}

import {
  AnyAction,
  combineReducers,
  configureStore,
  Dispatch,
  Middleware,
} from "@reduxjs/toolkit";
import * as storage from "redux-storage";
import createEngine from "redux-storage-engine-localstorage";
import filter from "redux-storage-decorator-filter";
import insurance from "./slices/insurance-slice";
import forms from "./slices/forms-slice";
import dynamic from "./slices/dynamic-slice";
// Create a storage engine
let engine = createEngine("redux-storage-key");

// Fix incorrect filtering format and spelling issue
engine = filter(engine, [["insurance"], ["dynamic"], ["forms"]]);

// Explicitly type the storage middleware using the defined RootState
const storageMiddleware: Middleware<
  {},
  RootState,
  Dispatch<AnyAction>
> = storage.createMiddleware(engine) as Middleware<
  {},
  RootState,
  Dispatch<AnyAction>
>;

// Wrap the root reducer with `redux-storage`'s reducer wrapper
const rootReducer = storage.reducer(
  combineReducers({
    insurance,
    dynamic,
    forms,
  })
);

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).concat(storageMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Debugging logs
engine.load().then((loadedState) => {
  if (loadedState) {
    store.dispatch({ type: storage.LOAD, payload: loadedState });
  }
});

store.subscribe(() => {});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

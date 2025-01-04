import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  //persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./userSlice";
import jobSlice from "./JobSlice.js";
import companySlice from "./companySlice.js";
import applicationSlice from "./applicationSlice.js";

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const rootReducer = combineReducers({
    user: userSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  // gán persistedReducer là 1 reducer chính cho store -> redux-persist tự động xử lý việc lưu trữ, khôi phục state tự động
  reducer: persistedReducer,
  middleware: ( 
    getDefaultMiddleware // getDefaultMiddleware lấy middle mặc định của redux-toolkit
  ) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ // bỏ qua các actions này
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});
export default store

import { configureStore } from '@reduxjs/toolkit'

import { counterReducer } from '~/redux/counter/counterSlice'
import { userReducer } from '~/redux/user/userSlice'
import cartReducer from '~/redux/cart/cartSlice'
// Cấu hình redux-persist
import { combineReducers } from 'redux' // Lưu ý chúng ta đã có sẵn redux trong node_modules bởi vì khi cài @reduxjs/toolkit là đã có luôn
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Default là localstorage

const rootPersisConfig = {
  key: 'root', // Key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ['user', 'cart'] // Định nghĩa các slice  ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // backlist: ['user'] // Định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  counter: counterReducer,
  user: userReducer,
  cart: cartReducer
})

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersisConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  //   Fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})

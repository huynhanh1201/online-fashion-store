import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentValueCounter: 0
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middeware createAsyncThunk đi kèm với extraReducers.

// Khởi tạo một Slice trong kho lưu trữ - Redux Store
export const counterSlice = createSlice({
  name: 'counter',
  initialState,

  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  // extraReducers: (builder) => {
  //   builder.addCase()
  // }
})

// Action creators are generated for each case reducer function
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const currentValueCounter = (state) => state.counter.currentValueCounter

// Cái file này tên là counterSlice NHƯNG  chúng ta sẽ export một thứ tên là Reducer, mọi người lưu ý :D
// export default counterSlice.reducer
export const counterReducer = counterSlice.reducer

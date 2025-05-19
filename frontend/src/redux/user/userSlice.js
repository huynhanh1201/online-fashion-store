import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'
import { toast } from 'react-toastify'

// Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentUser: null
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middeware createAsyncThunk đi kèm với extraReducers.
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/auth/login`,
      data
    )

    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/auth/logout`
    )

    if (showSuccessMessage) {
      toast.success('Đăng xuất thành công!')
    }

    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (updatedData, { rejectWithValue }) => {
    try {
      // Lấy các trường được phép gửi lên
      const { name, avatarUrl } = updatedData
      const payload = { name }
      if (avatarUrl) payload.avatarUrl = avatarUrl

      const response = await authorizedAxiosInstance.patch(
        `${API_ROOT}/v1/users/profile`,
        payload
      )
      return response.data
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Lỗi không xác định'
      toast.error(`Cập nhật thất bại: ${message}`)
      return rejectWithValue(message)
    }
  }
)

// Khởi tạo một Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,

  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload

      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js code điều hướng chuẩn về trang Home
       * */

      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
  }
})

// Action creators are generated for each case reducer function
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
// export const {} = userSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => state.user.currentUser

// Cái file này tên là counterSlice NHƯNG  chúng ta sẽ export một thứ tên là Reducer, mọi người lưu ý :D
// export default counterSlice.reducer
export const userReducer = userSlice.reducer

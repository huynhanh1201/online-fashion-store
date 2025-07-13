import axios from 'axios'
import { toast } from 'react-toastify'

import { interceptorLoadingElement } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import (store) from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phàm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên code sẽ chạy vào main.jsx đầu tiên từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
 * */

// eslint-disable-next-line no-unused-vars
let axiosReduxStore
export const injectStore = (mainStore) => (axiosReduxStore = mainStore)

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000

// withCrendentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (phục vụ trong trường hợp nếu chúng ta sử dụng JWT tokens (refresh & access ) theo cơ chế httpOnly Cookie
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptors (Bộ đánh chặn vào giữa Request và Response)

// Add a request interceptor: Can thiệp vào giữa các Request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click (xem mô tả ở file formatters chứa function)
    interceptorLoadingElement(true)

    // Lấy accessToken từ localstorage và đính kèm vào header
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      // Cần thêm "Bearer" vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
      // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như: Basic token, Digest token, OAuth token,...
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Khởi tạo một cái promise cho việc gọi API refresh_token
// Mục đích tạo Promise này để khi nào gọi API refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.

let refreshTokenPromise = null

// Add a response interceptor: Can thiệp vào giữa các Response nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click (xem mô tả ở file formatters chứa function)
    interceptorLoadingElement(false)

    // Any status code that lie within the range of 2xx cause this function to trigger
    //  Mọi mã http status code nằm trong khoảng 200 - 299 sẽ là success và rơi vào đây
    // Do something with response data
    return response
  },
  (error) => {
    // Kỹ thuật chặn spam click (xem mô tả ở file formatters chứa function)
    interceptorLoadingElement(false)

    /** Quan trọng: Xử lý Refresh Token tự động*/
    // Trường hợp 1: Nếu như nhận mã 401 từ BE thì gọi API đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Trường hợp 2: Nếu như nhận mã 410 từ BE thì sẽ gọi API refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config

    const originnalRequests = error.config

    if (error.response?.status === 410 && !originnalRequests._retry) {
      // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
      originnalRequests._retry = true

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi API refresh_token đồng thời gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
            return data?.accessToken
          })
          .catch((_error) => {
            //   Nếu nhận bất kỳ lỗi nào từ API refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            //   Dù API có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây.
      // eslint-disable-next-line
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
         * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi API refreshToken được gọi thành công.
         */

        // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những API ban đầu bị lỗi

        return authorizedAxiosInstance(originnalRequests)
      })
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    //  Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là success và rơi vào đây
    // Do something with response error

    // Xử lý lỗi tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
    // console.log(error) ra là sẽ thấy cấu trúc data tới message lỗi như dưới đây
    // Dùng toastfy để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.

    let errorMessage = error?.message

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    // Dùng toastfy để hiển thị bất kể mọi mã lỗi lên màng hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
